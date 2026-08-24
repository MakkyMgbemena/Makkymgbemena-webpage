const {onRequest} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const crypto = require("crypto");

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

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
};

const verifyPassword = (password, stored) => {
  const [salt, hash] = String(stored || "").split(":");
  if (!salt || !hash) return false;
  const check = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(check, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

const db = () => admin.firestore();

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

      let accountExists = false;
      if (email) {
        try {
          const doc = await db().collection("users").doc(String(email).toLowerCase()).get();
          accountExists = doc.exists;
        } catch (e) {
          logger.warn("Could not read user doc", {error: e.message});
        }
      }

      if (accountExists) {
        return res.json({exists: true, redirect: "/client-dashboard.html?email=" + encodeURIComponent(String(email).toLowerCase())});
      }

      if (email && password) {
        try {
          await db().collection("users").doc(String(email).toLowerCase()).set({
            firstName: firstName || "",
            lastName: lastName || "",
            email: String(email).toLowerCase(),
            passwordHash: hashPassword(password),
            service: service || "",
            status: "Deposit started",
            updates: [{at: new Date().toISOString(), text: "Your deposit has been started."}],
            comments: [],
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          }, {merge: true});
        } catch (regErr) {
          logger.warn("Could not store user registration", {error: regErr.message});
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

exports.loginUser = onRequest({cors: true}, async (req, res) => {
  try {
    const {email, password} = req.body || {};
    if (!email || !password) return res.status(400).json({error: "Email and password are required."});
    const ref = db().collection("users").doc(String(email).toLowerCase());
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({error: "No account found for that email."});
    const user = doc.data();
    if (!verifyPassword(password, user.passwordHash)) return res.status(401).json({error: "Incorrect password."});
    const token = crypto.randomBytes(24).toString("hex");
    await ref.update({sessionToken: token});
    res.json({token, user: {
      email: user.email, firstName: user.firstName, lastName: user.lastName,
      service: user.service, status: user.status, updates: user.updates || [], comments: user.comments || [],
    }});
  } catch (err) {
    logger.error("loginUser error", err);
    res.status(500).json({error: "Something went wrong logging you in."});
  }
});

exports.getProject = onRequest({cors: true}, async (req, res) => {
  try {
    const {email, token} = req.body || {};
    if (!email || !token) return res.status(400).json({error: "Missing email or token."});
    const ref = db().collection("users").doc(String(email).toLowerCase());
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({error: "Account not found."});
    const user = doc.data();
    if (user.sessionToken !== token) return res.status(401).json({error: "Session expired. Please log in again."});
    res.json({user: {
      email: user.email, firstName: user.firstName, lastName: user.lastName,
      service: user.service, status: user.status, updates: user.updates || [], comments: user.comments || [],
    }});
  } catch (err) {
    logger.error("getProject error", err);
    res.status(500).json({error: "Something went wrong."});
  }
});

exports.addProjectComment = onRequest({cors: true}, async (req, res) => {
  try {
    const {email, token, comment} = req.body || {};
    if (!email || !token) return res.status(400).json({error: "Missing email or token."});
    const text = String(comment || "").trim();
    if (!text) return res.status(400).json({error: "Comment is empty."});
    const ref = db().collection("users").doc(String(email).toLowerCase());
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({error: "Account not found."});
    const user = doc.data();
    if (user.sessionToken !== token) return res.status(401).json({error: "Session expired. Please log in again."});
    const comments = Array.isArray(user.comments) ? user.comments : [];
    comments.push({at: new Date().toISOString(), text});
    await ref.update({comments});
    res.json({ok: true, comments});
  } catch (err) {
    logger.error("addProjectComment error", err);
    res.status(500).json({error: "Something went wrong."});
  }
});