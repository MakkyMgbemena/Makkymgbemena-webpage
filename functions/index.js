const {onRequest} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

admin.initializeApp();

const stripeSecretKey = defineSecret("STRIPE_SECRET_KEY");

const PRICE_LOOKUP_KEYS = {
  website: "website-starter-deposit",
  automation: "automation-starter-deposit",
  marketing: "marketing-SEO-starter-deposit",
  dashboards: "dashboards-starter-deposit",
  brand: "brand-design-starter-deposit",
  product: "product-presentation-starter-deposit",
  operations: "operations-setup-starter-deposit",
};

const userDoc = (email) => admin.firestore().collection("users").doc(String(email).toLowerCase());

exports.createCheckoutSession = onRequest(
  {secrets: [stripeSecretKey], cors: true},
  async (req, res) => {
    try {
      const stripe = require("stripe")(stripeSecretKey.value());
      const {firstName, lastName, email, password, service} = req.body || {};
      const lookupKey = PRICE_LOOKUP_KEYS[service];
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
            status: "Deposit started",
            updates: [{at: new Date().toISOString(), text: "Your deposit has been started."}],
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
        mode: "payment",
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

exports.getProject = onRequest({cors: true}, async (req, res) => {
  try {
    const email = await authedEmail(req);
    const doc = await userDoc(email).get();
    if (!doc.exists) return res.status(404).json({error: "No project found."});
    const u = doc.data();
    res.json({user: {email: u.email, firstName: u.firstName, lastName: u.lastName, service: u.service, status: u.status, updates: u.updates || [], comments: u.comments || []}});
  } catch (err) {
    logger.error("getProject error", err);
    res.status(401).json({error: "Please log in again."});
  }
});

exports.addProjectComment = onRequest({cors: true}, async (req, res) => {
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
exports.setSpecialistRole = onRequest({cors: true}, async (req, res) => {
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

async function requireSpecialist(req) {
  const decoded = await admin.auth().verifyIdToken((req.body || {}).token);
  if (decoded.email !== SPECIALIST_EMAIL && !decoded.specialist) throw new Error("Not specialist");
  return decoded;
}

exports.listClients = onRequest({cors: true}, async (req, res) => {
  try {
    await requireSpecialist(req);
    const snap = await admin.firestore().collection("users").get();
    const clients = snap.docs.map(d => ({email: d.id, ...d.data()}));
    res.json({clients});
  } catch (e) {
    logger.error("listClients error", e);
    res.status(401).json({error: "Not authorized."});
  }
});

exports.updateClientStatus = onRequest({cors: true}, async (req, res) => {
  try {
    await requireSpecialist(req);
    const {email, status} = req.body || {};
    if (!email || !status) return res.status(400).json({error: "email and status are required."});
    await userDoc(email).update({status});
    res.json({ok: true});
  } catch (e) {
    logger.error("updateClientStatus error", e);
    res.status(401).json({error: "Not authorized."});
  }
});

exports.sendClientUpdate = onRequest({cors: true}, async (req, res) => {
  try {
    await requireSpecialist(req);
    const {email, text} = req.body || {};
    if (!email || !text) return res.status(400).json({error: "email and text are required."});
    const ref = userDoc(email);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({error: "No project found."});
    const u = doc.data();
    const updates = Array.isArray(u.updates) ? u.updates : [];
    updates.push({at: new Date().toISOString(), text});
    await ref.update({updates});
    res.json({ok: true, updates});
  } catch (e) {
    logger.error("sendClientUpdate error", e);
    res.status(401).json({error: "Not authorized."});
  }
});

exports.replyClientComment = onRequest({cors: true}, async (req, res) => {
  try {
    await requireSpecialist(req);
    const {email, text} = req.body || {};
    if (!email || !text) return res.status(400).json({error: "email and text are required."});
    const ref = userDoc(email);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({error: "No project found."});
    const u = doc.data();
    const replies = Array.isArray(u.replies) ? u.replies : [];
    replies.push({at: new Date().toISOString(), text});
    await ref.update({replies});
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
  {secrets: [stripeSecretKey], cors: true},
  async (req, res) => {
    try {
      const stripe = require("stripe")(stripeSecretKey.value());
      const {email, business, imageUrl, videoUrl} = req.body || {};
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
        metadata: {business: business || "", imageUrl: imageUrl || "", videoUrl: videoUrl || ""},
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
  {secrets: [stripeSecretKey, stripeWebhookSecret], cors: false},
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
exports.listAds = onRequest({cors: true}, async (req, res) => {
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

exports.reviewAd = onRequest({cors: true}, async (req, res) => {
  try {
    await requireSpecialist(req);
    const {id, approve} = req.body || {};
    if (!id) return res.status(400).json({error: "id is required."});
    await admin.firestore().collection("ads").doc(id).update({
      status: approve ? "approved" : "rejected",
      reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.json({ok: true});
  } catch (e) {
    logger.error("reviewAd error", e);
    res.status(401).json({error: "Not authorized."});
  }
});

// public: approved ads for the Local Ad Screen
exports.getActiveAds = onRequest({cors: true}, async (req, res) => {
  try {
    const snap = await admin.firestore().collection("ads").orderBy("createdAt", "asc").get();
    const ads = snap.docs.map(d => ({id: d.id, ...d.data()})).filter(a => a.status === "approved");
    res.json({ads});
  } catch (e) {
    logger.error("getActiveAds error", e);
    res.json({ads: []});
  }
});
