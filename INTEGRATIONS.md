# Travel Bunny — Integrations Build Plan

The Command Centre widgets are **designed and shipped**. What's left is feeding them real data.
Nothing is scraped from the browser: each source is pulled **server-side** by a scheduled Cloud
Function that writes a snapshot to Firestore, and the dashboard reads the snapshot.

---

## Phase 1 — start here (all doable now)

### 1A. Foundation (one-time, do this first)

- [ ] Google Cloud Console, project `makkymgbemena-webpage`
- [ ] Enable **Google Analytics Data API**
- [ ] Enable **Google Search Console API**
- [ ] Create a **service account** — e.g. `dashboards@makkymgbemena-webpage.iam.gserviceaccount.com`
- [ ] Create a **JSON key** for it and download it
- [ ] Store the key as a Firebase secret:

      firebase functions:secrets:set GA_SERVICE_ACCOUNT

- [ ] Grant the service-account email access:
  - [ ] **GA4:** Admin → Property access management → add as **Viewer**
  - [ ] **Search Console:** Settings → Users and permissions → add as **Full** (or Restricted)
- [ ] Confirm the **Secret Manager API** is enabled on the project

### 1B. Code

- [ ] `functions/`: add the `googleapis` dependency
- [ ] `refreshMetrics` function — callable now, plus a **daily schedule**
- [ ] Connector: **Stripe** — revenue, payments, refunds (key already in Firebase)
- [ ] Connector: **GA4** — users/sessions, conversions
- [ ] Connector: **Search Console** — clicks, impressions, average position
- [ ] Snapshot schema: `metrics/<clientEmail>` → `{ updatedAt, range, cards: { revenue, website, search, … } }`
- [ ] Client dashboard: widgets read the snapshot (markup is already in place)
- [ ] Owner console: **Connect / Refresh** controls + per-client source fields
      (`ga4PropertyId`, `gscSiteUrl`)
- [ ] States + safety: stale data, reauth-required, error → surfaced on the widget dot,
      and every refresh logged to the `activity` feed

### 1C. Info to gather per client

- [ ] Client's **GA4 Property ID** (GA4 → Admin → Property settings)
- [ ] Client's **Search Console property URL** (exact, as it appears in GSC)
- [ ] Client confirms they've granted the service account access to both

---

## Phase 2 — own the numbers

- [ ] **Google Business Profile** — apply for **GBP API** access (Google approval; **start early**, it takes time)
- [ ] **QuickBooks** — create an **Intuit developer app** → OAuth connect → store refresh token (encrypted)
- [ ] **Shopify** — per-store custom app token (or public OAuth app) → orders, revenue
- [ ] Client doc fields: `quickbooksRealmId`, `shopifyShop`, encrypted tokens

---

## Phase 3 — reach & reputation

- [ ] **Meta** (Facebook / Instagram) — app + app review + Page insights
- [ ] **TikTok** — developer app + review
- [ ] **LinkedIn** — app + Marketing API access
- [ ] **Yelp** — Fusion API key (limited data)

---

## Tomorrow's checklist — gathering information

- [ ] Create the Google **service account** + download the JSON key
- [ ] Enable the **Analytics Data API** + **Search Console API**
- [ ] Send me the **GA4 property ID** and **Search Console URL** for the first test client
- [ ] Start the **Google Business Profile API** access request (approval lag)
- [ ] Create the **Intuit developer app** (QuickBooks) → client ID + secret
- [ ] Create a **Shopify custom app** on your own store first (safest test)
- [ ] Decide the **pilot client** whose data we wire first

---

## Notes / decisions

- Secrets stay **server-side only** — never in the browser, never in `VITE_` vars.
- Refresh cadence: once daily is plenty; manual **Refresh now** for the owner.
- Tokens for OAuth sources (QuickBooks, Shopify, social) are **encrypted at rest** and
  never returned to the client page.
- Add each new source as its own connector file so one failing source can't break the rest.
