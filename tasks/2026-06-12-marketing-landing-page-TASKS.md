# 📋 Marketing Landing Page & Visual Identity (2026-06-12)

This document tracks execution phases, priorities, status, and task breakdowns for creating a Swiss-minimalist, high-contrast, production-grade marketing landing page for PostDesk.

---

## 🚀 Active Sprint Board

| Task ID | Component / Area | Task Description | Priority | Owner | Status | Dependencies |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **MLP-301** | `tasks` | Define linear tasks on the sprint board to track core landing page milestones. | High 🔥 | Core Engineer | Completed | None |
| **MLP-302** | `MarketingLanding.tsx` | Implement Swiss-minimalist marketing page with a rigorous visual hierarchy, high-contrast styling guides, and humanized zero-slop copy. | High 🔥 | Visual Agent | Completed | MLP-301 |
| **MLP-303** | `App.tsx` | Integrate the newly designed landing page into the navigation rail allowing live toggling. | Medium ⚡ | Core Engineer | Completed | MLP-302 |
| **MLP-304** | `lint & compile` | Validate static type checking and zero-warning compilation to ensure flawless production deployment. | High 🔥 | Core Engineer | Completed | MLP-303 |

---

## 🪵 Task Detail Breakdowns

### MLP-302: Swiss Minimalist Marketing Landing Page
- **Goal**: Author high-density, beautifully spaced layout mirroring elite Swiss grids (using monospace accents, solid lines, deep charcoal and neutral colors, tight letter tracking, and robust negative space).
- **Structure**:
  - **Hero**: Strong value statement, fast pacing, instant-loading CTAs with Github and X links.
  - **Problem**: Focuses on manual creators wasting thousands of drafts, API clutter, and disorganized notes.
  - **Solution**: Showcases the core components (VSA, CQRS, Swipe file, SQLite speed).
  - **Social Proof**: Real user testimonials from top advocates on X, clear metrics.
  - **Pre-footer CTA**: Prompts developers to clone, sponsor, or run local instances.
  - **FAQ**: Clear technical accordions solving questions about Cloudflare Workers, SQLite caching, local mode.
  - **Footer**: Human contacts, legal disclaimers, MIT licensing tags.

### MLP-303: Navigation Integration
- **Goal**: Mount the landing page cleanly inside `App.tsx` using custom rail buttons and dynamic scroll.
- **Action**: Add a new `landing` view category. Adjust visibility criteria.

### MLP-304: Quality Verification
- **Goal**: Build and lint with zero exceptions.
- **Action**: Execute `npm run lint` and `npm run build` commands.
