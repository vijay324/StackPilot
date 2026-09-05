---
name: StackPilot
description: Pick your stack. Scale with confidence.
colors:
  background: "#0A0A0B"
  surface: "#141416"
  border: "#26262A"
  text: "#F2F2F3"
  text-muted: "#9A9AA2"
  accent: "#5B8DFF"
  success: "#4ADE80"
  light-background: "#FFFFFF"
  light-surface: "#F7F7F8"
typography:
  display:
    fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 8vw, 4.5rem)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  body:
    fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0"
  mono:
    fontFamily: "var(--font-jetbrains-mono), var(--font-geist-mono), ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
rounded:
  sm: "6px"
  md: "8px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "32px"
  xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.background}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
    height: "48px"
  option-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "16px 20px"
    height: "56px"
---

## Overview

Dark-first instrument panel for a two-minute stack questionnaire. The visual world is the Linear / Vercel / Polar register: near-black field, 1px hairlines, Geist for UI, JetBrains Mono only for stack names and data. Accent `#5B8DFF` is reserved for the live control (progress, primary button, focus, links). Light mode inverts ground and surface and keeps the same accent.

## Colors

- Default scene is a dim office at night — dark is the product, not a theme afterthought.
- Surfaces are `#141416` on `#0A0A0B` with `#26262A` rules. No gradients, no glow, no glass.
- Muted text `#9A9AA2` is for helper copy only; body and options use `#F2F2F3`.
- Success green tags a positive match reason, never a decoration wash.

## Typography

- Geist for all UI. Display headings are medium weight, tight tracking, never gradient-filled.
- JetBrains Mono for stack names, scores, stage labels (`0→10K`), and keyboard hints.
- Body measure stays near 65–75ch on reading surfaces. Options are full column width.

## Layout

- Marketing and result: one reading column (~720px) with generous vertical rhythm.
- Landing hero at `lg` is two columns: pledge on the left, the first question on the right.
- Wizard is a single focused column; chrome is wordmark + progress only.
- Mobile-first. Primary controls are at least 44px tall.

## Elevation & Depth

- Separation is a 1px border, not a shadow. If a shadow appears, it has offset and blur — never a colored halo.

## Shapes

- 8px radius on controls and option rows. No pills, no squircle logos.

## Components

- Option rows are the primary control language on landing and wizard. Choosing a row is the action; there is no extra Next button.
- Progress is a 2px accent track at the top of the wizard.
- Runner-ups collapse; the winner stays fully open.

## Do's and Don'ts

- Do put the questionnaire in the first viewport. Don't ship a generic SaaS hero with a fake dashboard screenshot.
- Do use mono for stack names. Don't costume the whole UI in mono.
- Do keep accent scarce. Don't gradient text, glow borders, or icon-card grids as page structure.
