const {onRequest} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const {onSchedule} = require("firebase-functions/v2/scheduler");
const {google} = require("googleapis");

admin.initializeApp();

const stripeSecretKey = defineSecret("STRIPE_SECRET_KEY");
const gaServiceAccount = defineSecret("GA_SERVICE_ACCOUNT");

// Command Centre pilot config (move to Firestore when you add more clients)
const PILOT_CLIENT = "makky@travelbunny.services";
const GA4_PROPERTY_ID = "524226537";
const SEARCH_CONSOLE_SITE = "sc-domain:travelbunny.services";

const PRICE_LOOKUP_KEYS = {
  website: {
    self: "website-selfhosted",
    hosted: "website-hosted",
    custom: "website-custom",
  },
  automation: "automation-starter-deposit",
  marketing: "marketing-SEO-starter-deposit",
  dashboards: "dashboards-starter-deposit",
  brand: "brand-design-starter-deposit",
  product: "product-presentation-starter-deposit",
  operations: "operations-setup-starter-deposit",
  growth: "growth-strategy-deposit",
  bookkeeping: "bookkeeping-setup-deposit",
  "growth-monthly": "growth-strategy-monthly",
  "bookkeeping-monthly": {
    starter: "bookkeeping-starter-monthly",
    standard: "bookkeeping-monthly",
    growth: "bookkeeping-growth-monthly",
  },
  cleanup: {
    lite: "cleanup-lite-deposit",
    standard: "cleanup-standard-deposit",
    deep: "cleanup-deep-deposit",
  },
};

const userDoc = (email) => admin.firestore().collection("users").doc(String(email).toLowerCase());

exports.createCheckoutSession = onRequest(
  {secrets: [stripeSecretKey], cors: true, invoker: "public"},
  async (req, res) => {
    try {
      const stripe = require("stripe")(stripeSecretKey.value());
      const {firstName, lastName, email, password, service, tier} = req.body || {};
      const _tiers = PRICE_LOOKUP_KEYS[service];
      const lookupKey = (_tiers && typeof _tiers === "object")
        ? (_tiers[String(tier || "").toLowerCase()] || _tiers.default || null)
        : _tiers;
      if (!lookupKey) {
        return res.status(400).json({error: "Unknown service selected."});
      }

      // Existing Auth account? -> go log in (Route 1)
      let authUser = null;
      try { authUser = await admin.auth().getUserByEmail(String(email||"").toLowerCase()); }
      catch (e) {}

      if (authUser) {
        return res.json({exists: true, redirect: "/client-dashboard.html?email=" + encodeURIComponent(String(email).toLowerCase())});
      }

      // New account -> create Firebase Auth login + project, then Stripe (Route 2)
      if (email && password) {
        try {
          const user = await admin.auth().createUser({email: String(email).toLowerCase(), password});
          await userDoc(email).set({
            uid: user.uid,
            firstName: firstName || "",
            lastName: lastName || "",
            email: String(email).toLowerCase(),
            service: service || "",
            status: "Project started",
            updates: [{at: new Date().toISOString(), text: "Your project has been started."}],
            comments: [],
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          }, {merge: true});
        } catch (regErr) {
          logger.warn("Could not create auth/project", {error: regErr.message});
        }
      }

      const prices = await stripe.prices.list({lookup_keys: [lookupKey]});
      if (!prices.data.length) {
        return res.status(404).json({error: `Price not found for "${lookupKey}".`});
      }
      const session = await stripe.checkout.sessions.create({
        mode: prices.data[0].recurring ? "subscription" : "payment",
        line_items: [{price: prices.data[0].id, quantity: 1}],
        customer_email: email || undefined,
        success_url: "https://travelbunny.services/booking-success.html?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "https://travelbunny.services/booking-cancelled.html",
      });
      res.json({url: session.url});
    } catch (err) {
      logger.error("Checkout session error", err);
      res.status(500).json({error: "Something went wrong creating your checkout session."});
    }
  }
);

async function authedEmail(req) {
  const token = (req.body || {}).token;
  if (!token) throw new Error("No token");
  const decoded = await admin.auth().verifyIdToken(token);
  return String(decoded.email).toLowerCase();
}

