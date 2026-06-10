# PostDesk

A production-grade, full-stack content engine and workspace for X (Twitter) growth. Built with an elite developer-centric architecture using a unified **Vertical Slice Architecture (VSA)** and matching **CQRS boundaries**, designed to run on high-performance local SQLite / LibSQL instances with instant text filtering via **FTS5 / BM25**.

---

## ⚡ Tech Stack & Key Choices

PostDesk rejects bloated patterns in favor of type-safe, ultra-fast, and modular tools:

*   **Runtime & Server**: Node.js + [Express](https://expressjs.com/) with development proxying via [Vite](https://vite.dev/).
*   **Database & ORM**: SQLite ([LibSQL / Turso](https://turso.tech/)) with [Drizzle ORM](https://orm.drizzle.team/) for strict compile-time types.
*   **Search Engine**: SQLite **FTS5 (BM25 relevance ranking)** for instant offline-first semantic search.
*   **Validation**: [Valibot](https://valibot.dev/) for lightweight, tree-shakable runtime schema enforcement.
*   **Monadic Error Handling**: Type-safe control flow using the `Result<T, AppError>` Monad pattern from `ts-results-es`. No silent throws.
*   **UI Foundation**: React 19, Tailwind CSS v4, Radix Base UI primitives, and custom micro-interactions.

---

## 🏗️ Architectural Foundations

### 1. Vertical Slice Architecture (VSA)
Instead of dividing code into traditional horizontal layers (controllers, services, models), PostDesk divides code by **features**. Every slice is completely self-contained, encapsulating its own request handling, validation schemas, business logic, and custom database queries:

```text
src/
├── features/
│   ├── [feature-name]/
│   │   ├── index.ts      # Slice entry router (mounted directly to Express/Hono)
│   │   ├── schema.ts     # Feature-specific Valibot validation rules
│   │   ├── handler.ts    # Main business logic orchestrator
│   │   └── db.ts         # Targeted database access specialized for the feature
```

### 2. CQRS (Command Query Responsibility Segregation)
Read and write paths are physically segregated to guarantee zero side effects and optimal index usage:
*   **Commands (Write)**: Pure state mutation. Executes on standard transactional tables (`x_posts`, `inspiration_posts`). Does not return complex, nested JSON objects.
*   **Queries (Read)**: Streamlined read access. Interacts heavily with the FTS5 virtual index to construct ultra-fast keyword searches using native match matrices.

### 3. Parse, Don't Validate
Valibot schemas parse incoming data at boundaries. Exceptions are strictly forbidden; validation uses `v.safeParse` returning a `SafeParseResult`. Failures are converted into type-safe domain errors (`ValidationError`) at the boundary.

---

## 📦 Database Schema Spec

### Write Models (OLTP)

#### `x_posts`
Holds active post blueprints, schedule properties, and status.
*   `id` (integer, Primary Key)
*   `key` (text, Unique Custom Base31)
*   `content` (text)
*   `status` (`'draft'`, `'published'`, `'archived'`, `'bookmarked'`, `'pinned'`)
*   `post_type` (`'standard'`, `'thread'`)
*   `used` (integer, boolean flag)
*   `created_at` / `updated_at` (integer, Unix epoch)

#### `inspiration_posts`
Brains and inspiration capture bank for future hook ideation.
*   `id` (integer, Primary Key)
*   `key` (text, Unique Custom Base31)
*   `source_url` (text, nullable)
*   `content` (text)
*   `author_handle` (text, nullable)
*   `tags` (text, CSV representation)

### Read Models (OLAP FTS)

#### `x_posts_fts` (Virtual Table)
SQLite FTS5 full-text index bound to the content fields of `x_posts` with custom tokenizer configurations for high relevancy search scoring.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (`v18.x` or higher)
*   npm or pnpm

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment configuration (see `.env.example` context):
   ```bash
   cp .env.example .env
   ```
4. Setup and seed the local database schema:
   ```bash
   npm run db:setup
   ```

### Running Locally
To launch both the full-stack backend server and compile the client assets in watch mode:
```bash
npm run dev
```
The server will bind and be accessible at `http://localhost:3000`.

### Production Build
Aligns with high-efficiency container packaging. Compiles client static assets to `/dist` and bundles the monolithic back-end server via `esbuild`:
```bash
npm run build
npm start
```

---

## 🎛️ Monadic Exception Guide

We handle errors cleanly as values, avoiding the unpredictable nature of unstructured try/catch exceptions:

```typescript
import { Result, Ok, Err } from 'ts-results-es';

async function safeProcess(input: string): Promise<Result<SuccessData, AppError>> {
  if (!input) {
    return Err(new ValidationError("Input cannot be empty"));
  }
  try {
    const data = await db.save(input);
    return Ok(data);
  } catch (error) {
    return Err(new DatabaseError(error));
  }
}
```

---

## 📜 License
MIT - Created by Milton (@bymilon).
