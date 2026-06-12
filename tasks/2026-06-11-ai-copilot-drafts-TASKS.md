# AI Copilot Drafting Tracker
**Epic:** AI Copilot Variation Engine
**Initiation Date:** 2026-06-11
**Objective:** Implement draft post generation based on user intent and context contexts, integrated seamlessly into the X Post database.

## 🚦 Status
**Status:** Planned

## 📋 Task Backlog (Linear-Style)

### Team: Backend / Server Agent
- [ ] **TSK-101**: Install and configure `@google/genai` inside the backend.
  - *Dependency*: None.
  - *Priority*: P0
- [ ] **TSK-102**: Define Monadic API boundaries to securely communicate with the Gemini API (creating `/api/v1/copilot/generate-drafts` route).
  - *Dependency*: TSK-101
  - *Priority*: P0
- [ ] **TSK-103**: Write structured prompt/instruction payload to enforce 280-character limits and standard X post styles (valibot integration validation if applicable).
  - *Dependency*: TSK-102
  - *Priority*: P1

### Team: UI/UX & Frontend Agent
- [ ] **TSK-201**: Design and build `AI Copilot UI` component. Include inputs for "Intent" and "Context".
  - *Dependency*: None.
  - *Priority*: P0
- [ ] **TSK-202**: Implement React Query mutation to trigger `POST /api/v1/copilot/generate-drafts` and handle visual loading/skeleton states.
  - *Dependency*: TSK-102, TSK-201
  - *Priority*: P0
- [ ] **TSK-203**: Design "Review & Action" rendering grid for AI outputs. Include "Save as Draft", "Edit", and "Discard" interactive states.
  - *Dependency*: TSK-202
  - *Priority*: P1
- [ ] **TSK-204**: Wire "Save as Draft" callback to existing Drizzle local-storage hooks to persist data into standard Posts tables.
  - *Dependency*: TSK-203
  - *Priority*: P0

### Team: DevSecOps / Integration
- [ ] **TSK-301**: Update `.env.example` with `GEMINI_API_KEY` placeholder.
  - *Dependency*: None.
  - *Priority*: P2
- [ ] **TSK-302**: Run full application-level audit and verify e2e saving flows.
  - *Dependency*: TSK-204
  - *Priority*: P1
