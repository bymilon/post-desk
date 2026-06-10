# Constraints

## 1. Allowed Technologies
- Only technologies explicitly defined in the Tech Stack document are permitted.
- FTS5 and SQLite Native Triggers MUST be utilized for read models.

## 2. Prohibited Technologies
- **Zod:** Strictly forbidden. Use Valibot.
- **Standard Exceptions:** Throwing `new Error()` in application logic is strictly forbidden. 
- **Offset Pagination:** Forbidden for feed queries. Use Cursor-based pagination natively mapped in Drizzle ORM.
- **Default Light Mode:** The application is Dark Mode default. Do not engineer a complex light mode fallback without explicit request.

## 3. Operational Constraints
- Application must be entirely runnable locally via standard `npm run dev` and `npm run build` commands without complex external Docker dependencies (aside from the DB connection string).

## 4. Auth & Security Constraints
- Personal use case only. Implemented via Simple Core API Key/Token verification at the Hono router level. No OAuth or complex JWT rotation schemes are necessary.
