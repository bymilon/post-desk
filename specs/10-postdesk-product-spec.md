# Product Specification: PostDesk

## 1. Overview
**PostDesk** is a full-stack content operating system and growth cockpit engineered specifically for X (Twitter) creators, developer advocates, and hyper-growth teams. It aims to solve the problem of disjointed creation workflows where ideas, drafts, and inspirations are siloed across notes apps, bookmarks, and generative AI tools. PostDesk brings ideological capture, drafting, AI-assisted writing, and posting history into a single, cohesive interface.

## 2. Target Audience
* **Developer Advocates:** Needing to ship consistent, high-leverage technical content.
* **X (Twitter) Creators:** Operating high-frequency, high-engagement growth strategies.
* **Content Teams:** Seeking central organization and AI-guided ghostwriting to accelerate output without sacrificing quality.

## 3. Core Features & Use Cases

### 3.1 Content Engine (Posts)
The core primitive of the system is the **Post**. 
* **Drafting:** An undistracted, fluid editor for drafting standard posts.
* **Status Management:** Transitioning posts through a logical lifecycle: `draft` -> `published` -> `archived` -> `bookmarked` -> `pinned`.
* **History & Search:** A fast UI and API to search and retrieve historical thoughts and previously published content. Includes boolean tracking for `used` status to ensure content isn't duplicated un-strategically.
* **Post Types:** Support for various modalities, initially focused on `standard` and `thread`. 

### 3.2 Ideation & Bookmarks (Inspiration)
A dedicated module to capture external velocity.
* **Capturing Data:** Store links, external handles, and raw content snippets natively inside the OS via the Inspiration workspace.
* **Smart Tagging:** Organize inbound inspiration via tag taxonomy.
* **Reference System:** Surface inspirations directly beside the drafting interface so writers do not have to break focus.

### 3.3 AI Copilot (Ghostwriter)
An integrated `gemini-3.5-flash` powered writing assistant designed to break writer's block while avoiding "AI-Slop".
* **Tone-Constrained Drafts:** The AI forces strict output bounds (≤276 characters, fast pacing, no fluff, no AI-giveaway phrases like "Here is your...").
* **Multi-Variant Generation:** Generates 3 distinct variations (e.g., standard, hook-heavy, thread-starter) based on the user's base intent, context, and selected writing framework.
* **Structured Output:** Strictly outputs JSON via schema definitions so the UI can confidently render variations without parse errors.

## 4. Technical Tenets & Architecture Constraints
The product must strictly adhere to the established architectural blueprint:
* **Vertical Slice Architecture (VSA):** Every feature (Posts, Inspiration, Copilot) encapsulates its own routing, database queries, and validation schemas.
* **CQRS Boundary Adherence:** Strict separation between command writes and optimized query reads.
* **Parse, Don't Validate:** All incoming payloads are structurally parsed using `valibot` before any business logic takes place.
* **Monadic Error Paths:** "Zero throw" policy. All operational functions yield a `Result<T, AppError>` boundary for predictable UI resolution.
* **Tech Stack:** React 19 SPA, Tailwind CSS v4, Hono APIs (Node Server), LibSQL/SQLite, and Drizzle ORM.

## 5. Non-Goals
* We are **not** building a direct social network.
* We are **not** currently building automated scheduling or direct X API auto-posting (MVP relies on drafting capability).
* We are **not** building generic generative templates (all AI generation is explicitly tailored to the thread/short-form thesis).

## 6. Future Expansion (Roadmap)
* **Threads Engine:** Expand the `threads` module to support rich drag-and-drop sequencing and branch logic.
* **Observability:** Integrate comprehensive DX tooling (Biome formating, Playwright testing pipelines) into the core workflow.
* **Analytics Integrations:** Pulling live X metrics back into stored published posts to establish data loops.
