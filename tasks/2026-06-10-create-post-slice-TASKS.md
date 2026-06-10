# Feature Slice - Create Post Tasks
**Date:** 2026-06-10
**Epic:** Stage 4 - Feature Slice - Create Post (Command)
**Status:** Done

## Task List (Linear-style)

---

### [CP-1] Feature Schema Mapping (Valibot)
**Status:** Done
**Priority:** High
**Assignee:** Backend Agent
**Dependencies:** None
**Description:**
Create `src/features/posts/schema.ts`. Map the Valibot validation rules for the `CreatePost` command (`CreatePostCommandSchema`) specifically isolating the request body payloads into strongly typed inferences using `v.picklist` and `v.pipe(v.string(), v.minLength(1))`.

---

### [CP-2] Data Access Layer (Monadic)
**Status:** Done
**Priority:** High
**Assignee:** Backend Agent
**Dependencies:** [CP-1]
**Description:**
Create `src/features/posts/db.ts`. Implement the encapsulated data access operations utilizing `withDb` helper, strictly returning `Result<T, AppError>`. Construct the Drizzle INSERT statement mapped to the payload.

---

### [CP-3] Edge Routing & Handler (HonoJS)
**Status:** Done
**Priority:** High
**Assignee:** Backend Agent
**Dependencies:** [CP-2]
**Description:**
Create `src/features/posts/handler.ts` and `src/features/posts/index.ts`. Expose the HTTP boundary via Hono. Use `v.safeParse` for inbound requests, map error returns through `ts-results-es`, and orchestrate the command logic. Integrate this slice into the central `server.ts` application router.
