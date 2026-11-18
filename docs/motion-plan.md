# Motion plan

Apple-style and purposeful. Motion explains hierarchy and continuity. Nothing loops except an extremely slow ambient drift on the hero arcs (at least a 20s period), which later phases add. Animate only `transform`, `opacity`, `clip-path`, and SVG `stroke-dashoffset`. No layout-shifting animation. Space is reserved up front.

Easing: `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`, `--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)`, press `--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)`. Durations: micro 160ms, UI 240ms, reveal 900ms, scene 1200ms. Stagger 70ms.

The pre-hydration script sets `data-motion="on"` only when `prefers-reduced-motion` is not reduce. Content stays visible without that attribute. `MotionRoot` does nothing unless the attribute is present.

| Element | Trigger | Duration | Easing | Reduced motion |
|---|---|---|---|---|
| `[data-reveal]` | 15% visible, once, one shared IntersectionObserver | 900ms, rise 24px, optional `--reveal-index` stagger | ease-out | Shown at rest. Hidden only while `html[data-motion="on"]` and not yet shown |
| `[data-scroll-progress]` | Scroll, rAF-throttled, writes `--p` from 0 to 1. Skips elements outside the viewport | Tied to scroll | Linear progress value | Listener does not run |
| Buttons | Hover scale 1.02, press scale 0.97 | 240ms / 160ms | ease-out, spring on press | No scale. Colour can still change. Hover only under `(hover: hover)` |
| Chevron link | Hover, icon shifts 3px | 240ms | ease-out | Icon stays still |
| Products panel and mobile sheet | Open and close | 240ms opacity, and height for the sheet | ease-out | Shown or hidden with no travel |
| Page change | After the first load | No fade in this phase | — | Focus moves to `main h1`. Scroll reset is the browser default |

Later phases add the hero arc draw, scroll-linked mission words and approach rail (CSS `animation-timeline` where supported, `--p` as the fallback), at most 40px of parallax, the sticky product crossfade, and a View Transitions fade that does not block navigation. Those must use the same tokens and must not start a second observer.

With `prefers-reduced-motion: reduce`, everything is shown at rest: no transforms, no scroll scrubbing, no ambient drift, and no transition animation.
