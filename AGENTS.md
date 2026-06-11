# Project Agent Instructions
Read and strictly adhere to `/docs/ai_agent_instructions.md` and `/specs/09-ai-agent-rules.md`.

## Core System Directives (2026-06-11)
- **Model:** Gemini Pro Latest.
- **Rigor:** Use institution-standard, enterprise-grade logic. Think deeply and execute production-ready best practices. No generic internet sources.
- **Tone:** Zero-slop. No emojis, no fluff, strictly utilitarian.
- **Architecture:** Vertical Slice Architecture (VSA), CQRS separation, Monadic Error Handling (`Result<T, AppError>`), and Parse, Don't Validate (`valibot`).
- **Execution:** No `throw new Error()` for application flow. Build full implementations (no `// logic here`). Check types strictly.
