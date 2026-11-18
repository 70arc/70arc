# 70arc — Design brief (v2 redesign)

This is the single source of truth for the v2 redesign. Read it fully before writing code.

## 0. What 70arc is (facts only)
70arc designs, builds and publishes AI products. Everything the site says comes from `content/site.ts` and `content/products.ts`. The three products in `content/products.ts` are **placeholders** ("Product One/Two/Three", "Coming soon") and must render gracefully as placeholders until the owner fills them in.

**Never invent facts.** No clients, client logos, testimonials, quotes, stats/metrics/counters, team members, founders, locations, office photos, awards, press, partner badges, pricing, email addresses, phone numbers, social links, launch dates or customer counts. If a section would need a fact that is not in `content/`, the section does not exist. New UI strings (button labels, section labels, aria labels) go into `content/site.ts`, never hard-coded in components, and must be neutral and factual. Existing copy may be tightened, not embellished.

## 1. Scope
- Delete the current design entirely: every file under `src/components/`, `src/lib/motion.ts`, `src/app/globals.css`, and the page markup in `src/app/**`. Rebuild from scratch. Do not port old class names, tokens, the cube art, the clay accent or the Newsreader serif.
- Keep: `content/` (source of truth, its exported API may be extended but not broken), `public/brand/*`, `public/og.jpg`, routes `/`, `/products`, `/products/[slug]` (SSG via generateStaticParams), `/company`, `not-found`, `robots.ts`, `sitemap.ts`, the redirects and security headers in `next.config.ts` (CSP stays: no external fonts, scripts, images or connections), `wrangler.jsonc`.
- Stack: Next.js 16 App Router, React 19, TypeScript strict, plain CSS (one `globals.css` with tokens + CSS Modules or well-scoped global classes; no Tailwind, no CSS-in-JS). Fonts via `next/font/google` (self-hosted at build, so CSP-safe).
- Dependencies: no new runtime dependencies by default. CSS + a tiny IntersectionObserver / scroll utility is the plan. Only if something genuinely cannot be done in CSS/vanilla may you add the `motion` package, and you must justify it in DESIGN-NOTES at the end of this file.
- Update `docs/EDITING.md` and replace `docs/motion-plan.md` to describe the new system.

## 2. Visual language — Apple-grade restraint
- **Type:** Inter (variable, `next/font/google`, `display: swap`, latin subset) for everything, falling back to `-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`. Fluid scale with `clamp()`:
  - display XL (hero): clamp(44px, 7.2vw, 96px), weight 600, letter-spacing -0.035em, line-height 1.02
  - display L (section titles): clamp(34px, 4.8vw, 64px), 600, -0.03em, 1.05
  - title M: clamp(22px, 2.2vw, 28px), 600, -0.015em, 1.2
  - body L (lede): clamp(18px, 1.6vw, 21px), 400, -0.005em, 1.5
  - body: 17px, 400, 1.55
  - caption/eyebrow: 14px, 600, letter-spacing 0 (NOT all-caps tracking-wide everywhere; sentence case eyebrows in the accent or muted colour)
  - Use `text-wrap: balance` for headings, `pretty` for paragraphs. Max measure ~ 34em for paragraphs.
- **Palette (neutral + one accent), via CSS custom properties, light and dark via `prefers-color-scheme` (no toggle needed):**
  - Light: bg #ffffff, bg-alt #f5f5f7, surface #ffffff, ink #1d1d1f, ink-2 #424245, muted #6e6e73, hairline rgba(0,0,0,.08), accent #0066cc (links/primary button), accent-hover #0077ed.
  - Dark: bg #000000, bg-alt #101012, surface #161618, ink #f5f5f7, ink-2 #d2d2d7, muted #a1a1a6, hairline rgba(255,255,255,.12), accent #2997ff.
  - One accent only. No gradients except a very subtle neutral vertical fade used for section transitions or image scrims. Absolutely no purple/blue/pink gradient text or backgrounds.
  - All text/background pairs must meet WCAG AA (check muted on bg-alt in both themes).
- **Spacing:** 4px base. Tokens 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160. Section padding block: clamp(96px, 14vw, 180px). Container max 1180px (wide 1440px for full-bleed rows), side gutter clamp(20px, 5vw, 48px). 12-column grid at >=1024, 6 at >=768, 4 below.
- **Radii:** 12px (controls, small tiles), 22px (cards), 32px (large feature panels), 999px (pills/buttons). Use exactly these.
- **Elevation:** prefer hairlines and bg-alt panels over shadows. At most one soft shadow token for floating UI (nav sheet / menus).
- **Imagery / iconography:** no stock imagery exists; do not fetch any. Use the real logo (`/brand/logo-nav.png`, `/brand/logo-transparent.png`). Product visuals are crafted, abstract, **monochrome** inline-SVG or CSS compositions (fine lines, simple geometry, typographic product names), one distinctive composition per product, keyed by the existing `art` field (`stack`, `grid`, `exploded`). Icons are hand-written inline SVG, 1.5px stroke, 24px grid, currentColor.

