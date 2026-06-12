# Visual Design System, Layout Principles, and Navigation Rail

This document acts as an engineering and aesthetic handbook for interns and AI coding agents. It details how the **PostDesk** layout, left-panel navigation rail, and bottom-right quick draft systems are built to ensure visual cohesion, focus, and reduced user friction.

---

## 🚦 Core Aesthetic: The Monastic Newsroom
PostDesk rejects flashy neon accents, default multi-layered card elevations, and consumer-oriented SaaS landing page clichés. It implements a **Swiss-modern, high-contrast monochrome design system**. 

Aesthetics are derived solely from:
- Precise typographical hierarchies using **Geist Variable** and **JetBrains Mono**.
- Abundant negative space (allowing copy to breathe).
- Rigid structural framing via thin, high-contrast 1px dividers rather than filled colored blocks.
- Tactile interactiveness: haptic buttons that scale on tap, smooth animations via `motion/react`, and instant shortcuts.

---

## 🧭 The Left-Panel Navigation Rail

The main workspace navigation rail is a central layout anchor in `src/App.tsx` (and `src/components/PostsWorkspace.tsx`). It provides high-efficiency navigation with minimal visual weight.

### 1. Structural Hierarchy & Layout
- **Fixed Width**: Set to a hard `w-16` or `w-64` expanded collapsible sidebar depending on viewport sizes.
- **Background**: Styled with `bg-neutral-50 dark:bg-zinc-950` with a razor-thin 1px border `border-r border-border/45` (no heavy drop shadows to isolate it).
- **Flexbox Orientation**: Vertically oriented flex layout (`flex flex-col h-full justify-between items-center py-5`).

### 2. Nav Items Rules for Interns
When extending or adding navigation elements:
- Always use high-contrast outline vectors from `lucide-react`. Do NOT use filled colored SVG icons.
- **Active State Indicators**:
  - The active menu link shifts to a high-contrast theme accent (`text-zinc-950 dark:text-white`).
  - An absolute bar indicator or background micro-pill slides into position.
- **Inactive State**:
  - Semi-opaque (`text-muted-foreground/60` or `text-neutral-400`).
- **Interaction Transitions**:
  - Apply `transition-all duration-200 ease-out` on all state shifts.
  - Hover states should slightly dim background surfaces or shift tracking, as shown below:
    ```tsx
    <button className="flex items-center justify-center p-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all duration-200">
      <LayoutDashboard className="w-5 h-5" />
    </button>
    ```

---

## ⚡ Floating Quick Post Capture System

Inspired by **threads.com**, the bottom-right Floating Action Button (FAB) serves as a persistent quick action optimized to save user mouse movement costs.

```
+----------------------------------------+
|                                        |
|             WORKSPACE VIEW             |
|                                        |
|  [Tabs]                                |
|  [Posts Grid]                          |
|                                        |
|                      +--------------+  |
|                      | Quick Draft  |  | -> Positioned directly above FAB
|                      | [Text Area]  |  |
|                      | [Draft Button]  |
|                      +--------------+  |
|                      |  [ FAB ICON ]|  | -> Fixed bottom-right anchor
+----------------------------------------+
```

### 1. The Interaction & Placement Logic
- **Fixed Coordinates**: Locked exactly at `fixed bottom-6 right-6 z-40`.
- **Dimensional Targets**: Scaled for reliable touch and mouse clicks (`h-12 w-12 md:h-14 md:w-14`), exceeding the accessible target guideline of 48px.
- **Shadow Scheme**: Elevated uniquely with `shadow-[0_8px_30px_rgba(0,0,0,0.36)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.18)]` which forces separation from level-zero flat layout items.

### 2. Micro-Friction Optimization (Mouse Travel)
- **Problem**: Opening a modal in the perfect screen center forces users to move their pointer back and forth over large screen distances, increasing motor load.
- **Solution**: Set the Dialog to render directly near the trigger point. 
  - The modal anchors at: `right-4 bottom-22 md:right-6 md:bottom-24`.
  - Content has a compact max-width (`w-[calc(100%-2rem)] sm:max-w-[340px]`).
  - This keeps the inputs, actions, and buttons physically adjacent to the button they just clicked.

---

## 🎭 Animation & Micro-Interactions Guide

We utilize `motion/react` as our single-source-of-truth animation orchestrator. Gratuitous and slow cinematic motion is prohibited. Under-the-hood easing constraints must feel crisp and physical.

### Core Motion Library Configuration

#### Quick Button Tap
Every premium action must deliver kinetic feedback:
```tsx
import { motion } from 'motion/react';

export function InteractiveButton() {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      className="bg-primary text-white rounded-md px-4 py-2"
    >
      Save Draft
    </motion.button>
  );
}
```

#### Shared Animate Properties
- **Duration**: Restrict standard enter animations to `< 200ms`.
- **Easing Curve**: Prefer `cubic-bezier(0.16, 1, 0.3, 1)` (snappy spring out) to simulate natural inertia.

---

## 📝 Rules of Assembly for AI Agents

To maintain perfect brand alignment, verify that your new features pass the following checklist:

1. **Never use blue/purple gradients or radial glows**. Focus is achieved through whitespace, never color noise.
2. **Auto-focus inputs** where appropriate. Modal dialogs designed for single-screen quick drafts must automatically call `autoFocus` on the primary textarea.
3. **No random icon packages**. Only import from `lucide-react` using named imports placed at the top of files.
4. **Prefer standard 10px borders (`rounded-md` / `rounded-lg`)** for panels and modern inputs, but keep floating capture actions fully pill-shaped (`rounded-full`).

---

## 🛡️ Proper Scrollbar Aesthetics & Modal Overflows

To avoid low-quality browser scrollbar styling differences and maintain a premium Swiss-modern visual discipline, developers and agents must adhere to the following rules when building scrollable cards, list panels, or modal bodies:

### 1. Prohibition of Native Scrollbars
Never use plain native overflow properties (`overflow-y-auto`, `overflow-x-auto`) directly on prominent layout panes, modals, or workspace bodies. Default browser scrollbars vary wildly between operating systems (e.g., rigid heavy scrollbars on Windows vs subtle default overlays on macOS), breaking aesthetic uniformity.

### 2. Mandatory Use of `<ScrollArea>`
Always wrap scrollable modal views or side panels in the custom `<ScrollArea>` component (`@/components/ui/scroll-area` built on top of `@base-ui/react/scroll-area`). It implements a beautiful, ultra-thin hardware-accelerated scroll track that is fully visual-consistent across devices and themes.

### 3. Padding Offsets & Guardrails
When placing content inside `<ScrollArea>`, apply an additional right-padding offset (e.g., `pr-3` or `pr-4`) on the immediate child container. This ensures that form inputs, buttons, and text do not clip directly beneath the floating scrollbar thumb.

### 4. Compact Modal Overflows
For scrollable content inside interactive modals (such as the Copilot view):
- Always define a strict maximum height boundary (e.g., `max-h-[60vh]`) to maintain tight, localized spatial focus.
- Wrap content inside the modal like this:
  ```tsx
  import { ScrollArea } from "@/components/ui/scroll-area";
  
  // Inside DialogContent
  <ScrollArea className="flex-1 mt-3.5 min-h-0 max-h-[60vh]">
    <div className="space-y-3.5 pb-2 pr-3">
      {/* Content goes here */}
    </div>
  </ScrollArea>
  ```
