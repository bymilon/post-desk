---
name: PostDesk
description: Enterprise internal tool for X post drafting and categorization.
colors:
  primary: "#262626"
  primary-dark: "#e5e5e5"
  neutral-bg: "#ffffff"
  neutral-bg-dark: "#171717"
  border: "#ebebeb"
  border-dark: "#3a3a3a"
  accent-amber: "#d97706"
typography:
  display:
    fontFamily: "Geist Variable, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Geist Variable, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
spacing:
  sm: "8px"
  md: "18px"
  lg: "36px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.md}"
    padding: "8px 14px"
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
---

# Design System: PostDesk

## 1. Overview

**Creative North Star: "The Monastic Newsroom"**

PostDesk utilizes a Swiss-modernist, high-contrast monochrome design system characterized by heavy whitespace, thin lines, rigid structural framing, and deliberate, rare status indicators. There are no gradients, no heavy pastel backdrops, and no multi-layered blurred drop-shadow elements. Every layout component operates silently to make X (Twitter) drafting and verification completely friction-free.

This system rejects developer telemetry noise, gratuitous background canvas decorations, and hyperactive consumer-app clutter. Aesthetics arise purely from tight, metric-driven typography, generous negative space, and micro-interactive physical taps.

### Key Characteristics:
- **Swiss minimalism**: High readability via crisp margins and consistent sizing scales.
- **Architectural framing**: Boundaries are outlined through thin 1px lines rather than shifts in background card blocks.
- **Focus first**: The editing and composition states stand out via total elimination of surrounding distractions.

## 2. Colors

Highly restrained, high-contrast monochrome palette built to prioritize copy focus. Color values are initialized securely in `src/index.css`.

### Primary
- **Swiss Charcoal** (`oklch(0.205 0 0)` / `#262626`): Used for primary headers, button fills, and strong semantic text weight.
- **Modernist Off-White** (`oklch(0.922 0 0)` / `#e5e5e5`): Primary dark-mode accent and secondary layout highlight.

### Neutral
- **Paper White** (`oklch(1 0 0)` / `#ffffff`): Standard light-mode surface and board canvas.
- **Ink Darkest** (`oklch(0.145 0 0)` / `#171717`): Standard dark-mode base background.

### Accent (Inspiration Feature)
- **Amber Warning** (`oklch(0.60 0.15 70)` / `#d97706`): Used selectively as a warm highlight strictly reserved for the Inspirations Board dashboard and inspiration card tags.

### Named Rules
**The Monochrome Core Rule.** The system identity belongs purely to black, white, and gray tones. Color indicates state or cross-reference hierarchy. It must never serve as decorative background wash.

**The Under-10-Percent Rule.** Active primary colors or highlights must never occupy more than 10% of any singular visual module's canvas.

## 3. Typography

**Display Font:** Geist Variable (Sans-serif)
**Body Font:** Geist Variable (Sans-serif)
**Code Font:** JetBrains Mono (For copy metadata and stats indicator counts)

The system relies on 'Geist Variable' directly linked via Google Fonts to offer exceptionally crisp tracking on high-density displays. Its heavy horizontal tracking on subheadings delivers a bold, premium layout rhythm.

### Hierarchy
- **Display** (700, clamp(2rem, 5vw, 3.5rem), 1.15): Primary desk landing branding headers.
- **Headline** (600, 1.25rem, 1.3): Major feature workspace sections.
- **Title** (500, 0.975rem, 1.4): Card labels, draft states, and status board parameters.
- **Body** (400, 0.875rem, 1.5): Standard copy.
- **Label** (500, 0.75rem, uppercase, spacing 0.05em): Form hints, meta titles, character count indicators.

## 4. Elevation

The surface structure is flat by default. PostDesk relies on structural boundaries and high-contrast lines rather than nested elevation shadows. Depth layers appear exclusively to isolate top-level floating capturing.

### Shadow Vocabulary
- **Threads Floating Shadow** (`shadow-[0_8px_30px_rgba(0,0,0,0.36)]`): Applied only to the Floating Quick Draft Button to provide immediate tactical elevation above active workspace scroll layers.

### Named Rules
**The Flat-By-Default Rule.** Surfaces remain entirely on level zero at rest. Elevation transitions into view exclusively as a haptic, kinetic response to interactions (such as active taps, hovering triggers, or dialog reveals).

## 5. Components

Every modular component must stay extremely compact and simple to reduce decision layout fatigue.

### Buttons
- **Shape:** Soft-squared (radius-md / 10px).
- **Primary:** Swiss Charcoal background, Paper White text filled with responsive active taps (`active:scale-95`).
- **Hover:** Slight scale elevation (`whileHover={{ scale: 1.05 }}`) with dark backdrop-blur options.

### Floating Action Button (FAB)
- **Character:** Threads.com-inspired floating quick draft capsule.
- **Style:** Pure circular aspect (h-12 w-12 md:h-14 md:w-14) in pure high-contrast inverse shading (`bg-zinc-950 dark:bg-white`) paired with custom double shadows to float beautifully.

### Cards / Containers
- **Border:** Thin hairline strokes (`border-border/20` to `border-border/45`).
- **Used Draft treatment**: Staggered crossing output (`text-muted-foreground/75 italic line-through`) to declare used items instantly.

### Inputs / Fields
- **Draft Fields**: Borderless with absolute focus outline inhibition, relying on visual indicator margins and active state transitions rather than default browser styling lines.

## 6. Do's and Don'ts

### Do:
- **Do** stick to high-contrast monochrome structures with amber highlights restricted to inspiration tags.
- **Do** format X posts with actual line breaks (`\n`) and generous vertical whitespace.
- **Do** keep text fields fully `autoFocus` on the bottom-right Quick Draft trigger.

### Don't:
- **Don't** use warm gradients, neon highlights, or colorful background glassmorphism.
- **Don't** add generic SaaS developer logs or active visual telemetry parameters like "PORT: 3000" in the footer rails.
- **Don't** add random social media logos; strictly utilize lucide-react vector lines.
