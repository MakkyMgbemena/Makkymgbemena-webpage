const {onRequest} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const crypto = require("crypto");

admin.initializeApp();

const stripeSecretKey = defineSecret("STRIPE_SECRET_KEY");

const PRICE_LOOKUP_KEYS = {
  website: "website_starter_deposit",
  automation: "automation_starter_deposit",
  marketing: "marketing_seo_starter_deposit",
  dashboards: "dashboards_starter_deposit",
  brand: "brand_design_starter_deposit",
  product: "product_presentation_starter_deposit",
  operations: "operations_setup_starter_deposit",
};

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
};

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

      if (email && password) {
        await admin.firestore().collection("users").doc(String(email).toLowerCase()).set({
          firstName: firstName || "",
          lastName: lastName || "",
          email: String(email).toLowerCase(),
          passwordHash: hashPassword(password),
          service: service || "",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        }, {merge: true});
      }

      const prices = await stripe.prices.list({lookup_keys: [lookupKey]});
      if (!prices.data.length) {
        return res.status(404).json({error: "Price not found for this service."});
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