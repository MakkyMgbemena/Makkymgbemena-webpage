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