exports.getProject = onRequest({cors: true, invoker: "public"}, async (req, res) => {
  try {
    const email = await authedEmail(req);
    const doc = await userDoc(email).get();
    if (!doc.exists) return res.status(404).json({error: "No project found."});
    const u = doc.data();
    res.json({user: {email: u.email, firstName: u.firstName, lastName: u.lastName, service: u.service, status: u.status, updates: u.updates || [], comments: u.comments || [], websiteUrl: u.websiteUrl || ""}});
  } catch (err) {
    logger.error("getProject error", err);
    res.status(401).json({error: "Please log in again."});
  }
});

exports.addProjectComment = onRequest({cors: true, invoker: "public"}, async (req, res) => {
  try {
    const email = await authedEmail(req);
    const text = String((req.body || {}).comment || "").trim();
    if (!text) return res.status(400).json({error: "Comment is empty."});
    const ref = userDoc(email);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({error: "No project found."});
    const u = doc.data();
    const comments = Array.isArray(u.comments) ? u.comments : [];
    comments.push({at: new Date().toISOString(), text});
    await ref.update({comments});
    res.json({ok: true, comments});
  } catch (err) {
    logger.error("addProjectComment error", err);
    res.status(401).json({error: "Please log in again."});
  }
});

// ===== Specialist portal (private, role-gated) =====
const SPECIALIST_EMAIL = "makky@travelbunny.services";

// one-time: grant the specialist role (self-grant for the owner account)
exports.setSpecialistRole = onRequest({cors: true, invoker: "public"}, async (req, res) => {
  try {
    const {token} = req.body || {};
    const decoded = await admin.auth().verifyIdToken(token);
    if (decoded.email !== SPECIALIST_EMAIL) return res.status(403).json({error: "Not authorized."});
    await admin.auth().setCustomUserClaims(decoded.uid, {specialist: true});
    res.json({ok: true, specialist: true});
  } catch (e) {
    logger.error("setSpecialistRole error", e);
    res.status(401).json({error: "Please log in again."});
  }
});

async function resolveSpecialist(req) {
  const decoded = await admin.auth().verifyIdToken((req.body || {}).token);
  const email = String(decoded.email || "").toLowerCase();
  const isOwner = email === SPECIALIST_EMAIL;
  let roles = [];
  if (!isOwner) {
    const doc = await admin.firestore().collection("specialists").doc(email).get();
    if (!doc.exists) throw new Error("Not specialist");
    const d = doc.data() || {};
    if (d.active === false) throw new Error("Inactive specialist");
    roles = Array.isArray(d.roles) ? d.roles : [];
  }
  return {email, isOwner, roles};
}

async function requireSpecialist(req) {
  const s = await resolveSpecialist(req);
  if (!s.isOwner && !s.roles.length) throw new Error("No roles assigned");
  return s;
}

async function requireOwner(req) {
  const decoded = await admin.auth().verifyIdToken((req.body || {}).token);
  const email = String(decoded.email || "").toLowerCase();
  if (email !== SPECIALIST_EMAIL) throw new Error("Not owner");
  return email;
}

async function logActivity(by, action, client) {
  try {
    await admin.firestore().collection("activity").add({
      at: Date.now(),
      by: String(by || "").toLowerCase(),
      action: String(action || ""),
      client: String(client || "").toLowerCase(),
    });
  } catch (e) { logger.error("logActivity error", e); }
}

exports.listClients = onRequest({cors: true, invoker: "public"}, async (req, res) => {
  try {
    const s = await requireSpecialist(req);
    const snap = await admin.firestore().collection("users").get();
    let clients = snap.docs.map(d => ({email: d.id, ...d.data()}));
    if (!s.isOwner) clients = clients.filter(c => s.roles.indexOf(String(c.service || "")) !== -1);
    res.json({clients, isOwner: s.isOwner, roles: s.roles});
  } catch (e) {
    logger.error("listClients error", e);
    res.status(401).json({error: "Not authorized."});
  }
});

