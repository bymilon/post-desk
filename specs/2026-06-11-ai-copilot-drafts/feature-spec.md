# Specification: AI Copilot Draft Generation

## 1. Objective
Implement a server-side AI integration utilizing the `@google/genai` SDK to generate draft "X (Twitter)" posts based on subjective user intent, input, and context context. The output will natively integrate with the existing local database state to seamlessly save selected generated drafts.

## 2. Architecture & Components
- **API Boundary (`/src/features/copilot/handler.ts`)**: Secure Express API endpoint taking `context` and `intent` as POST parameters. Communicates with Gemini API. Returns heavily typed structured JSON.
- **AI Logic**: Use Gemini Pro Latest to analyze the provided criteria and return varying post formats (e.g., standard, thread starters, hook-heavy).
- **UI Component (`/src/components/CopilotModal.tsx` or similar)**: A focused interface accessible from the `PostsWorkspace`. Contains an input schema for the intent/context, followed by a rendering grid of suggested AI drafts.
- **Persistence Workflow**: Users can select generated drafts and persist them instantly into the Drizzle SQLite instance as `draft` post status.

## 3. Engineering Constraints (Zero-Slop Standard)
- **Monadic Error Handling**: API responses must wrap failures cleanly; avoid throwing raw exceptions to the client.
- **Secure Key Access**: `GEMINI_API_KEY` must exclusively live in `.env` and `server.ts` boundaries. Under no circumstances will it be exposed client-side.
- **Type Rigidity**: Utilize precise mapping between the AI generation output and the `insertPostsSchema`.
- **Stateless Prompts**: AI generation should be explicitly single-turn/stateless inside the route; no conversational memory is required for this phase.
