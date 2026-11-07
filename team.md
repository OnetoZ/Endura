 # Endura Website Changes - Team Work Distribution

This document outlines the distribution of tasks for the upcoming Endura website changes among the team members: **Sandhanam, Akarshana, Abhinivesh, and Sriman**.

> **⚠️ IMPORTANT IMAGE NOTICE:** For any task that mentions images or UI mockups (e.g., Landing Page, Collection Page, Product Catalogue, Vault Page Background, Digital Artifacts Images, FAQ Contents), please **contact Sandhanam for the image or check it in the group**.

---

## 👥 Task Distribution

### 1. Sandhanam
* **A. Landing Page Improvements:** 
  * Change the background images.
  * Improve the mobile layout for better user experience.
* **J. Footer:** 
  * Implement the required UI/UX changes in the footer section.
* **K. Popup:** 
  * Implement the popup functionality and styling.
* *Dependencies:* Needs Landing Page images and UI photos. 

### 2. Akarshana
* **D. Status In-Stock Feature (Admin & Frontend):** 
  * Create a toggle functionality in the Admin Page so the admin can switch it ON/OFF.
  * When ON: "In Stock" is displayed to customers.
  * When OFF: "In Stock" is hidden from the customer-facing page.
* **I. Digital Artifacts:** 
  * Rename/Transition "Digital collectable" terminology to "Digital artifacts".
* *Dependencies:* Needs Digital Artifacts images and Product Catalogue photos.

### 3. Abhinivesh
* **B. Collection Page:** 
  * Remove the loading/transition animation that appears when users click on Collections.
  * Add the Endura logo and blinking effect.
* **C. Vault:** 
  * Remove the "Global Archive" section.
  * Implement the new animation for the Vault page.
* *Dependencies:* Needs Collection Page images and Vault Page Background photos.

### 4. Sriman
* **F. FAQ Page:** 
  * Update/build the FAQ page based on the new content.
* **H. Factions:** 
  * Add links for PDFs or direct images.
  * Build out different sections to be added according to the story.
* *Dependencies:* Needs FAQ contents and UI photos.

---

## 🚀 Execution Plan: Who Starts First?

**Phase 1: Immediate Start (Independent Tasks)**
* **Sandhanam** should start first on the **Landing Page**. Since it's the most highly visible part of the site, getting the background images and mobile layout responsive is a top priority.
* **Akarshana** should simultaneously start on the **Status In-Stock (Admin Toggle)**. This requires connecting the Admin panel state to the customer-facing frontend, which might involve database/backend tweaks. Getting this logic established early is critical.

**Phase 2: Next Steps**
* **Abhinivesh** can begin work on the **Collection Page** and **Vault Page** animations. These are highly visual components that can be built independently of the landing page or admin panel.
* **Sriman** can start assembling the **FAQ Page** and **Factions** content as soon as the text/story assets and PDFs are provided. 

---

**Remember:** If you are blocked on UI designs, photos, or content, reach out to Sandhanam immediately or check the team group!

---

# 🏗️ Architecture, Database, Backend & Security Audit (Complete Analysis)

This section provides a deep technical review of Endura's current backend, database, infrastructure costs, and user authentication security, along with what is good, what needs fixing, and prioritized next steps for production launch.

---

## 🛡️ 1. User Data, Authentication & Security Audit

### A. Password Hashing & Encryption
* **Status**: ✅ **Good**
* **Current Implementation**:
  * Passwords are hashed using `bcrypt` with `genSalt(10)` in a Mongoose `pre('save')` hook (`backend/src/models/User.js`).
  * 10 salt rounds provides industry-standard cryptographic resistance against brute-force and rainbow table attacks.
  * Password verification uses `bcrypt.compare()` inside `userSchema.methods.comparePassword()`.
* **⚠️ Critical Vulnerability to Fix**:
  * In `backend/src/models/User.js`, the `password` field **does NOT have `select: false`**.
  * Any Mongoose query (like `User.findOne()` or `User.findById()`) will automatically retrieve the hashed password into memory unless explicitly excluded with `.select('-password')`. If an endpoint returns the user object directly, the password hash could leak in API responses.
  * **Fix**: Add `select: false` to the `password` field in `User.js`, and only request `+password` during authentication queries.

