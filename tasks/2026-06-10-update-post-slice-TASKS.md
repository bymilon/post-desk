# Feature Slice - Update Post Tasks
**Date:** 2026-06-10
**Epic:** Stage 5 - Feature Slice - Update Post (Command)
**Status:** Done

## Task List (Linear-style)

---

### [UP-1] Feature Schema Mapping (Valibot)
**Status:** Done
**Priority:** High
**Assignee:** Backend Agent
**Dependencies:** None
**Description:**
Update `src/features/posts/schema.ts` with `UpdatePostStatusCommandSchema`. Validate `id` and optional enum states (`status`) and boolean (`used`) fields.

---

### [UP-2] Data Access Layer (Monadic)
**Status:** Done
**Priority:** High
**Assignee:** Backend Agent
**Dependencies:** [UP-1]
**Description:**
Update `src/features/posts/db.ts` to implement `updatePost` logic. Use `withDb` helper to handle the UPDATE statement using Drizzle, returning the updated post via `Result`. Handle the NotFound error case.

---

### [UP-3] Edge Routing & Handler (HonoJS)
**Status:** Done
**Priority:** High
**Assignee:** Backend Agent
**Dependencies:** [UP-2]
**Description:**
Update `src/features/posts/handler.ts` and `src/features/posts/index.ts`. Map `PATCH /:key` to perform validation, trigger `updatePost`, and return appropriately mapped monadic responses.
