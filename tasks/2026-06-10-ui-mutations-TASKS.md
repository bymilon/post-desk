# UI Expansion & Mutations Tasks
**Date:** 2026-06-10
**Epic:** Stage 9 - UI Expansion & Mutations
**Status:** Done

## Task List (Linear-style)

---

### [UI-1] Post Creation and Edit Forms
**Status:** Done
**Priority:** High
**Assignee:** Frontend Agent
**Dependencies:** None
**Description:**
Implement Dialog/Sheet components with forms (React Hook Form, Valibot validation) to allow users to create new posts and update their status using `useMutation`.

---

### [UI-2] Inspiration Capture Form
**Status:** Done
**Priority:** High
**Assignee:** Frontend Agent
**Dependencies:** None
**Description:**
Build a form to submit new inspirations, capturing content, source URLs, and tags. Wire up cache invalidation on successful submission.

---

### [UI-3] FTS Search Interface
**Status:** Done
**Priority:** Medium
**Assignee:** Frontend Agent
**Dependencies:** [UI-1]
**Description:**
Integrate an input field using debounce to search the 'Posts' list through the FTS5 endpoint (`GET /api/v1/posts?query=...`).
