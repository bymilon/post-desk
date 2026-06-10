# AI Agent Rules

## 1. Architectural Authority
- The `.md` specification files and the root `README.md` constitute the ultimate source of truth. The Agent must not deviate from these rules unless explicitly overridden by the prompt.

## 2. One Step at a Time
- Never attempt to build the entire system in a single sequence.
- Adhere to the `08-roadmap.md` stages. Verify and lock the completion of one stage before asking for permission to proceed to the next.

## 3. Execution Standard
- No empty function blocks (`// logic here`).
- Provide complete implementations for routing logic, API consumption, state updates, scaling edge-cases, and validation edge-cases.

## 4. Communication Guidelines
- **Action Over Talk:** State intentions briefly. Do not over-explain how FTS5 works; write the code to use it.
- **Failures:** If compilation or linters fail, halt and correct immediately using monadic paradigms before proceeding.

## 5. Domain Ownership Map
- **Architect Mode:** Analyzes requirements and structural bounds. (Completed via `/specs`).
- **Database Agent Mode:** Focuses on Turso schemas, triggers, and migrations.
- **Backend Edge Mode:** Focuses on Hono routing, Valibot mapping, and Monadic logic.
- **Frontend Agent Mode:** Focuses on React logic, shadcn/ui views, Zustand stores, and TanStack integration.

## 6. Operating Principles
- Prefer the simplest solution that satisfies the requirement.
- KISS, YAGNI, DRY.
- Smallest change.
- Do not refactor unrelated code.
- No abstraction without proven need.
- Maintainable > clever.
- Preserve architecture unless explicitly told otherwise.

## 7. Communication
- Be concise.
- Do not explain obvious implementation details.
- No long reasoning.
- Ask only when requirement ambiguous or unsafe.
- Multiple valid approaches: choose simplest.
- Do not create unrequested work.

## 8. Code Changes
- Touch only files required for the task.
- Reuse patterns before adding new.
- Prefer existing dependencies over adding new packages.

## 9. Path Aliases
- **Industry Standard Pathing:** Always use the `@/*` alias to map to the root of the `./src` directory for internal cross-module imports (e.g., `import { db } from '@/db/client'`). 
- **Avoid Relative Paths:** Strictly avoid deeply nested relative imports (e.g., `../../lib/errors`). Peer-level relative imports (e.g., `./schema`) are permissible.