### B. Two-Factor Authentication (2FA) Security
* **Status**: ⚠️ **Needs Improvement**
* **Current Implementation**:
  * 6-digit verification code with a 10-minute expiry window (`backend/src/services/twoFactorService.js`).
  * `twoFactorCode` and `twoFactorCodeExpires` correctly have `select: false` in `User.js`.
  * Code is cleared immediately upon successful verification.
* **⚠️ What Needs Fixing**:
  * **Plaintext Code Storage in DB**: The active 6-digit code is stored as plain text (`user.twoFactorCode = code`). Should be hashed with SHA-256 before saving to the database.
  * **Console Leakage**: When SMTP delivery fails, `twoFactorService.js` prints the raw 2FA code to `console.log`. In production environments with shared log aggregators (e.g. Render/Datadog), anyone with log access can view active 2FA codes.

### C. JWT & Session Storage
* **Status**: ⚠️ **Medium Risk**
* **Current Implementation**:
  * Uses `jsonwebtoken` with `expiresIn: '30d'` signed with `process.env.JWT_SECRET`.
  * Tokens are stored in browser `localStorage` on the frontend.
* **⚠️ What Needs Fixing**:
  * **No Token Revocation**: 30-day lifespan is long without a token blacklist or refresh token rotation. If a user token is intercepted, an attacker retains access for a month.
  * **XSS Exposure**: Tokens in `localStorage` are accessible by any malicious JavaScript. For banking/high-security environments, transitioning to `httpOnly`, `Secure`, `SameSite=Lax` cookies is strongly recommended.

---

## 🔥 2. Database (MongoDB Atlas)

### A. Database Connections & Connection Pooling
* **Status**: ⚠️ **Needs Tuning**
* **Current Implementation**:
  * `mongoose.connect()` in `backend/src/server.js` sets socket timeouts (`socketTimeoutMS: 45000`) but leaves `maxPoolSize` at Mongoose's default (10 connections).
* **The Dual Connection Pool Problem (Critical)**:
  * In `server.js`, `MongoStore.create({ mongoUrl: process.env.MONGO_URI })` opens a **second independent connection pool** to MongoDB Atlas for session management rather than reusing Mongoose's active client.
  * This doubles the connection overhead on Atlas for every server instance.
* **Fix**:
  * Configure pooling explicitly: `maxPoolSize: 50, minPoolSize: 5`.
  * Share client with MongoStore: `store: MongoStore.create({ client: mongoose.connection.getClient() })`.

### B. Query Performance & Indexing
* **Status**: ⚠️ **Needs Optimization**
* **Unbounded Queries**:
  * `assetController.js` executes `Asset.find(query).lean()` with no `.limit()` or pagination. As the inventory expands, fetching all products in one request degrades API latency and memory.
  * Implement pagination: `req.query.limit || 20` and `req.query.skip || 0`.
* **Regex Queries**:
  * Queries like `query.type = { $regex: type, $options: 'i' }` and `VaultCard.findOne({ description: { $regex: ... } })` trigger full collection scans because case-insensitive regex cannot leverage standard B-tree indexes.
  * Use indexed exact matches or MongoDB Text Indexes (`$text: { $search: ... }`).

---

## 🔥 3. Backend & APIs

### A. Slow Endpoints & Concurrency
* **Status**: ⚠️ **High Concurrency Risk**
* **Sequential Stock Decrement (Race Condition)**:
  * In `orderController.js` (`addOrderItems`), stock verification and stock decrements are run in separate queries without MongoDB database transactions (`session.startTransaction()`).
  * During high-volume flash drops, simultaneous purchases can pass the stock check at the exact same millisecond, leading to overselling.
  * **Fix**: Use atomic updates (`Asset.findOneAndUpdate({ _id: id, stock: { $gte: qty } }, { $inc: { stock: -qty } })`) or MongoDB ACID transactions.

### B. Rate Limiting
* **Status**: ⚠️ **Partially Implemented**
* **What is Good**:
  * `/api/auth` is protected by `authLimiter` (max 200 requests / 15 min).
