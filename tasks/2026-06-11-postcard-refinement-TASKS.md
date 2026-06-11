# PostCard Aesthetic & Interaction Refinement Tasks
**Date:** 2026-06-11
**Epic:** Stage 11 - PostCard Aesthetic & Interaction Refinement
**Status:** Done

## Task List (Linear-style)

---

### [POL-5] PostCard Design System & Typography Alignment
**Status:** Done
**Priority:** High
**Assignee:** Frontend Agent
**Dependencies:** None
**Description:**
Audit `/src/components/PostCard.tsx` and align typography to use Inter for standard text, Space Grotesk for Display headings (such as Post ID keys), and JetBrains Mono for metadata (character stats and timestamps). Ensure strict visual consistency across themes, using high-contrast borders and card structures.

---

### [POL-6] Apply Norman Door Interaction Principles (Affordances & Feedback)
**Status:** Done
**Priority:** High
**Assignee:** Frontend Agent
**Dependencies:** [POL-5]
**Description:**
Incorporate rich signifiers, mapping, and feedback loops into PostCard. Replace standard raw titles with high-performance native Shadcn/UI Tooltips for all actions. Build an instant visual feedback transition for copying textual content (replaces the "Copy Copy" label bug). Refine the Toggle Used checked stamp to visually communicate state (e.g. checkbox state transitions, striking out metadata gracefully rather than cluttering).

---

### [POL-7] Compact Layout Optimization (Save Interaction Heights)
**Status:** Done
**Priority:** Medium
**Assignee:** Frontend Agent
**Dependencies:** [POL-6]
**Description:**
Restructure grid card footers and headers to be extremely compact, eliminating unneeded tall padding blocks. Switch secondary button links into a cohesive bottom action strip of balanced icon-based buttons, saving valuable screen space and vertical sprawl.

---

### [POL-8] Standardize Grid and List Mode Capabilities
**Status:** Done
**Priority:** Medium
**Assignee:** Frontend Agent
**Dependencies:** [POL-7]
**Description:**
Ensure parity of affordances and features between List view and Grid view modes. Standardize tooltips, modal triggers, status lists, and badge designs to enforce an identical conceptual model for users switching view contexts. Verify build status and compile cleanly.

---

### [POL-9] Implement Quick Desk Modes
**Status:** Done
**Priority:** High
**Assignee:** Workspace Agent
**Dependencies:** [POL-8]
**Description:**
Design and release a desktop-density 1-Click Preset Ribbon for "All Postings", "Fresh & Unused drafts", "Pinned reference rules", and "Threads Workspace" to accelerate core X publishing workflows, minimizing interaction costs and friction.

---

### [POL-10] Implement Instadraft Dock Component
**Status:** Done
**Priority:** High
**Assignee:** Workspace Fast-Path Agent
**Dependencies:** [POL-9]
**Description:**
Introduce an inline, high-density drafting dock integrated directly into the workspace body that allows creators to instantly type idea hooks and save them to active workspace drafts by hitting 'Enter', fully bypassing modal overlays and contextual switches. Add live count markers and switch buttons for Post Type.
