# NordByg Expo — Danish Construction Trade Show

A futuristic, frontend-only marketing website for a fictional Danish construction expo ("NordByg Expo 2026"), built on the `react-vite` artifact scaffold inside this pnpm monorepo.

## What's inside

- **Home** — parallax 3D hero (rotating wireframe building + tower crane built with three.js / @react-three/fiber), animated counters, 8 focus-area cards, 12-exhibitor grid, 4 speaker cards, auto-rotating 3D floor plan of halls A/B/C/D, testimonials, sponsor tiers, FAQ accordion and final CTA.
- **Register** — three-step exhibitor registration form (react-hook-form + zod). Pure frontend: on submit it shows an animated checkmark success screen confirming the application is under company-approval review (3 business days).
- **Exhibitors** — searchable / category-filterable directory with dialog detail view.
- **Programme** — 3-day tabbed conference schedule (22 plausible sessions, DA↔EN interpretation note).
- **Visit** — hours, address, Google Maps iframe, transport options, 4 ticket tiers, 3 hotels.
- **About** — timeline, advisory board, sustainability commitments, press, working contact form (client-side toast).

## Key files

- `artifacts/nordbyg-expo/src/App.tsx` — wouter routing
- `artifacts/nordbyg-expo/src/components/layout.tsx` — sticky glass nav + footer
- `artifacts/nordbyg-expo/src/components/three-scene.tsx` — 3D hero + floor-plan scenes
- `artifacts/nordbyg-expo/src/components/webgl-boundary.tsx` — WebGL feature detection + error boundary (site works without WebGL)
- `artifacts/nordbyg-expo/src/lib/data.ts` — all copy (exhibitors, speakers, programme, faqs, sponsors, hotels)
- `artifacts/nordbyg-expo/src/pages/*.tsx` — 6 pages

## Images

10 AI-generated construction-industry images in `src/assets/images/`: `hero-expo`, `bella-center`, `bim-screens`, `conference-stage`, `copenhagen-cranes`, `arch-model`, `booth-networking`, `craftsman`, `prefab`, `timber-construction`.

## Deployment (Vercel)

Root `vercel.json` configures Vercel to install with pnpm, filter-build only the `nordbyg-expo` artifact, and serve the SPA from `artifacts/nordbyg-expo/dist/public` with a catch-all rewrite to `index.html`.

## Theme

Dark-first Nordic aesthetic: deep midnight navy (`222 47% 11%`) background with warm amber/copper primary (`28 90% 55%`). Inter font. `<html class="dark">` set in `index.html`.

## Dependencies added

`three`, `@react-three/fiber`, `@react-three/drei`, `@types/three` (devDependencies of the artifact).
