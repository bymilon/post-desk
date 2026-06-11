# PostDesk UI/UX Distillation Tasks
**Date:** 2026-06-11
**Epic:** Stage 13 - Impeccable Design Distillation & Native Shadcn Alignment
**Status:** Done

## Task List (Linear-style)

---

### [DIST-1] Audit & Eliminate Visual Noise in PostsWorkspace Header & Presets
**Status:** Done
**Priority:** High
**Assignee:** Frontend Polish Specialist
**Dependencies:** None
**Description:**
Restyle the main Workspace desk control block to feel fully native to modern high-end B2B SaaS (like Linear or Resend). Standardize borders to `border-border/40` or `border-border/60`, reduce inner card paddings, remove verbose labels, and integrate search + view toggle modes as a unified, flat, high-density toolbar.

---

### [DIST-2] Distill PostCard Visual Architecture (Border-based Minimalism)
**Status:** Done
**Priority:** High
**Assignee:** Frontend Platform Architect
**Dependencies:** [DIST-1]
**Description:**
Prune the boilerplate nested standard `Card`, `CardHeader`, `CardContent`, and `CardFooter` dividers which enforce heavy padding and bubbly shapes. Reconstruct `PostCard` to use a flat, distilled minimalist design using standard fine hairline borders (`border border-border/40 hover:border-border/80 bg-card rounded-lg p-3`), precise typography pairing, and pixel-perfect line-heights. Integrate inline list view rows with frictionless hairline separator dividers.

---

### [DIST-3] Refine Status & Usage Tags to Native Shadcn/UI Style
**Status:** Done
**Priority:** Medium
**Assignee:** Interaction Designer Agent
**Dependencies:** [DIST-2]
**Description:**
Simplify the status & usage badges to eliminate colored background slop and noisy borders. Standardize on neutral/low-saturation muted tones with tiny monochrome icons and text. Ensure standard micro-animations highlight interactive buttons without layout shift.

---

### [DIST-4] Streamline Creator Dialogs & Form Overlay Triggers
**Status:** Done
**Priority:** Medium
**Assignee:** Workspace Fast-Path Agent
**Dependencies:** [DIST-3]
**Description:**
Prune unnecessary margins and visual labels from `CreatePostForm.tsx` and the inline editing dialog. Enhance the typography hierarchy on input textareas, place char metrics as elegant inline footnotes, and implement seamless, zero-friction dialog sizing so they fit content perfectly.
