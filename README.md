# NITRO — 3D Energy Drink Landing Page

A responsive, animation-driven landing page for the fictional **NITRO** energy drink, built from the
"3D Animation Energy Drink Website" Figma design.

- **Live:** _coming soon_
- **Design:** Figma community file (3 frames, Smart Animate prototype)

## Highlights

- **Real 3D can** — modelled in code with Three.js (lathe + cylinder geometry), with a procedurally
  painted label (`<canvas>` → texture) for each flavour. No heavy model files to download.
- **Scroll-driven journey** — the hero can glides from the hero, to the "Since 2002" section, to the
  centre of the product lineup, turning and resizing along the way (recreating the Figma Smart Animate
  transitions as a continuous scroll experience).
- **Layout-driven 3D** — cans follow invisible DOM "slots", so the responsive layout (Tailwind
  breakpoints) decides where the 3D objects go. No hard-coded per-device coordinates.
- **GSAP + Lenis** — intro timeline, scroll-scrubbed reveals, smooth scrolling, all on one shared ticker
  (Lenis → ScrollTrigger → WebGL render happen in the same frame, so nothing drifts).
- **Accessible** — semantic landmarks and headings, skip link, keyboard-friendly mobile menu,
  visible focus states, and a full `prefers-reduced-motion` mode (static layout, no smooth scroll).

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Next.js (App Router, static prerender), React, TypeScript |
| Styling | Tailwind CSS v4 (design tokens in `globals.css`) |
| 3D | three.js, React Three Fiber, drei |
| Animation | GSAP + ScrollTrigger (`@gsap/react`), Lenis |
| Testing | Jest, React Testing Library |
| CI | GitHub Actions (lint, typecheck, test, build) |

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm test` | Unit tests |

## How the 3D can works

```
DOM (Server Components)                     WebGL (client only, lazy loaded)
┌────────────────────────────┐              ┌──────────────────────────────┐
│ <div data-can-slot="hero"> │──measure──▶  │ TravelCan                    │
│ <div data-can-slot="about">│              │  interpolates between slots  │
│ <div data-can-slot=        │              │  as you scroll               │
│      "product-nitro-green">│              │ SlotCan ×4                   │
│ ...                        │              │  pinned to product slots     │
└────────────────────────────┘              └──────────────────────────────┘
          ▲                                             ▲
          └──── GSAP tweens a tiny shared store ────────┘
                (intro, reveal, hover spin)
```

1. Each section marks where a can should be with an empty, invisible box (`data-can-slot`).
   Orientation is set with CSS variables (`--can-rx/ry/rz`), so it can change per breakpoint.
2. The canvas is fixed behind the content. Every frame, each can converts its slot's box into
   world units.
3. The featured can blends between consecutive slots based on scroll position, with an eased
   arc and a full turn per section.
4. GSAP never touches three.js objects directly. It tweens plain values in `lib/canStore.ts`, and the
   scene reads them. That keeps React from re-rendering while you scroll.

## Responsive approach

The Figma file only covers desktop (1920 × 1098). Decisions for smaller screens:

- **Hero** — the wordmark scales with the viewport width (`29.5vw`); the can stays across it; the
  description, CTAs and socials stack on mobile.
- **About** — the tagline moves above the photo on mobile; the can crosses the photo at a slight angle.
- **Products** — 2-column grid on mobile with the featured can spanning the full row; one row on desktop
  with the same small → large → small rhythm as the design.
- **Navigation** — full-screen menu below `lg`, with Escape-to-close and scroll lock.

## Design notes

- The Figma uses the **Sakana** display font. Until the font file is added, **Exo 2 Black Italic**
  (Google Fonts) is used as the closest freely licensed match. Body copy uses **Outfit**, as in the design.
- Fixed a typo in the design's navigation ("Galleru" → "Gallery") and replaced lorem ipsum with real copy.
- "Gallery" and "Contact" are not designed in the Figma; they link to the footer's brand band and
  contact block.

## Project structure

```
src/
  app/                 layout, page, global styles, /api/products
  components/
    animation/         GSAP page timelines (client)
    layout/            Navbar, Footer
    providers/         Lenis smooth scroll
    sections/          Hero, About, Products (server-rendered)
    three/             Canvas, can model, label texture, slot measuring
    ui/                Shared UI (social links)
  hooks/               usePrefersReducedMotion
  lib/                 products data, GSAP setup, shared animation store
```

## Credits

UI design from the Figma community file "3D Animation Energy Drink Website" by its original author.
