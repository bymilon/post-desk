# Technology Stack

## Frontend (Client)
- **Framework:** React 19 (via Vite)
- **State Management (Client):** Zustand
- **State Management (Server Cache):** TanStack React Query
- **Styling:** Tailwind CSS v4
- **Component Library:** shadcn/ui combined with Base UI elements.
- **Icons:** `lucide-react`
- **Routing:** React Router (or TanStack Router/Wouter based on preference, defaulting to standard SPA routing paradigms).

## Backend (API Edge Layer)
- **Framework:** HonoJS (for edge-optimized, lightweight routing).
- **Validation Engine:** Valibot.
- **Error Handling:** `ts-results-es` (Monadic `Result<T, E>`).

## Database & ORM
- **Database Target:** Turso (LibSQL architecture)
- **Indexing:** SQLite native FTS5 Extension + BM25 ranking algorithm.
- **Data Access Layer:** Drizzle ORM.

## Tooling & Quality Assurance
- **Language:** TypeScript (`strict` mode).
- **Linter:** Oxlint
- **Formatter:** Oxfmt
