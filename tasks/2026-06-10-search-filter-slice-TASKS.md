# Feature Slice - Search & Filter Engine Tasks
**Date:** 2026-06-10
**Epic:** Stage 6 - Feature Slice - Search & Filter Engine (Query)
**Status:** Done

## Task List (Linear-style)

---

### [SF-1] Query Schema Mapping (Valibot)
**Status:** Done
**Priority:** High
**Assignee:** Backend Agent
**Dependencies:** None
**Description:**
Update `src/features/posts/schema.ts` with `SearchPostsQuerySchema`. Map optional query parameters for full-text search (`q`), pagination (`cursor`, `limit`), and filters (`status`, `postType`, `used`).

---

### [SF-2] Data Access Layer (Monadic)
**Status:** Done
**Priority:** High
**Assignee:** Backend Agent
**Dependencies:** [SF-1]
**Description:**
Update `src/features/posts/db.ts` to implement `searchPosts` logic. Use `withDb` helper to handle the SELECT statement. Integrate with the `x_posts_fts` table if `q` is provided, ordering by `rank` (BM25) and applying cursor pagination.

---

### [SF-3] Edge Routing & Handler (HonoJS)
**Status:** Done
**Priority:** High
**Assignee:** Backend Agent
**Dependencies:** [SF-2]
**Description:**
Update `src/features/posts/handler.ts` and `src/features/posts/index.ts`. Map `GET /` to parse query params, execute `searchPosts`, and return results with next cursor metadata.
