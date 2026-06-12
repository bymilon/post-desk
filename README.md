# PostDesk

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub Repository](https://img.shields.io/badge/GitHub-post--desk-181717?logo=github)](https://github.com/bymilon/post-desk)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06b6d4.svg)](https://tailwindcss.com/)
[![Hono](https://img.shields.io/badge/Hono-v4-e05138.svg)](https://hono.dev/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-v0.45-c5f347.svg)](https://orm.drizzle.team/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg)](https://www.typescriptlang.org/)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Donate-yellow.svg?style=flat&logo=buy-me-a-coffee)](https://buymeacoffee.com/milonspace)
[![X Follow](https://img.shields.io/badge/Follow-%40milonspace-black.svg?style=flat&logo=x)](https://x.com/milonspace)
[![Instagram](https://img.shields.io/badge/Instagram-Follow-E4405F?logo=instagram)](https://www.instagram.com/withmilon)
[![Threads](https://img.shields.io/badge/Threads-Follow-000000?logo=threads)](https://www.threads.com/@withmilon)

![PostDesk](https://lh3.googleusercontent.com/d/10S7xdtSbYu2-VuNVxa2Cb-FV6LeXQVaL=s1280-no-nu-rw)

PostDesk is a production-grade, full-stack content operating system and growth cockpit for X (Twitter) creators, developer advocates, and teams. Built with a developer-first mindset, it leverages **Vertical Slice Architecture (VSA)** and **CQRS boundaries** to manage, refine, and discover content ideas without friction.

Developed and maintained by **Milon Biswas** ([@milonspace on X](https://x.com/milonspace)).

---

## Tech Stack & Key Choices

PostDesk uses a lightweight, safe, and highly performant full-stack model:

- **Frontend**: Single Page Application built on **React 19**, styled utilizing **Tailwind CSS v4** and structured with accessible Headless primitives from **Base UI** (`@base-ui/react`). Smooth micro-interactions are authored using the unified **Motion** library.
- **Backend & APIs**: Modern routing powered by **Hono** running on an Express-compatible setup, bound to a Node.js listener via `@hono/node-server`.
- **Database & ORM**: **SQLite** via high-efficiency local LibSQL client (`@libsql/client`) paired with type-safe schemas using **Drizzle ORM**.
- **Search System**: Fast keyword querying and status constraints directly on indexed columns.
- **Validation**: Strict boundary schemas using **Valibot** parsing inputs with type-safe protocols.
- **Error Pipeline**: Predictable, type-safe error boundaries mapped cleanly through monadic `Result<T, AppError>` primitives from `ts-results-es`.

---

## Architectural Blueprint

### 1. Vertical Slice Architecture (VSA)
Rather than organizing files in traditional horizontal layers (controllers, services, and queries), PostDesk organizes code into isolated **features**. Each slice encapsulates all layout, endpoint, business logic, validation, and database operations needed to satisfy a feature:

```text
src/
├── features/
│   ├── posts/          # Isolated slice for post drafting, status changes, and history
│   └── inspiration/    # Isolated slice for capturing inspirations, bookmarks, and URLs
```

Inside the system or feature folders, code transitions align with explicit boundary protocols:
- **`index.ts` / `router.ts`**: The routing layer mapping endpoints onto Hono.
- **`schema.ts`**: The strict schema validation rules powered by Valibot.
- **`handler.ts`**: Functional orchestrators performing actual state transitions.
- **`db.ts`** or queries: Secure queries configured exclusively for the target slice.

### 2. CQRS Boundaries
PostDesk segregates modifications (Commands) from read operations (Queries) to guarantee state determinism and performance:
- **Commands (Write Operations)**: Executed against foundational relational SQLite tables (`x_posts`, `inspiration_posts`). Commands validate incoming states and perform secure writes without return-channel bulk objects.
- **Queries (Read Operations)**: Highly optimized query pathways utilizing direct filter matches across statuses, types, and keyword structures.

### 3. Parse, Don't Validate
All domain-level entries require validation via `v.safeParse`. Validation results yield a success indicator or wrap standard field errors inside an explicit `ValidationError` domain error mapping to our monadic Result layer.

---

## Database Schema Specification

### Write Models (OLTP)

#### `x_posts`
Holds structured drafts, published posts, and status lifecycles:
- `id`: Row index (Integer, Primary Key, Auto Increment).
- `key`: Text (Unique Custom Base31 key identifier).
- `content`: Text (Body content of the post).
- `status`: Text (Enum constraint: `'draft'`, `'published'`, `'archived'`, `'bookmarked'`, `'pinned'`).
- `postType`: Text (Enum constraint: `'standard'`, `'thread'`).
- `used`: Integer/Boolean representing whether the template was spent/used.
- `createdAt` / `updatedAt`: Unix epoch timestamps.

#### `inspiration_posts`
A swipe-file repository for brainstorming, capturing hooks, and bookmarking external insights:
- `id`: Row index (Integer, Primary Key).
- `key`: Text (Unique Custom Base31).
- `sourceUrl`: Text (Nullable link references for credit validation).
- `content`: Text (Original reference copy).
- `authorHandle`: Text (Source handle of creators).
- `tags`: Text (Tag strings for categorizations).

---

## Monadic Error Taxonomy

Every backend routing handler and parsing step guards against raw stack traces. Instead of raising uncaught exceptions, operations return a safe `Result<T, AppError>` union:

- `ValidationError`: Input parse failure from Valibot boundaries.
- `DatabaseError`: Safe database transaction errors.
- `NotFoundError`: Targeting resources or records that do not exist.
- `InternalServerError`: Catastrophic unexpected application states.

---

## AI-Native Development & DX (Google AI Studio)

PostDesk is developed and validated within **Google AI Studio**, leveraging its cloud developer sandbox and advanced **AI Coding Agent** as the primary automation engine. The codebase is architected with a strict discipline that optimizes both human understanding and agentic reasoning:

- **Isolated Side Effects**: Through absolute modularity and clear **Vertical Slice Architecture**, the AI agent can read, test, and write complete features without regression risks across the wider codebase.
- **Predictable Error Paths**: By returning strict `Result` monads rather than throwing unexpected exceptions, the system's control flow is highly visible, making bug tracking and logical code reasoning precise for AI agents.
- **High-Frequency Visual Diagnostics**: The local DX pipeline pairs Type-Safe validation (`tsc --noEmit`) with Rust-powered `oxlint` static code analysis, ensuring syntax consistency and best practices in milliseconds before the app compiles.
- **Automated Native Compilations**: The build system compiles Vite frontend bundles and uses `esbuild` to compile standard server TypeScript files into a single, optimized CJS boundary (`dist/server.cjs`). This prevents common ESM path issues and enables swift container deployment.

---

## Support & Sponsorship

If you find PostDesk valuable for organizing your content workflow, support us and follow our growth journey:

- **GitHub Repository**: Star and contribute directly at [github.com/bymilon/post-desk](https://github.com/bymilon/post-desk).
- **Donate / Invest**: Support open-source tool development by buying me a coffee at [buymeacoffee.com/milonspace](https://buymeacoffee.com/milonspace) to keep development energetic.
- **Social Connects**:
  - **X (Twitter)**: Follow us at [@milonspace](https://x.com/milonspace) for fast tech updates.
  - **Instagram**: Stay updated with our product updates at [@withmilon](https://www.instagram.com/withmilon).
  - **Threads**: Join the daily engineering conversations at [@withmilon on Threads](https://www.threads.com/@withmilon).
- **Consulting**: Reach out at [@milonspace](https://x.com/milonspace) if your company needs custom automated content scheduling platforms, vertical slice architectures, or high-performance Hono setups.

---

## Quick Start & Scripts

### Prerequisites
- **Node.js**: `v18.x` or higher
- **Package Manager**: npm (Standard)

### Setup & Run
1. Install development packages:
   ```bash
   npm install
   ```
2. Initialize and seed the local SQLite state:
   ```bash
   npm run db:setup
   ```
3. Run the development server (Hono + Vite API Proxying on port `3000`):
   ```bash
   npm run dev
   ```

### Production & Cloudflare Deployment
PostDesk is fully ready to run on distributed Edge infrastructure. For a step-by-step masterclass on launching the React SPA on Cloudflare Pages and connecting it with a serverless edge database (Turso/LibSQL) on Cloudflare Workers, check out the [Cloudflare Deployment and Configuration Walkthrough](./docs/cloudflare_deployment.md).

### Command Reference

| Script | Purpose |
| :--- | :--- |
| `npm run dev` | Boots Hono development API matching hot Vite proxying. |
| `npm run build` | Bundles static client assets to `/dist` and compiles server entry to `/dist/server.cjs` via `esbuild`. |
| `npm run start` | Boots compiled bundle on node server under port `3000` in production. |
| `npm run lint` | Runs type audits via `tsc --noEmit` and static visual diagnostics with fast rust-native `oxlint`. |
| `npm run db:setup` | Prepares local schema configurations. |
| `npm run clean` | Deletes server build outputs and temporary states. |

---

## License

This project is licensed under the [MIT License](LICENSE).
