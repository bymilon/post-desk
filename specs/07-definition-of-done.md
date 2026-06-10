# Definition of Done

A Vertical Slice or Feature is considered "Done" only when:

1. **Validation Boundary:** Incoming request payloads are validated via a Valibot `v.safeParse` schema map.
2. **Monadic Error Handling:** The handler returns a strictly-typed `Result<T, AppError>`, handling all data or validation errors without `throw` statements.
3. **Database Integrity:**
   - Commands write to normalized Drizzle schemas (`x_posts`, `inspiration_posts`).
   - Queries read from FTS5 indexed tables using BM25, pulling via cursor pagination.
4. **Architectural Alignment:** The feature code sits independently within `src/features/[feature-name]/`.
5. **Quality Checks:** 
   - Code successfully formats via `Oxfmt`.
   - Lints accurately with `Oxlint`.
   - TypeScript compiles with zero warnings or errors.
6. **No "Slop":** Zero placeholder comments, pseudo-code, or unhandled states exist in the slice.
