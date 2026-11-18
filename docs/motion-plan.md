# Motion plan

Apple-style and purposeful. Motion explains hierarchy and continuity. Nothing loops except an extremely slow ambient drift on the hero arcs (28s). Animate only `transform`, `opacity`, `clip-path`, and SVG `stroke-dashoffset`. No layout-shifting animation. Space is reserved up front.

Easing: `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`, `--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)`, press `--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)`. Durations: micro 160ms, UI 240ms, reveal 900ms, scene 1200ms. Stagger 70ms.

The pre-hydration script sets `data-motion="on"` only when `prefers-reduced-motion` is not reduce. Content stays visible without that attribute. `MotionRoot` does nothing for reveals or scroll progress unless the attribute is present. Do not start a second reveal observer.

Scroll-linked effects use `animation-timeline: view()` or `scroll()` inside `@supports (animation-timeline: view())`. The rAF `--p` listener runs only when that support is missing. It watches progress elements with an IntersectionObserver and attaches the scroll listener only while at least one of them is near the viewport.

| Element | Trigger | Duration | Easing | Reduced motion |
|---|---|---|---|---|
| Header | Load | 240ms fade | ease-out | Shown. No fade |
| Hero eyebrow, subhead, buttons | Load | 900ms, rise 16px + fade, 70ms stagger | ease-out | Shown at rest |
| Hero H1 | Load | 900ms, translate 16px only. Never opacity 0 | ease-out | Shown at rest |
| Hero arcs | Load, then drift | Draw 1200ms, 70ms stagger per arc. Drift 28s, about 1.2deg and 2px, delayed until the draw finishes | ease-out, then ease-in-out | Strokes shown. No draw, no drift |
| `[data-reveal]` | 15% visible, once | 900ms, rise 24px + fade. `data-stagger` becomes `--reveal-index` (70ms). An `h1` translates only | ease-out | Shown at rest. Hidden only while `html[data-motion="on"]` and not yet shown |
| Hero visual | Leave the view | At most 40px and scale 1 to 0.96 | Linear, tied to scroll | No shift |
| Mission words | Each word crosses the view | Opacity 0.52 to 1. The floor is the dimmest step that still clears 3:1 for this large type on white and on black | Linear, tied to scroll | Full opacity |
| Approach rail | Section crosses the view | Line scales from 0 to 1 on the block axis (inline on desktop) | Linear, tied to scroll | Line is full |
| Product visuals | In view, or the sticky story timeline | About 24px, 20px on the sticky stage | Linear, tied to scroll | No shift |
| Product story | Centred band (`rootMargin: -40% 0px -40% 0px`) | Crossfade and scale 0.96 to 1 in 600ms. `data-active` is the step index; the current step is `data-active="true"`. Dots match the product count | ease-out | Active visual only. No scale |
| Buttons | Hover background, press scale 0.97 | 240ms / 160ms | ease-out, spring on press | No scale. Colour can still change |
| Chevron link | Hover | Icon shifts 2px, 240ms | ease-out | Icon stays still |
| Product card | Hover on a fine pointer | Visual scales 1.02. Card background and a 1px hairline change. Press scale 0.97 | ease-out, spring on press | No scale |
| Products panel | Open / close | 240ms open, 160ms close. Opacity, 8px, scale 0.98 | ease-out | Shown or hidden with no travel |
| Mobile sheet | Open / close | Sheet slides and fades (240ms open, 160ms close). Links stagger 70ms | ease-out | Shown or hidden with no travel |
| Nav hairline | After 8px of scroll | 240ms fade, or `scroll()` where supported | ease-out / linear | Appears with no fade |
| Page change | Client navigation where `startViewTransition` exists | 300ms root crossfade. `view-transition-name: vt-{slug}` from a card or story visual to the product hero | ease-in-out on the root | No view transition. Focus still moves to `main h1` |

`experimental.viewTransition` is on in `next.config.ts`. Next 16.1 accepts the flag and does not run App Router navigations inside a view transition by itself, so `MotionRoot` calls `document.startViewTransition` around same-origin client navigations. Browsers without the API navigate normally. `@view-transition { navigation: auto }` covers full page loads. Hover styles sit under `@media (hover: hover) and (pointer: fine)`.

With `prefers-reduced-motion: reduce`, everything is shown at rest: no transforms, no scroll scrubbing, no ambient drift, and no transition animation.