exports.listSpecialists = onRequest({cors: true, invoker: "public"}, async (req, res) => {
  try {
    await requireOwner(req);
    const snap = await admin.firestore().collection("specialists").get();
    const list = snap.docs.map(d => ({email: d.id, ...d.data()}));
    list.unshift({email: SPECIALIST_EMAIL, name: "You (owner)", roles: ["all services"], isOwner: true});
    res.json({specialists: list, owner: SPECIALIST_EMAIL});
  } catch (e) {
    logger.error("listSpecialists error", e);
    res.status(401).json({error: "Not authorized."});
  }
});


// ===== Partner workspace: jobs, expenses, invoices =====
function periodKey(ts) {
  const d = new Date(ts);
  return d.getUTCFullYear() + "-" + String(d.getUTCMonth() + 1).padStart(2, "0");
}
function partnerOf(s, b) {
  return String((s.isOwner ? (b || {}).partner : s.email) || "").toLowerCase();
}

exports.addJob = onRequest({cors: true, invoker: "public"}, async (req, res) => {
  try {
    const s = await requireSpecialist(req);
    const b = req.body || {};
    const partner = partnerOf(s, b);
    if (!partner || !b.deliverable) return res.status(400).json({error: "partner and deliverable are required."});
    const doc = await admin.firestore().collection("jobs").add({
      partner,
      client: String(b.client || "").toLowerCase(),
      deliverable: String(b.deliverable),
      fee: Number(b.fee) || 0,
      status: "active",
      period: periodKey(Date.now()),
      createdAt: Date.now(),
      createdBy: s.email,
    });
    await logActivity(s.email, "Created job: " + b.deliverable, partner);
    res.json({ok: true, id: doc.id});
  } catch (e) { logger.error("addJob error", e); res.status(401).json({error: "Not authorized."}); }
});

exports.listJobs = onRequest({cors: true, invoker: "public"}, async (req, res) => {
  try {
    const s = await requireSpecialist(req);
    const snap = await admin.firestore().collection("jobs").orderBy("createdAt", "desc").limit(300).get();
    let jobs = snap.docs.map(d => ({id: d.id, ...d.data()}));
    if (!s.isOwner) jobs = jobs.filter(x => x.partner === s.email);
    res.json({jobs, isOwner: s.isOwner});
  } catch (e) { logger.error("listJobs error", e); res.status(401).json({error: "Not authorized."}); }
});

