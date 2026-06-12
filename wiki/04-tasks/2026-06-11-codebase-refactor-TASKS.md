# Active Task Group: Codebase Pattern Audit & Refactoring
**Date:** 2026-06-11
**Objective:** Refactor the codebase to adhere to the 7 Senior Coding Patterns documented in `wiki/05-guides/03-7-Senior-Coding-Patterns.md`.

## Active Tasks
- [ ] **TSK-004: Apply Strict CQRS Segregation**
  - **Context:** `posts/db.ts` and `inspiration/db.ts` merge commands (writes) and queries (reads).
  - **Action:** Split `db.ts` into `commands.ts` and `queries.ts` for strictly separated read/write mental models.

- [ ] **TSK-005: Optimize Handlers with Early Guard Returns (Bouncer Pattern)**
  - **Context:** Arrow anti-patterns or bulky blocks inside handler logic when extracting inputs.
  - **Action:** Make handlers return early upon failure immediately before stepping into business logic.

## Done
- [x] **TSK-001: Implement 'Parse, Don't Validate' for Copilot**
  - **Context:** The `copilot/handler.ts` currently inline parses payloads instead of delegating to a schema module.
  - **Action:** Create `src/features/copilot/schema.ts` and extract `CreateDraftCommandSchema`. Import and validate at the boundary using `valibot`.

- [x] **TSK-002: Migrate Copilot to Monadic Error Handling (`Result<T, E>`)**
  - **Context:** `generateDraftsHandler` uses implicit `try/catch` and `getAI` uses `throw new Error()` for missing keys.
  - **Action:** Refactor the flow to return `Ok` and `Err` outcomes natively preventing unstructured server aborts.

- [x] **TSK-003: Refactor Logical OR to Nullish Coalescing (`??`)**
  - **Context:** Several components (`PostsWorkspace.tsx`, etc.) and db modules (`posts/db.ts`) rely on `||` which bugs on falsy states like length `0`.
  - **Action:** Global audit replacing `||` with `??` where optional defaults are intended. E.g. `opts.limit ?? 20`.
