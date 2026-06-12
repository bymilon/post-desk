# Technical Specification: PostDesk

## 1. System Architecture
PostDesk is a full-stack, single-page application built on a modern **Node.js + React 19** stack, utilizing **Vertical Slice Architecture (VSA)** and **CQRS boundaries** to separate concerns logically by feature rather than by technical layer.
The application exposes a server-rendered RESTful API using **Hono** which is consumed by a React client. 

### 1.1 Stack Components
- **Frontend Framework**: React 19 (SPA) bundled with Vite 6.
- **Backend Framework**: Hono (`@hono/node-server` for Express-compatible execution, and `worker.ts` for Cloudflare Workers).
- **Database Engine**: SQLite running via LibSQL (`@libsql/client`).
- **ORM & Migrations**: Drizzle ORM.
- **Schema Validation / Types**: Valibot for strictly parsing API edge inputs ("Parse, Don't Validate").
- **Error Handling**: `ts-results-es` for explicit monadic boundary returns (`Result<T, AppError>`).
- **AI Integrations**: @google/genai (Gemini 3.5 Flash) via Server-side APIs to ensure API key security.

## 2. Code Organization (VSA)
Instead of global controllers or service folders, PostDesk is broken out into vertical business slices in `/src/features/`.

### 2.1 Feature Topography
Current implemented slices:
- **/posts**: Draft management, lifecycle status (`draft`, `published`, `archived`, `bookmarked`, `pinned`), search logic, and history bounds.
- **/inspiration**: Tagging, bookmarked links, raw IDE capture state.
- **/copilot**: AI agent orchestrations for producing concise post iterations.

### 2.2 Standard Slice Internals
Each feature defines strict local boundaries:
- `index.ts` / `router.ts`: Initializes a local Hono sub-router (e.g. `const postsRouter = new Hono()`).
- `schema.ts`: Defines inputs, outputs, and type inferred interfaces utilizing Valibot (`v.object`, `v.pipe`).
- `db.ts`: Houses the database reads (Queries) and writes (Commands).
- `handler.ts`: Contains the operational business logic tying Valibot results to DB actions or AI queries.

## 3. Database Design & Models
PostDesk relies heavily on lightweight **SQLite** fundamentals augmented by **Full Text Search (FTS)** capabilities.

### 3.1 Schema: `x_posts`
The primary atomic entity.
- **id** (INTEGER PRIMARY KEY)
- **key** (TEXT UNIQUE) - securely exposed to clients instead of integers.
- **content** (TEXT)
- **postType** (TEXT) - `standard` or `thread`.
- **status** (TEXT) - Tracks pipeline state.
- **used** (BOOLEAN) - Indicates if the content snippet has been harvested/posted yet.
- **createdAt** / **updatedAt** (INTEGER)

### 3.2 CQRS Search Optimization
The `posts` feature implements a complex read side utilizing FTS.
- When querying with a keyword (`opts.q`), the read logic utilizes `JOIN x_posts_fts` applying BM25 match sorting (`ORDER BY fts.rank`).
- Combines cursor-based offset pagination with deterministic state checks on `status`, `postType`, and `used`.

## 4. API Surface
Application ingress starts at `src/router.ts` mounting features into versioned clusters.

- `GET /api/v1/posts` - Returns a list of posts via cursor pagination.
- `POST /api/v1/posts` - Initiates the Create Post command.
- `PUT /api/v1/posts/:key` - Updates parameters of a post (status changes, updates to text).
- `POST /api/v1/copilot/generate` - Invokes AI ghostwriting payload returning highly structured JSON.

## 5. Third-Party Integrations
### 5.1 AI Generation Pipeline
The `/copilot` feature leverages Gemini 3.5 Flash.
- **Server-Side Constraints**: Evaluates incoming context (intent, context, framework).
- **Structured JSON Mode**: Gemini is commanded to use `responseMimeType: 'application/json'` mapped directly via `responseSchema`.
- **System Defense**: Try/Catch wrappers monitor `GEMINI_API_KEY` presence and explicitly map generation exceptions.

## 6. Security and Compliance
- **Authentication**: Incoming v1 routes must pass the `authMiddleware` defined natively in Hono.
- **Rate Limiting & Sanitization**: To be added in future iterations. Valibot strongly types and sanitizes the core payload.
- **No Client Keys**: No secret keys are available across the `VITE_` barrier. The UI must invoke `/api/v1/copilot` purely. 

## 7. Next Steps & Technical Debt
- **Monadic Conversions**: Slowly replace all backend try/catch throw logic to return the defined `Ok / Err` monads from `ts-results-es`.
- **Linter & Formatter Enforcements**: Bind `oxlint` and `oxfmt` inside the pre-commit Huskey configurations.
- **Observability**: Migrate Hono app-level requests away from `console.log` into OpenTelemetry implementations.