exports.updateJobStatus = onRequest({cors: true, invoker: "public"}, async (req, res) => {
  try {
    const s = await requireSpecialist(req);
    const {id, status} = req.body || {};
    if (!id || !status) return res.status(400).json({error: "id and status are required."});
    const ref = admin.firestore().collection("jobs").doc(id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({error: "Job not found."});
    if (!s.isOwner && doc.data().partner !== s.email) return res.status(403).json({error: "Not your job."});
    await ref.update({status, statusAt: Date.now()});
    await logActivity(s.email, "Job marked " + status, doc.data().client || "");
    res.json({ok: true});
  } catch (e) { logger.error("updateJobStatus error", e); res.status(401).json({error: "Not authorized."}); }
});

exports.addExpense = onRequest({cors: true, invoker: "public"}, async (req, res) => {
  try {
    const s = await requireSpecialist(req);
    const b = req.body || {};
    const partner = partnerOf(s, b);
    const amount = Number(b.amount) || 0;
    if (!partner || amount <= 0) return res.status(400).json({error: "partner and a positive amount are required."});
    const doc = await admin.firestore().collection("expenses").add({
      partner,
      client: String(b.client || "").toLowerCase(),
      amount,
      category: String(b.category || "Expense"),
      note: String(b.note || ""),
      receiptUrl: String(b.receiptUrl || ""),
      status: "submitted",
      period: periodKey(Date.now()),
      createdAt: Date.now(),
      createdBy: s.email,
    });
    await logActivity(s.email, "Submitted an expense ($" + amount + ")", partner);
    res.json({ok: true, id: doc.id});
  } catch (e) { logger.error("addExpense error", e); res.status(401).json({error: "Not authorized."}); }
});

exports.listExpenses = onRequest({cors: true, invoker: "public"}, async (req, res) => {
  try {
    const s = await requireSpecialist(req);
    const snap = await admin.firestore().collection("expenses").orderBy("createdAt", "desc").limit(300).get();
    let expenses = snap.docs.map(d => ({id: d.id, ...d.data()}));
    if (!s.isOwner) expenses = expenses.filter(x => x.partner === s.email);
    res.json({expenses, isOwner: s.isOwner});
  } catch (e) { logger.error("listExpenses error", e); res.status(401).json({error: "Not authorized."}); }
});

exports.reviewExpense = onRequest({cors: true, invoker: "public"}, async (req, res) => {
  try {
    await requireOwner(req);
    const {id, approve} = req.body || {};
    if (!id) return res.status(400).json({error: "id is required."});
    await admin.firestore().collection("expenses").doc(id).update({
      status: approve ? "approved" : "rejected",
      reviewedAt: Date.now(),
    });
    res.json({ok: true});
  } catch (e) { logger.error("reviewExpense error", e); res.status(401).json({error: "Not authorized."}); }
});

exports.addInvoice = onRequest({cors: true, invoker: "public"}, async (req, res) => {
  try {
    const s = await requireSpecialist(req);
    const b = req.body || {};
    const partner = partnerOf(s, b);
    if (!partner) return res.status(400).json({error: "partner is required."});
    const period = String(b.period || periodKey(Date.now()));
    const jobsSnap = await admin.firestore().collection("jobs").where("partner", "==", partner).get();
    const expSnap = await admin.firestore().collection("expenses").where("partner", "==", partner).get();
    const lines = []
      .concat(jobsSnap.docs.map(d => ({id: d.id, ...d.data()}))
        .filter(x => x.period === period && x.status === "done")
        .map(x => ({type: "job", label: x.deliverable, amount: Number(x.fee) || 0})))
      .concat(expSnap.docs.map(d => ({id: d.id, ...d.data()}))
        .filter(x => x.period === period && x.status === "approved")
        .map(x => ({type: "expense", label: x.category, amount: Number(x.amount) || 0})));
    const total = lines.reduce((a, l) => a + (Number(l.amount) || 0), 0);
    if (!total) return res.status(400).json({error: "Nothing to invoice for " + period + " (no completed jobs or approved expenses)."});
    const doc = await admin.firestore().collection("invoices").add({
      partner, period, lines, total, status: "submitted", createdAt: Date.now(),
    });
    await logActivity(s.email, "Submitted invoice " + period + " ($" + total + ")", partner);
    res.json({ok: true, id: doc.id, total, lines});
  } catch (e) { logger.error("addInvoice error", e); res.status(401).json({error: "Not authorized."}); }
});

exports.listInvoices = onRequest({cors: true, invoker: "public"}, async (req, res) => {
  try {
    const s = await requireSpecialist(req);
    const snap = await admin.firestore().collection("invoices").orderBy("createdAt", "desc").limit(200).get();
    let invoices = snap.docs.map(d => ({id: d.id, ...d.data()}));
    if (!s.isOwner) invoices = invoices.filter(x => x.partner === s.email);
    res.json({invoices, isOwner: s.isOwner});
  } catch (e) { logger.error("listInvoices error", e); res.status(401).json({error: "Not authorized."}); }
});

exports.reviewInvoice = onRequest({cors: true, invoker: "public"}, async (req, res) => {
  try {
    await requireOwner(req);
    const {id, status} = req.body || {};
    if (!id || !status) return res.status(400).json({error: "id and status are required."});
    const patch = {status};
    if (status === "paid") patch.paidAt = Date.now();
    await admin.firestore().collection("invoices").doc(id).update(patch);
    res.json({ok: true});
  } catch (e) { logger.error("reviewInvoice error", e); res.status(401).json({error: "Not authorized."}); }
});


// ===== Command Centre: GA4 + Search Console -> metrics snapshot =====
function gaAuth(scopes) {
  const credentials = JSON.parse(gaServiceAccount.value());
  return new google.auth.GoogleAuth({credentials, scopes});
}

function pctChange(current, previous) {
  const cur = Number(current) || 0;
  const prev = Number(previous) || 0;
  if (!prev) return null;
  return ((cur - prev) / prev) * 100;
}

function isoDay(ts) {
  return new Date(ts).toISOString().slice(0, 10);
}

exports.refreshMetrics = onSchedule(
  {schedule: "every 4 hours", timeZone: "America/Toronto", secrets: [gaServiceAccount, stripeSecretKey]},
  async () => {
    const cards = {};
    const DAY = 24 * 60 * 60 * 1000;
    const now = Date.now();

    // GA4: active users, last 28 days vs the 28 before
    try {
      const analytics = google.analyticsdata({
        version: "v1beta",
        auth: gaAuth(["https://www.googleapis.com/auth/analytics.readonly"]),
      });
      const [ga] = await analytics.properties.runReport({
        property: `properties/${GA4_PROPERTY_ID}`,
        requestBody: {
          dateRanges: [
            {startDate: "28daysAgo", endDate: "today"},
            {startDate: "56daysAgo", endDate: "29daysAgo"},
          ],
          metrics: [{name: "activeUsers"}],
        },
      });
      const row = (ga.rows || [])[0];
      const cur = row ? Number(row.metricValues[0].value) : 0;
      const prev = row ? Number(row.metricValues[1].value) : 0;
      cards.website = {label: "Visitors", value: cur, delta: pctChange(cur, prev)};
      logger.info("GA4 ok", {cur, prev});
    } catch (e) {
      logger.error("GA4 connector failed", e);
    }

    // Search Console: clicks, last 28 days vs the 28 before
    try {
      const sc = google.searchconsole({
        version: "v1",
        auth: gaAuth(["https://www.googleapis.com/auth/webmasters.readonly"]),
      });
      const query = (start, end) => sc.searchanalytics.query({
        siteUrl: SEARCH_CONSOLE_SITE,
        requestBody: {
          startDate: isoDay(start),
          endDate: isoDay(end),
          dimensions: ["date"],
          rowLimit: 100,
        },
      });
      const [curRes, prevRes] = await Promise.all([
        query(now - 28 * DAY, now),
        query(now - 56 * DAY, now - 29 * DAY),
      ]);
      const sum = (r) => (r.data.rows || []).reduce((a, x) => a + (Number(x.clicks) || 0), 0);
      const cur = sum(curRes);
      const prev = sum(prevRes);
      cards.search = {label: "Clicks", value: cur, delta: pctChange(cur, prev)};
      logger.info("GSC ok", {cur, prev});
    } catch (e) {
      logger.error("Search Console connector failed", e);
    }

    // Stripe: revenue collected, last 28 days vs the 28 before
    try {
      const stripe = require("stripe")(stripeSecretKey.value());
      const nowSec = Math.floor(now / 1000);
      const span = DAY / 1000;
      const [curPi, prevPi] = await Promise.all([
        stripe.paymentIntents.list({limit: 100, created: {gte: nowSec - span}}),
        stripe.paymentIntents.list({limit: 100, created: {gte: nowSec - 2 * span, lt: nowSec - span}}),
      ]);
      const total = (res) => res.data
          .filter((p) => p.status === "succeeded")
          .reduce((a, p) => a + (Number(p.amount_received) || 0), 0) / 100;
      const curRev = total(curPi);
      const prevRev = total(prevPi);
      cards.revenue = {label: "Revenue", value: curRev, delta: pctChange(curRev, prevRev), money: true};
      logger.info("Stripe ok", {curRev, prevRev});
    } catch (e) {
      logger.error("Stripe connector failed", e);
    }

    await admin.firestore().collection("metrics").doc(PILOT_CLIENT).set({
      updatedAt: Date.now(),
      cards,
      sources: ["ga4", "searchconsole"],
    }, {merge: true});
  }
);

exports.getMetrics = onRequest({cors: true, invoker: "public"}, async (req, res) => {
  try {
    const email = await authedEmail(req);
    let doc = await admin.firestore().collection("metrics").doc(email).get();
    if (!doc.exists) doc = await admin.firestore().collection("metrics").doc(PILOT_CLIENT).get();
    res.json({metrics: doc.exists ? doc.data() : null});
  } catch (e) {
    logger.error("getMetrics error", e);
    res.status(401).json({error: "Please log in again."});
  }
});


// ===== Owner console: payments + subscriptions from Stripe =====
exports.listPayments = onRequest(
  {cors: true, invoker: "public", secrets: [stripeSecretKey]},
  async (req, res) => {
    try {
      await requireOwner(req);
      const stripe = require("stripe")(stripeSecretKey.value());
      const [payments, subs] = await Promise.all([
        stripe.paymentIntents.list({limit: 25}),
        stripe.subscriptions.list({limit: 25, status: "all"}),
      ]);
      res.json({
        payments: payments.data.map((p) => ({
          id: p.id,
          amount: (Number(p.amount_received) || 0) / 100,
          currency: p.currency,
          status: p.status,
          created: p.created * 1000,
          email: p.receipt_email || "",
        })),
        subscriptions: subs.data.map((s) => {
          const item = (s.items && s.items.data && s.items.data[0]) || {};
          const price = item.price || {};
          return {
            id: s.id,
            status: s.status,
            amount: (Number(price.unit_amount) || 0) / 100,
            currency: price.currency || "cad",
            interval: (price.recurring && price.recurring.interval) || "",
            renews: (s.current_period_end || item.current_period_end || 0) * 1000,
            cancelAtPeriodEnd: !!s.cancel_at_period_end,
          };
        }),
      });
    } catch (e) {
      logger.error("listPayments error", e);
      res.status(401).json({error: "Not authorized."});
    }
  }
);

exports.listActivity = onRequest({cors: true, invoker: "public"}, async (req, res) => {
  try {
    await requireOwner(req);
    const snap = await admin.firestore().collection("activity").orderBy("at", "desc").limit(200).get();
    // Scheduled refreshes are a heartbeat, not activity - keep them out of the feed.
    const activity = snap.docs.map(d => d.data()).filter(a => a.by !== "system").slice(0, 40);
    res.json({activity});
  } catch (e) {
    logger.error("listActivity error", e);
    res.status(401).json({error: "Not authorized."});
  }
});

exports.addSpecialist = onRequest({cors: true, invoker: "public"}, async (req, res) => {
  try {
    await requireOwner(req);
    const {email, name, roles} = req.body || {};
    if (!email) return res.status(400).json({error: "email is required."});
    const key = String(email).toLowerCase();
    let setupLink = "";
    try { await admin.auth().getUserByEmail(key); }
    catch (e) { await admin.auth().createUser({email: key, displayName: String(name || "").trim() || undefined}); }
    try { setupLink = await admin.auth().generatePasswordResetLink(key); } catch (e) { setupLink = ""; }
    await admin.firestore().collection("specialists").doc(key).set({
      email: key,
      name: String(name || "").trim(),
      roles: Array.isArray(roles) ? roles : [],
      active: true,
      updatedAt: Date.now(),
    }, {merge: true});
    res.json({ok: true, setupLink});
  } catch (e) {
    logger.error("addSpecialist error", e);
    res.status(401).json({error: "Not authorized."});
  }
});

exports.removeSpecialist = onRequest({cors: true, invoker: "public"}, async (req, res) => {
  try {
    await requireOwner(req);
    const {email} = req.body || {};
    if (!email) return res.status(400).json({error: "email is required."});
    await admin.firestore().collection("specialists").doc(String(email).toLowerCase()).delete();
    res.json({ok: true});
  } catch (e) {
    logger.error("removeSpecialist error", e);
    res.status(401).json({error: "Not authorized."});
  }
});

exports.updateClientStatus = onRequest({cors: true, invoker: "public"}, async (req, res) => {
  try {
    const s = await requireSpecialist(req);
    const {email, status} = req.body || {};
    if (!email || !status) return res.status(400).json({error: "email and status are required."});
    await userDoc(email).update({status});
    await logActivity(s.email, 'Set status to "' + status + '"', email);
    res.json({ok: true});
  } catch (e) {
    logger.error("updateClientStatus error", e);
    res.status(401).json({error: "Not authorized."});
  }
});

exports.updateClientWebsite = onRequest({cors: true, invoker: "public"}, async (req, res) => {
  try {
    const s = await requireSpecialist(req);
    const {email, websiteUrl} = req.body || {};
    if (!email) return res.status(400).json({error: "email is required."});
    await userDoc(email).update({websiteUrl: String(websiteUrl || "").trim()});
    await logActivity(s.email, "Updated the client website link", email);
    res.json({ok: true});
  } catch (e) {
    logger.error("updateClientWebsite error", e);
    res.status(401).json({error: "Not authorized."});
  }
});

exports.sendClientUpdate = onRequest({cors: true, invoker: "public"}, async (req, res) => {
  try {
    const s = await requireSpecialist(req);
    const {email, text} = req.body || {};
    if (!email || !text) return res.status(400).json({error: "email and text are required."});
    const ref = userDoc(email);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({error: "No project found."});
    const u = doc.data();
    const updates = Array.isArray(u.updates) ? u.updates : [];
    updates.push({at: new Date().toISOString(), text, by: s.email});
    await ref.update({updates});
    await logActivity(s.email, "Posted a project update", email);
    res.json({ok: true, updates});
  } catch (e) {
    logger.error("sendClientUpdate error", e);
    res.status(401).json({error: "Not authorized."});
  }
});

exports.replyClientComment = onRequest({cors: true, invoker: "public"}, async (req, res) => {
  try {
    const s = await requireSpecialist(req);
    const {email, text} = req.body || {};
    if (!email || !text) return res.status(400).json({error: "email and text are required."});
    const ref = userDoc(email);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({error: "No project found."});
    const u = doc.data();
    const replies = Array.isArray(u.replies) ? u.replies : [];
    replies.push({at: new Date().toISOString(), text, by: s.email});
    await ref.update({replies});
    await logActivity(s.email, "Replied to a client comment", email);
    res.json({ok: true, replies});
  } catch (e) {
    logger.error("replyClientComment error", e);
    res.status(401).json({error: "Not authorized."});
  }
});

// ===== Local Ad Screen: subscription checkout + daily intake cap =====
const AD_LOOKUP = "ad-screen-starter-monthly-cad";
const AD_DAILY_CAP = 10;

exports.adCheckout = onRequest(
  {secrets: [stripeSecretKey], cors: true, invoker: "public"},
  async (req, res) => {
    try {
      const stripe = require("stripe")(stripeSecretKey.value());
      const {email, business, city, imageUrl, videoUrl} = req.body || {};
      if (!email) return res.status(400).json({error: "Email is required."});

      const db = admin.firestore();
      const day = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const counter = await db.collection("adMeta").doc(day).get();
      const used = counter.exists ? (counter.data().intake || 0) : 0;
      if (used >= AD_DAILY_CAP) {
        return res.status(409).json({error: "Today's ad intake is full. Please try again tomorrow."});
      }

      const prices = await stripe.prices.list({lookup_keys: [AD_LOOKUP]});
      if (!prices.data.length) return res.status(404).json({error: `Ad price not found for "${AD_LOOKUP}".`});

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{price: prices.data[0].id, quantity: 1}],
        customer_email: email,
        metadata: {business: business || "", city: city || "", imageUrl: imageUrl || "", videoUrl: videoUrl || ""},
        success_url: "https://travelbunny.services/ad-success.html",
        cancel_url: "https://travelbunny.services/ad-cancelled.html",
      });
      res.json({url: session.url});
    } catch (err) {
      logger.error("adCheckout error", err);
      res.status(500).json({error: "Something went wrong starting your ad checkout."});
    }
  }
);

