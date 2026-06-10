# System Context: X Growth Content Engine - VSA & CQRS Blueprint

## 1. Architectural Foundations (VSA & CQRS)

### Vertical Slice Blueprint
The system architecture rigorously follows the Vertical Slice Architecture (VSA) pattern. Each feature of the application is a self-contained, independent vertical slice that encapsulates its own Route, Validation, Business Logic, and Data Access logic. This ensures that changes to a feature do not ripple across decoupled horizontal layers. 
Code organization follows a feature-driven directory structure:
- `src/features/[feature-name]/index.ts`: The entry point for the slice linking routes to the Hono app.
- `src/features/[feature-name]/schema.ts`: Valibot validation rules for commands/queries.
- `src/features/[feature-name]/handler.ts`: Business logic orchestrator and boundary.
- `src/features/[feature-name]/db.ts`: Drizzle ORM data access specifically for this slice.

### CQRS Boundary Design
Command Query Responsibility Segregation (CQRS) is structurally enforced to separate data mutation operations (Commands) from data retrieval operations (Queries):
- **Commands (Write Operations):** Handlers focused strictly on creating, updating, or deleting content. Commands mutate the foundational SQL tables (`x_posts`, `inspiration_posts`) and emit synchronization tasks for read models if necessary. Commands do not return complex nested domain representations.
- **Queries (Read Operations):** Handlers optimized purely for data retrieval. Queries interact heavily with the high-performance read indices, particularly utilizing Turso/LibSQL's FTS5 virtual tables (`x_posts_fts`) for BM25 semantic relevance scoring.

## 2. Database & Schema Specifications (Turso / LibSQL + Drizzle)

### Write Models (Commands)
The foundational underlying Drizzle schemas strictly managing system state:

**`x_posts` Table:**
- `id`: `integer` (Primary Key, Auto Increment).
- `key`: `text` (Not Null; Unique constraint, customized base31 string via `lib/key.ts`).
- `content`: `text` (Not Null; the actual post body).
- `status`: `text` (Not Null; default: `'draft'`, enum values: `'draft'`, `'published'`, `'archived'`, `'bookmarked'`, `'pinned'`).
- `post_type`: `text` (Not Null; default: `'standard'`, enum values: `'standard'`, `'thread'`).
- `used`: `integer` (Not Null; default: `0` representing boolean false/unused, `1` representing true/used).
- `created_at`: `integer` (Not Null; Unix timestamp representation).
- `updated_at`: `integer` (Not Null; Unix timestamp representation).

**`inspiration_posts` Table:**
- `id`: `integer` (Primary Key, Auto Increment).
- `key`: `text` (Not Null; Unique constraint, customized base31 string via `lib/key.ts`).
- `source_url`: `text` (Nullable; original X post link).
- `content`: `text` (Not Null; the saved reference text).
- `author_handle`: `text` (Nullable; creator referenced).
- `tags`: `text` (Nullable; comma-separated conceptual categorization).
- `created_at`: `integer` (Not Null).

### Read Models (Queries - FTS5 Integration)
A specialized virtual table optimized exclusively for high-speed text search and BM25 algorithmic relevance ranking.

**`x_posts_fts` Virtual Table (FTS5):**
- Schema mapping initialized via standard LibSQL FTS5 syntax linking directly to the `x_posts` table.
- Mapped Fields:
  - `rowid`: Implicit linking to the `x_posts` primary key (if integer) or explicit relation structure.
  - `content`: The indexed text domain for BM25 calculation.
- Search execution leverages `h` ranking against queries.

## 3. Validation Layer Architecture (Valibot)

