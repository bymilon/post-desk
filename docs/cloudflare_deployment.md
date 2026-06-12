# Cloudflare Deployment & Configuration Walkthrough

PostDesk is native-compatible with modern Serverless edge infrastructure. This guide covers how to deploy the React 19 single-page application (SPA) to **Cloudflare Pages** and route API traffic to **Cloudflare Workers** (or run as a unified Hono monorepo deployment) utilizing a LibSQL/Turso database or Cloudflare D1.

---

## 1. Architectural Distribution on Cloudflare

Because PostDesk separates its layers dynamically, we have two primary paths to deploy it to Cloudflare:

```
                  ┌────────────────────────────────────────┐
                  │          USER WEB BROWSER              │
                  └───────────────────┬────────────────────┘
                                      │
                 ┌────────────────────┴────────────────────┐
                 ▼                                         ▼
   [ Static Assets & React UI ]              [ API Queries & Mutates ]
     Cloudflare Pages Hosting                  Cloudflare Worker (Hono)
                 │                                         │
                 │ (Inbound Request proxy)                 │ (Edge compute lookup)
                 └────────────────────┬────────────────────┘
                                      ▼
                           [ Persistent Storage ]
                          Turso DB / Cloudflare D1
```

1. **Frontend**: Cloudflare Pages hosts the compiled static SPA assets (`dist/` directory) with optimized edge caching.
2. **Backend**: A Hono Worker running on Cloudflare Workers serves the `/api/v1/*` routes, communicating with a cloud SQL/SQLite engine.
3. **Database**: A distributed, edge-native LibSQL instance via **Turso** (perfect match for our `@libsql/client` driver) or **Cloudflare D1**.

---

## 2. Option A: Integrated Turso (LibSQL) Cloud Setup

Because the local development engine of PostDesk uses `@libsql/client`, migrating to **Turso** is seamless. It requires zero code changes to your database schema.

### Step 1: Create a Turso Database
1. Download the Turso CLI and authenticate:
   ```bash
   curl -sSfL https://get.tur.so/install.sh | sh
   turso auth login
   ```
2. Create a new database:
   ```bash
   turso db create post-desk-db
   ```
3. Get the database URL and credentials:
   ```bash
   turso db show post-desk-db --show-urls
   ```
4. Create a persistent access token:
   ```bash
   turso db tokens create post-desk-db
   ```

### Step 2: Bootstrap/Migrate the Database Schema
Execute the schema setup scripts against your online Turso instance by passing the environment parameters:
```bash
DATABASE_URL="libsql://your-db-name-your-user.turso.io" DATABASE_AUTH_TOKEN="your-secure-turso-token" npm run db:setup
```

---

## 3. Option B: Cloudflare Workers API Deployment

To deploy the Hono backend as a Cloudflare Worker:

### Step 1: Install Wrangler CLI
Make sure Wrangler is installed locally:
```bash
npm install -g wrangler
```

### Step 2: Configure Worker Settings (`wrangler.toml`)
Create a `wrangler.toml` file in the root of your project directory:

```toml
name = "post-desk-api"
main = "src/worker.ts" # Pointing to the Cloudflare optimized entry point
compatibility_date = "2026-06-11"

[vars]
DATABASE_URL = "libsql://post-desk-db-username.turso.io"

# Secure your database token in Cloudflare Secrets instead of cleartext environment variables:
# Run: wrangler secret put DATABASE_AUTH_TOKEN
```

### Step 3: Run Worker Locally for Verification
You can test the worker edge behavior with wrangler:
```bash
wrangler dev
```

### Step 4: Publish to Cloudflare Edge
Deploy your backend worker code globally:
```bash
wrangler deploy
```

---

## 4. Frontend Deployment on Cloudflare Pages

To deploy the React single-page workspace:

### Step 1: Configure Vite Output for SPA Routing
Cloudflare Pages needs to fallback page requests to `index.html` to allow React Router to handle view states.
Create an empty `_redirects` file under your static asset directory (`public/_redirects` or configure it to build out to `dist/_redirects`):
```text
/* /index.html 200
```

### Step 2: Build the React Application Locally
```bash
npm run build
```
This leaves optimized production-ready static assets inside the `dist/` folder.

### Step 3: Deploy via Wrangler or Cloudflare Dashboard
You can upload the static built assets directly from your command line:
```bash
wrangler pages deploy dist --project-name=post-desk-web
```

### Step 4: Add Custom Domain & API Path Proxy Routing
To avoid multi-origin CORS validation issues, route all static page traffic and API server requests under a unified domain name (e.g. `postdesk.yourdomain.com`):

1. Go to your Cloudflare Dashboard.
2. Select your **Cloudflare Pages** Web Project.
3. Under **Custom Domains**, link your root or subdomain (e.g. `postdesk.com`).
4. Select your **Cloudflare Worker** API.
5. In the **Triggers** tab, add a **Custom Route** pointing API requests to the exact subdomain suffix:
   * Route: `postdesk.com/api/*`

This aligns your API routes seamlessly with the frontend client.

---

## 5. Security & Edge Configuration Checklist

1. **WAF Custom Rules**: Protect your admin/write endpoints by configuring a Cloudflare WAF (Web Application Firewall) rule to restrict `/api/v1/posts` mutations to authorized IP ranges or specific Authorization Headers.
2. **CORS Safe Headers**: Set strict CORS origin permissions in your wrangler configurations or worker middleware to prevent third-party domains from querying your draft database.
3. **DDOS/Brute-force limits**: Enable Rate Limiting rules on cloudflare rules dashboard for the `/api/*` directory routes to prevent spam on draft creations.
