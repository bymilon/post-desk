# AI Agent System Instructions

**Date Configured:** 2026-06-11
**Target Model:** Gemini Pro Latest
**Application Context:** PostDesk Growth Cockpit

## 1. Operating Philosophy & Knowledge Foundation
* **Model Selection:** The agent must operate utilizing the capabilities of the **Gemini Pro Latest** profile. All reasoning and generation must reflect advanced, multi-step critical thinking ("think harder and deeply").
* **Knowledge Sources:** Rely exclusively on institution-standard, enterprise-grade, and academically rigorous materials. Reject generic internet tutorials, speculative workarounds, or deprecated patterns. Emphasize software engineering principles rooted in formal systems design (e.g., Martin Fowler's enterprise patterns, Domain-Driven Design).
* **Temporal Awareness:** Treat the current operational date as **June 11, 2026**. Ensure all package assumptions, ECMAScript standards, and framework capabilities correspond strictly to stable production configurations available up to mid-2026.
* **Zero-Slop Execution:** Utilitarian rigor is mandatory. Absolute prohibition on emojis, marketing fluff, or verbose self-praise in code, documentation, UI output, or conversational responses.

## 2. Architectural Adherence & Best Practices
* **Vertical Slice Architecture (VSA):** All features must be fully encapsulated into isolated modules (Schema, Handler, Routing, DB) housed within `/src/features/`. Do not organize code horizontally.
* **CQRS Enforced:** Maintain a logical and physical segregation between write operations (Commands, mutating transactional state) and read operations (Queries, fast flattened search indexing like FTS5/BM25).
* **Parse, Don't Validate:** Execute input validation solely at system boundaries. Utilize `valibot` (`v.safeParse`) to establish exact shapes. Unvalidated or implicitly typed inputs must never reach domain handlers.
* **Monadic Error Trapping:** Conventional `throw new Error()` patterns are definitively banned for flow control. Handlers and IO operations must return a discriminated union or a monadic wrapper (`Result<T, AppError>`) using libraries like `ts-results-es`.

## 3. Stylistic and Code Quality Standards
* **Type Safety Overrides:** Execute strict compilation checking. Zero implicit `any` usage. Code that cannot compile securely must be re-engineered, not suppressed.
* **UI & Frontend Paradigms:** Utilize high-density, accessible primitives layered with Tailwind CSS. Maintain desktop-class workspace density; do not degrade the UI with mobile abstractions for core writing spaces.
* **Dependency Constraint:** Prioritize utilizing existing libraries mapped in `package.json` over integrating extraneous third-party modules. Code simplicity (KISS, DRY) must prevail.

## 4. Execution Rules inside AI Studio
* **Action Over Prose:** Execute implementations immediately. Do not provide high-level educational recaps unless specifically asked.
* **Structural Completeness:** Do not write empty placeholder blocks (e.g., `// logic here`). Deliver complete endpoint coverage, including scaling edge cases, edge-runtime database bindings, and correct response parsing.
* **Isolation:** Touch only the vertical slice explicitly involved in the active requested task.
