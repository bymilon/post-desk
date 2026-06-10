# SDD Roadmap

## Stage 1: Foundational Setup
- Initialize the HonoJS application entry layer.
- Ensure environment variables are templated (`.env.example`).
- Wire the Database connection (`libsql`).
- Establish the native `ts-results-es` primitive wrappers and standard `AppError` taxonomy.

## Stage 2: Write Schema Deployment
- Create `drizzle.config.ts`.
- Construct normalized Drizzle schemas for `x_posts` and `inspiration_posts`.

## Stage 3: FTS5 Read Index Construction (CQRS Phase A)
- Implement raw SQL schema initialization files or complex migrations to create the `x_posts_fts` Virtual Table referencing SQLite's FTS5 extension.
- Create database triggers for automatic write-model to read-model synchronization to isolate the CQRS logic at the DB layer.

## Stage 4: Feature Slice - Create Post (Command)
- Build the `CreatePost` Vertical Slice.
- Workflow: Hono Router -> Valibot command parsing -> Monadic DB Insertion.

## Stage 5: Feature Slice - Update Post (Command)
- Build the `UpdatePostStatus` Vertical Slice.
- Handle changing conditions like toggling draft state to `published`, `archived`, `bookmarked`, or marking as `used`.

## Stage 6: Feature Slice - Search & Filter Engine (Query)
- Build the `SearchAndFilterPosts` Vertical Slice.
- This layer queries the FTS5 virtual table exclusively, mapping cursor-based pagination and sorting via BM25 (`ORDER BY rank`).

## Stage 7: Feature Slice - Inspiration Lifecycle
- Build `CaptureInspiration` to allow dropping URLs or textual content.
- Support basic retrieval indexing for the inspiration schema.

## Stage 8: Frontend State & Component Integration
- Connect React/Vite client utilizing TanStack React Query against Hono endpoints.
- Build dark-mode shadcn/ui application shells.

## Stage 9: UI Expansion & Mutations
- Implement frontend forms using React Hook Form and Valibot (or similar) for creating and updating posts.
- Build UI for capturing new inspirations.
- Integrate search components relying on the backend FTS5 features.
