# Engineering Principles

## 1. Strict Spec-Driven Development (SDD)
- Zero assumed implementation.
- Every slice must be validated against its functional requirements before moving to the next.
- No conversational "slop", placeholders, or "todo" comments in shipped code.

## 2. Vertical Slice Architecture (VSA)
- Features must be self-contained in directories containing their Route, Validation, Schema, and Data logic. 
- Avoid monolithic "services" or "controllers" folders. Everything belongs to a slice.

## 3. Total Error Safety (Monadic Paradigm)
- Exception throwing (`throw new Error`) is STRICTLY prohibited for business logic, async I/O, and validations.
- Use `ts-results-es` (`Result<T, E>`) across all domain boundary transitions.
- All errors map to a strict `AppError` taxonomy: `ValidationError`, `DatabaseError`, `NotFoundError`, and `InternalServerError`.

## 4. State Management
- **Server State / Caching:** Managed entirely by TanStack React Query.
- **Client/UI State:** Managed entirely by Zustand.

## 5. Testing & Verification
- Strict TypeScript enforcement (`tsc --noEmit`).
- Code styling and linting managed exclusively via Oxlint and Oxfmt rulesets.
