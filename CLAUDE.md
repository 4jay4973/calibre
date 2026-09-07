# Calibre — project guide for Claude Code

Marketing site for a **Paint, Coating & Resin Technical Consultancy**.
Read this before making changes. It encodes decisions already made — follow them
unless explicitly asked to change them.

## Stack
- Next.js (App Router) + React + TypeScript
- Bespoke CSS design system in `app/globals.css`. **No Tailwind, no UI kit.**
- Fonts via `next/font/google`: Archivo (display + UI, uses the `wdth` axis) and
  Source Serif 4 (lead copy).
- Deploy target: Vercel.

## Commands
- `npm run dev` — local dev
- `npm run build` — production build (run this before declaring a task done)
- `npm run lint`

## Architecture rules (do not violate)
1. **Content is never hard-coded in components.** Every section gets its content
   from async getters in `lib/content/index.ts` (`getSectors()`,
   `getCaseStudies()`, …). Components receive data as props or await a getter —
   they never import `data.ts` directly and never inline copy.
2. **Content models live in `lib/content/types.ts`** and map 1:1 to CMS fields.
   If a content shape changes: update the types first, then the data source, then
   the components.
3. **Design tokens live at the top of `app/globals.css`** (`--paper`, `--ink`,
   `--accent`, …). Reuse them. Don't introduce ad-hoc colours or a second styling
   system.
4. **Server Components by default.** Add `"use client"` only when a component needs
   state/effects/browser APIs. Current client components: `site-header`,
   `sections/contact`, `sections/sector-showcase`, `ui/reveal`, `ui/count-up`.

## Design direction
Grounded in coatings **metrology** — layered films, micron measurement, precision.
Palette: primer-grey + petrol-ink with a single ultramarine-pigment accent.
Restrained, technical, premium. Avoid generic SaaS-card / templated looks. Keep the
existing visual language when adding new pages.

## CMS plan
Hosted headless CMS. **Sanity is the chosen default**; only use headless WordPress
if the client explicitly requires it. Integration means reimplementing the getters
in `lib/content/index.ts` to fetch from the CMS and deleting `data.ts` — components
must not change as a result.

## Current status
- Homepage is built and componentized (`app/page.tsx` + `components/sections/*`).
- All content is realistic **placeholder**; the brand name "Calibre" is a placeholder.
- The contact form (`components/sections/contact.tsx`) is NOT wired to a backend yet.
- No CMS yet — getters return local placeholder data from `data.ts`.

## Still to build (typical upcoming tasks)
- Sanity integration (schemas from `types.ts`, client, getters, env, Studio, preview).
- Internal page templates: service, sector, case-study, insight/article + routing.
- Contact route handler (`app/api/contact/route.ts`) via Resend + spam protection.
- SEO: `sitemap.ts`, `robots.ts`, JSON-LD (Organization, Service, Article), OG images.

## Conventions
- Path alias `@/*` → repo root.
- One component per file, sections under `components/sections/`.
- Don't add dependencies without a clear need — prefer the platform and the
  existing design system.