* **What is Missing**:
  * Critical routes have **zero rate limiting**:
    * `/api/vault/sync`: Susceptible to automated brute-force attacks on 10-digit decryption codes.
    * `/api/upload`: Vulnerable to denial-of-service storage filling attacks.
    * `/api/orders`: Needs checkout request throttling.
  * **Fix**: Add a strict limiter for `/api/vault/sync` (e.g. 10 attempts per 15 minutes per IP).

### C. HTTP Security Headers
* **Status**: ❌ **Missing**
* The backend does not have `helmet` installed.
* **Fix**: Install `helmet` to automatically inject `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options` (prevents clickjacking), and referrer policies.

---

## 🔥 4. Application Architecture & Scalability

### A. Multi-Server Deployment & Statelessness
* **Status**: ✅ **Good**
* Auth is stateless via JWT tokens, meaning multiple backend instances can run behind a load balancer without needing sticky sessions or synchronized in-memory state.

### B. Ephemeral Disk Risk (Cloud Uploads)
* **Status**: ⚠️ **Needs Fix**
* In `uploadRoutes.js`, when Cloudflare R2 upload fails, the route falls back to writing files to the local disk (`/uploads`).
* Cloud hosting platforms like **Render**, **Heroku**, or **AWS ECS** use **ephemeral filesystems** (all files on local disk are wiped whenever the service restarts or redeploys).
* **Fix**: Remove local disk fallback in production. If R2 fails, return a clear 500 error rather than writing files that will disappear on server reboot.

---

## 🔥 5. Infrastructure Cost Analysis

| Component | Current Setup | Cost & Scalability Verdict |
| :--- | :--- | :--- |
| **Cloudflare R2** | Used for product and vault images (`pub-...r2.dev`) | 🏆 **Excellent ($0 Egress)**: AWS S3 charges ~$0.09/GB for visitor downloads. Cloudflare R2 charges **$0 egress fees**, saving hundreds of dollars as traffic grows. Storage is only ~$0.015/GB/mo. |
| **MongoDB Atlas** | Free M0 Sandbox (512MB, max 500 connections) | ⚠️ **Upgrade Needed for Launch**: Free tier throttles CPU on sustained spikes. Upgrade to **Atlas Serverless** (pay per read/write, extremely cheap for startups) or **M10** (~$57/mo) with dedicated RAM and automated point-in-time recovery. |
| **Render Hosting** | Deployed Web Service (`endura-2.onrender.com`) | ⚠️ **Watch Cold Starts**: Free tier instances spin down after 15 minutes of inactivity (causing 30-60s cold start delays for users). Upgrade to Render Starter ($7/mo) prior to public marketing drops. |
| **Email Service** | Personal Gmail SMTP via Nodemailer | ⚠️ **Risk of Account Suspension**: Gmail personal accounts cap sending at 500 emails/day and trigger automated security blocks on bulk transactional emails. Migrate to **Resend** (3,000 free emails/mo) or **AWS SES** (62,000 free emails/mo). |

---

## 📋 Prioritized Action Checklist

1. [x] **Permanent R2 Storage**: Legendary vault assets hosted directly on Cloudflare R2 with fallback handling.
2. [x] **User Model Security**: Added `select: false` to `password` in `backend/src/models/User.js`; updated `authController.js` (`loginUser`, `changePassword`) to explicitly use `+password`; hashed 2FA verification codes with SHA-256 before saving to DB.
3. [x] **Rate Limit Critical APIs**: Added specific strict rate limiters in `backend/src/server.js` for `/api/vault/sync` (25 req / 15 min), `/api/upload` (40 req / 15 min), and `/api/orders` (30 req / 10 min), alongside general API limiter.
4. [x] **Database Connection Optimization**: Reused Mongoose connection client with `connect-mongo` (`clientPromise`) to prevent redundant dual pools; configured `maxPoolSize: 50` and `minPoolSize: 5`.
5. [x] **Install Helmet**: Installed and enabled `helmet` in `backend/src/server.js` with cross-origin asset policy to enforce security headers without blocking storefront media/images.
6. [x] **Inventory Race Conditions**: Converted order stock decrements into atomic operations (`stock: { $gte: qty }`) with automated rollback to eliminate flash drop overselling.
7. [x] **Disable Ephemeral Disk Uploads**: Prevented production uploads from silently saving to ephemeral disk on Render/cloud when R2 fails.