### Feature Schema Mapping
All incoming payloads and external boundary transitions must be strictly typed and validated via Valibot schemas, scoped explicitly to their vertical slices:
- `CreatePostCommandSchema`: `v.object({ content: v.string([v.minLength(1)]), postType: v.enum(['standard', 'thread']), status: v.enum(['draft', 'published', 'archived', 'bookmarked', 'pinned']) })`
- `UpdatePostStatusCommandSchema`: `v.object({ id: v.string(), status: v.enum(['draft', 'published', 'archived', 'bookmarked', 'pinned']), used: v.optional(v.number()) })`
- `SearchPostsQuerySchema`: `v.object({ query: v.string(), filterStatus: v.optional(v.array(v.string())), matchType: v.optional(v.enum(['exact', 'semantic'])) })`
- `CaptureInspirationCommandSchema`: `v.object({ content: v.string(), sourceUrl: v.optional(v.string()), authorHandle: v.optional(v.string()), tags: v.optional(v.string()) })`

### Parsing Protocol
Use of `v.parse` throwing exceptions is strictly prohibited. The system enforces the `v.safeParse` paradigm. The resulting validation outcome directly maps to the `Result<T, AppError>` Monad layer. If `success` is false, it maps to an explicit `Err(new ValidationError(...))` boundary output.

## 4. API Edge Routing Architecture (HonoJS)

Endpoints map precisely to the isolated Vertical Slices:

- `POST /api/v1/posts` -> **Slice:** `CreatePost` (Command)
- `PATCH /api/v1/posts/:id` -> **Slice:** `UpdatePostStatus` (Command)
- `GET /api/v1/posts` -> **Slice:** `SearchAndFilterPosts` (Query applying FTS5/BM25 sorting)
- `POST /api/v1/inspiration` -> **Slice:** `CaptureInspiration` (Command)

## 5. Monadic Error Handling & DX Protocol (ts-results-es)

### Type Signatures
All asynchronous I/O, database actions, routing middleware boundaries, and validation processors never throw traditional Exceptions (`throw new Error(...)` is forbidden). They explicitly return `Result<T, AppError>`.
- Example Signature: `async function executeCreateCommand(payload: CreatePostPayload): Promise<Result<PostEntity, AppError>>`

### Domain Error Taxonomy
The `AppError` type acts as a sealed union encompassing:
- `ValidationError`: Wraps Valibot `safeParse` failures mapping specific field issues.
- `DatabaseError`: Wraps Drizzle ORM/LibSQL constraint or connection failures securely without exposing raw DB credentials or stack traces.
- `NotFoundError`: Mapped specifically when targeting an entity by `id` that does not exist in the domain set.
- `InternalServerError`: Fallback for catastrophic system panics.

## 6. SDD Step-by-Step Execution Matrix

This matrix guides the AI coding agent to successfully scaffold the infrastructure with zero omissions:

- **Stage 1: Foundational Setup:** Initialize the HonoJS application entry point, environment variables (`.env.example`), and database driver bindings. Establish `ts-results-es` primitive wrappers and standard `AppError` taxonomy.
- **Stage 2: Write Schema Deployment:** Generate `drizzle.config.ts` and construct the schemas for the internal state representations (`x_posts` and `inspiration_posts` definitions).
- **Stage 3: FTS5 Read Index Construction:** Extend the database schema specifically building and documenting the execution query syntax to align SQLite/LibSQL's `FTS5` integration for the `x_posts_fts` tables.
- **Stage 4: Slice - Create Post (Command):** Build the isolated end-to-end `CreatePost` feature block (Router -> Valibot Schema -> Monadic DB Insertion).
- **Stage 5: Slice - Update Post (Command):** Build the isolated `UpdatePostStatus` and 'usage' tracking operations block.
- **Stage 6: Slice - Search & Filter Engine (Query):** Construct the FTS5 dependent `SearchPosts` query slice, heavily utilizing SQLite's internal match queries for BM25 ranking sorting.
- **Stage 7: Slice - Inspiration Board (Command & Query):** Tie off the execution by creating the isolated `CaptureInspiration` features and lists.

[PRODUCTION VSA/CQRS BLUEPRINT REGISTERED: READY FOR STEP 1]
