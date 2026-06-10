# Architecture Principles

## 1. CQRS Boundary Enforcement
- **Commands:** Operations that mutate state (Create, Update, Delete) write strictly to normalized tables.
- **Queries:** Operations that read state access optimized Read indices (Virtual Tables) exclusively. 

## 2. Smart Database Features
- **Turso/LibSQL native triggers:** Leverage native DB triggers to automatically sync data from standard tables (`x_posts`) to virtual tables (`x_posts_fts`), separating the synchronization logic from the application server layer wherever possible.
- **FTS5 & BM25:** Text search MUST leverage the SQLite FTS5 extension with the BM25 algorithm for relevance scoring.

## 3. Validation as a Boundary
- Validation sits at the very edge of the application (HonoJS inputs, DB outputs).
- Validation must exclusively use `Valibot` via `v.safeParse`. `v.parse` is forbidden.

## 4. Simple Auth Strategy
- Since this is single-tenant (personal use), authentication occurs at the edge globally across API routes using a simple cryptographic/API key check.

## 5. Deployment Strategy
- Full-stack Vite + React SPA mapped alongside a HonoJS API.
- Output builds to a unified ESBuild artifact to run seamlessly in modern edge/container contexts.