// ===== Local Ad Screen: Stripe webhook -> pending/active/expired ad =====
const stripeWebhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");

const adsBySub = (subId) => admin.firestore().collection("ads").where("stripeSubId", "==", subId).limit(1);

exports.adWebhook = onRequest(
  {secrets: [stripeSecretKey, stripeWebhookSecret], cors: false, invoker: "public"},
  async (req, res) => {
    const stripe = require("stripe")(stripeSecretKey.value());
    const sig = req.headers["stripe-signature"];
    const payload = req.rawBody || Buffer.from(JSON.stringify(req.body || {}));
    let event;
    try {
      event = stripe.webhooks.constructEvent(payload, sig, stripeWebhookSecret.value());
    } catch (e) {
      return res.status(400).json({error: "Webhook signature verification failed."});
    }

    const db = admin.firestore();
    if (event.type === "checkout.session.completed") {
      const s = event.data.object;
      const meta = s.metadata || {};
      const day = new Date().toISOString().slice(0, 10);
      await db.collection("ads").add({
        business: meta.business || "",
        imageUrl: meta.imageUrl || "",
        videoUrl: meta.videoUrl || "",
        city: meta.city || "",
        email: s.customer_email || "",
        stripeCustomer: s.customer,
        stripeSubId: s.subscription,
        status: "pending",
        day: day,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      await db.collection("adMeta").doc(day).set(
        {intake: admin.firestore.FieldValue.increment(1)},
        {merge: true}
      );
    } else if (event.type === "invoice.paid") {
      const inv = event.data.object;
      const snap = await adsBySub(inv.subscription).get();
      if (!snap.empty) {
        await snap.docs[0].ref.update({status: "active", paidAt: admin.firestore.FieldValue.serverTimestamp()});
      }
    } else if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object;
      const snap = await adsBySub(sub.id).get();
      if (!snap.empty) { await snap.docs[0].ref.update({status: "expired"}); }
    }
    res.json({received: true});
  }
);

// ===== Local Ad Screen: specialist review =====
exports.listAds = onRequest({cors: true, invoker: "public"}, async (req, res) => {
  try {
    await requireSpecialist(req);
    const snap = await admin.firestore().collection("ads").orderBy("createdAt", "desc").get();
    const ads = snap.docs.map(d => ({id: d.id, ...d.data()}));
    res.json({ads});
  } catch (e) {
    logger.error("listAds error", e);
    res.status(401).json({error: "Not authorized."});
  }
});

exports.reviewAd = onRequest({cors: true, invoker: "public"}, async (req, res) => {
  try {
    const s = await requireSpecialist(req);
    const {id, approve} = req.body || {};
    if (!id) return res.status(400).json({error: "id is required."});
    await admin.firestore().collection("ads").doc(id).update({
      status: approve ? "approved" : "rejected",
      reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    await logActivity(s.email, (approve ? "Approved" : "Rejected") + " an ad submission", id);
    res.json({ok: true});
  } catch (e) {
    logger.error("reviewAd error", e);
    res.status(401).json({error: "Not authorized."});
  }
});

// public: approved ads for the Local Ad Screen
exports.getActiveAds = onRequest({cors: true, invoker: "public"}, async (req, res) => {
  try {
    const snap = await admin.firestore().collection("ads").orderBy("createdAt", "asc").get();
    const ads = snap.docs.map(d => ({id: d.id, ...d.data()})).filter(a => a.status === "approved");
    res.json({ads});
  } catch (e) {
    logger.error("getActiveAds error", e);
    res.json({ads: []});
  }
});

exports.deleteAd = onRequest({cors: true, invoker: "public"}, async (req, res) => {
  try {
    const s = await requireSpecialist(req);
    const {id} = req.body || {};
    if (!id) return res.status(400).json({error: "id is required."});
    await admin.firestore().collection("ads").doc(id).delete();
    await logActivity(s.email, "Deleted an ad submission", id);
    res.json({ok: true});
  } catch (e) {
    logger.error("deleteAd error", e);
    res.status(401).json({error: "Not authorized."});
  }
});


// ===== Local Ad Screen: manual upload by a specialist/owner =====
exports.createAd = onRequest({cors: true, invoker: "public"}, async (req, res) => {
  try {
    const s = await requireSpecialist(req);
    const {business, city, email, imageUrl, videoUrl} = req.body || {};
    if (!business || !String(business).trim()) {
      return res.status(400).json({error: "business is required."});
    }
    if (!imageUrl && !videoUrl) {
      return res.status(400).json({error: "A media URL is required."});
    }
    const day = new Date().toISOString().slice(0, 10);
    const ref = await admin.firestore().collection("ads").add({
      business: String(business).trim(),
      city: String(city || "").trim(),
      email: String(email || "").trim(),
      imageUrl: imageUrl || "",
      videoUrl: videoUrl || "",
      status: "approved",
      source: "manual",
      day,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    await logActivity(s.email, "Added an ad manually: " + String(business).trim(), ref.id);
    res.json({ok: true, id: ref.id});
  } catch (e) {
    logger.error("createAd error", e);
    res.status(401).json({error: "Not authorized."});
  }
});