## 3. Information architecture
Global:
- **Skip link** (from `site.skip`) as the first focusable element.
- **Announcement bar** (from `site.announcement`, dismissible, persisted in localStorage with `announcementKey`, no flash; keep the existing pre-hydration inline script pattern).
- **Nav:** sticky, 52-56px tall, translucent (`background: color-mix(in srgb, var(--bg) 72%, transparent)` + `backdrop-filter: saturate(180%) blur(20px)`), hairline bottom border that only appears after scrolling. Left: logo + "70arc". Right: Products (with an Apple-style dropdown panel listing published products with status pills, and "View all products"), Approach (/#approach), Company. Mobile (<768): a menu button that opens a full-width sheet with a smooth height/opacity transition; focus trapped, Esc closes, body scroll locked, `aria-expanded`/`aria-controls` correct.
- **Footer:** compact, Apple-style: hairline top, logo, `site.footer.tagline`, columns Products (published products) and Company, bottom row "(c) {year} 70arc. All rights reserved." using the real copyright sign. No social icons, no address, no newsletter.

Home (`/`) in this order:
1. **Hero**: full-viewport-height (min 100svh minus nav), centred. Eyebrow `site.hero.eyebrow`, H1 `site.hero.title` set huge, subhead, primary button (`site.hero.primary` -> `/#products`) and a secondary text link ("Our approach" -> `/#approach`, string added to site.ts). Under it, a large crafted hero visual: an abstract arc motif derived from the brand name (e.g. concentric arcs drawn as thin SVG strokes that draw in on load and subtly rotate/parallax on scroll). Monochrome with at most one accent stroke.
2. **Mission statement**: `site.mission` as a huge centred statement with a scroll-linked word-by-word reveal (opacity 0.35 -> 1 per word as it crosses the viewport; full opacity at rest when reduced-motion or JS is off).
3. **Products**: section header from `site.productsSection`. Then **sticky scroll storytelling**: on >=1024px a two-column layout where the left column is sticky (product visual crossfades between the three `art` compositions) and the right column scrolls through each product (name, status pill, tagline, summary, link "Learn more", or "Visit product" if `url`). Below 1024px it collapses to stacked full-width product panels (bg-alt, radius 32px) with their visual on top. Placeholders must still look intentional.
4. **Principles**: `site.featured` (Clear / Careful / Lasting) as three tall tiles in a row (bg-alt, radius 22px), each with a crafted icon and the number set small.
5. **Approach** (`id="approach"`): `site.approach` four steps as a horizontal progress rail on desktop with a line that fills as you scroll through the section (scroll-linked), vertical on mobile.
6. **Values**: `site.values` as a clean 2x2 (desktop 4-up) grid of text blocks separated by hairlines.
7. **Closing CTA**: a large panel. Add a `cta` block to site.ts with title "See what we're building." and buttons "Explore products" -> /products, "About 70arc" -> /company. No email/contact form (no contact details exist).

`/products`: page hero (`indexTitle`, `indexIntro`) + grid of product cards (visual, name, status, tagline). `/products/[slug]`: product hero with large visual, status, tagline, overview section (`summary`), back link, external link if `url`. Unpublished slugs 404. `/company`: big title, body, then the values and approach blocks reused. `not-found`: calm, centred, link home.

## 4. Motion: Apple-style, purposeful
Principles: motion explains hierarchy and continuity; nothing loops forever except an extremely slow ambient drift on the hero arcs (>= 20s period). Animate only `transform`, `opacity`, `clip-path`, and SVG `stroke-dashoffset`. No layout-shifting animations; reserve all space up front. 60fps target.
- Easing tokens: `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`, `--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)`, spring-like for presses `cubic-bezier(0.34, 1.56, 0.64, 1)` (subtle).
- Durations: micro 160ms, UI 240ms, reveal 900ms, scene 1200ms. Stagger 70ms.
- **Load:** hero eyebrow/title/subhead/buttons rise 16px + fade, staggered; hero arcs draw in.
- **Reveal on scroll:** elements with `data-reveal` rise 24px + fade once when 15% visible (one shared IntersectionObserver). Content must be visible without JS (only hide when `html[data-motion="on"]` is set by the pre-hydration script).
- **Scroll-linked:** prefer CSS `animation-timeline: view()/scroll()` inside `@supports`, with an rAF-throttled JS fallback that writes a single CSS variable (`--p`) per element; passive listeners; no work when off-screen.
- **Parallax:** hero visual and product visuals translate at most 40px across their scroll range.
- **Sticky product story:** active product determined by IntersectionObserver on the right-column items; visual crossfades (opacity + scale 0.96 -> 1) in 600ms.
- **Hover/press:** buttons and cards: hover changes colour/scale <= 1.02 over 240ms; `:active` scale 0.97 with the spring ease. Card visuals shift subtly on hover. All hover effects gated by `@media (hover: hover)`.
- **Page transitions:** route transitions via the View Transitions API where supported (or a `template.tsx` fade); must not block navigation; focus moves to the main heading after navigation.
- **Reduced motion:** with `prefers-reduced-motion: reduce`, everything is shown at rest, no transforms, no scroll scrubbing, no ambient drift, no transition animation.

## 5. Anti-"AI slop" rules (hard bans)
No purple/blue/pink gradients; no gradient text; no glassmorphism cards or blurred colour blobs/orbs; no glowing borders or neon shadows; no emoji anywhere; no generic copy ("Unlock the power of AI", "Revolutionize", "Seamless", "Next-gen", "Cutting-edge", "Supercharge"); no fake dashboards, fake charts, fake code windows or fake metrics; no stock 3D shapes/spheres/blobs; no sparkle/star icons for "AI"; no bento grid filled with filler; no rounded-everything with heavy drop shadows; no cursor-follower effects; no marquee of fake logos. When unsure, remove it.

## 6. Accessibility (WCAG 2.1 AA)
Semantic landmarks (header/nav/main/footer), one H1 per page, logical heading order, visible `:focus-visible` rings (2px accent outline, 3px offset) on every interactive element, keyboard-operable dropdown and mobile menu (Esc closes, focus returns), `aria-current="page"` in nav, tap targets >= 44px, decorative SVGs `aria-hidden`, meaningful SVGs titled, colour contrast AA in both themes, no content conveyed by motion alone, `lang="en"`.

## 7. Performance
Lighthouse mobile target: Performance >= 90, Accessibility 100, Best Practices 100, SEO 100. Static rendering everywhere; client components only where interaction requires (nav, announcement, motion root, sticky story). Client JS beyond Next's runtime < 15 KB gzip. Use `next/image` (images are unoptimized in config; set width/height; `priority` only for the above-the-fold logo). CLS < 0.02, font with `adjustFontFallback`. No console errors or hydration warnings.

## 8. Quality gates (must pass after every phase)
`npm run lint`, `npm run typecheck`, `npm run build` with zero errors and no new warnings. Don't add test frameworks. Don't modify `.grok-logs/`, `.git`, `package-lock.json` (unless a justified dependency is added), `wrangler.jsonc`. Do not run git commands that change history; do not commit, push, deploy or run wrangler. Do not leave dev servers running.

## DESIGN-NOTES (builder fills in: decisions, any dependency justification, known gaps)

Phase 1 foundation, 2026-11-19.

- No new runtime dependency. Motion is one shared `IntersectionObserver` plus one `requestAnimationFrame`-throttled scroll listener in `MotionRoot`. Both stay off unless the pre-hydration script set `data-motion="on"`.
- `template.tsx` was removed in this phase, so there is no page-fade yet. After a client navigation, `MotionRoot` moves focus to `main h1`. A View Transitions fade is still to do.
- Light `--accent-hover` stays `#0077ed`, as specified. White text on that blue is about 4.32:1, and the blue as text on white is the same, so it is not used for labels. It colours the secondary button border on hover. The filled button darkens slightly in light mode and lightens slightly in dark mode so the label stays above 4.5:1. Dark filled buttons use black text because white on `#2997ff` is about 3.02:1. Dark hover is a lighter mix of `#2997ff`; the brief did not give a separate dark hover hex.
- Muted `#6e6e73` on `#f5f5f7` is about 4.66:1. The other specified text pairs are higher.
- Page bodies are placeholders. Home only renders the hero copy plus the products and approach headings so the nav anchors resolve. Sticky product story, mission scrub, principles, values, closing panel, and the designed product and company layouts are later phases.
- `docs/motion-plan.md` describes the new tokens and what this phase actually runs.