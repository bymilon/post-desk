# Contributing to PostDesk

Thank you for your interest in contributing to PostDesk! To maintain the high code quality, performance, and deterministic behavior of this stack, we adhere to strict architectural rules.

Please read through this guide to understand how to design, write, and submit your contributions.

---

## 1. Zero-Slop Ground Rules

1. **Strict Monadic Errors:** **NEVER** use `throw new Error()` for anticipated control block failures. Always return `Result<T, AppError>` utilizing the `ts-results-es` library.
2. **Vertical Slice Architecture (VSA):** Do not scatter files horizontally (e.g., do not put all models in a global directory or all routes in a router folder). Group your code by *feature slice* under `src/features/`.
3. **Parse, Don't Validate:** Use `valibot` schemas to parse outside inputs immediately at boundary endpoints. No untyped or loosely typed payloads should penetrate the business layer.
4. **No Emojis or Slop:** Keep all code comments, issue descriptions, and pull requests clear, objective, and deeply professional. Avoid promotional formatting and hype.

---

## 2. Core Architectural Pillars

### A. Vertical Slice Architecture (VSA)
A feature slice contains everything it needs to perform its duties. Here is an example layout for `src/features/posts/`:

```
src/features/posts/
├── index.ts        # Hono router entry point for the slice
├── handler.ts      # Query & Command handlers for Hono requests
├── schema.ts       # Valibot schemas (DTI/Validation)
├── db.ts           # Slice-specific queries and database operations
└── types.ts        # Pure TypeScript definitions for the slice
```

### B. CQRS (Command Query Responsibility Segregation)
Separate mutate actions (Commands) from fetch actions (Queries):
- **Queries:** Purely read data. Keep queries lightweight and avoid nested state manipulation. (e.g., `listPostsQuery`, `getInspirationsQuery`)
- **Commands:** Mutate state. Always evaluate side-effects sequentially and return explicit `Result` wrappers. (e.g., `CreatePostCommand`, `DeleteInspirationCommand`)

### C. Monadic Error Pipelines
Always catch potential throwables inside database/local storage layers and route them to explicit domain errors:

```typescript
import { Result, Ok, Err } from 'ts-results-es';
import { DatabaseError, AppError } from '@/lib/errors';

export async function fetchPost(postId: string): Promise<Result<Post, AppError>> {
  try {
    const post = await db.select().from(posts).where(eq(posts.id, postId)).get();
    if (!post) {
      return Err(new NotFoundError(`Post not found with ID ${postId}`));
    }
    return Ok(post);
  } catch (error) {
    return Err(new DatabaseError(error instanceof Error ? error.message : String(error)));
  }
}
```

---

## 3. Pull Request Submission Workflow

1. **Fork the Repository:** Create your feature-specific branch (`feature/your-slice-name`).
2. **Lint & Format:** Ensure typescript checks compile cleanly without warnings:
   ```bash
   npm run lint
   npm run build
   ```
3. **Keep Commits Clean:** Write descriptive, imperative commit messages (e.g. `feat(posts): add status change query slice`).
4. **Submit PR:** Clearly list:
   - The user problem the slice solves.
   - The data models introduced or modified.
   - Proof of type safety and successful local compilation.

For custom builds, sponsorships, or architectural consulting, reach out via X at [@milonspace](https://x.com/milonspace).
