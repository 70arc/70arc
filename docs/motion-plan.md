# Motion plan

Easing for reveals and UI: cubic-bezier(0.22, 1, 0.36, 1). Loops use ease-in-out. Durations: micro 150ms, UI 250ms, reveal 800ms, scene 1200ms, dropdown 200ms, page 300ms. Stagger 80ms. Only transform, opacity, and clip-path.

The mission statement never fades below 50% opacity. At 30% opacity, ink on the sunken background is about 1.94:1. At 50% it is about 3.36:1, which meets WCAG AA for this large text.

| Element | Trigger | Duration | Easing | Reduced motion |
|---|---|---|---|---|
| Navigation | Load | 250ms fade | standard | Shown at rest |
| Hero eyebrow, subhead, button | Load | 800ms, stagger 80ms | standard | Shown at rest |
| Hero headline | Load | 800ms, translate only so the text stays paintable | standard | Shown at rest |
| Hero cube | Load, then float | Faces slide 24px over 800ms, stagger 80ms, then float 8s by 6px | standard; float ease-in-out | Static cube |
| Sections | Enter the viewport once | 800ms, rise 24px | standard | Shown at rest |
| Mission words | Scroll across the middle of the viewport | Tied to scroll | linear scrub | Full opacity |
| Approach dot | Scroll through the section | Tied to scroll | linear | Dot stays on the first step |
| Dark section edge | Always | Static blend over 96px | none | Same blend |
| Dropdown | Open and close | 200ms | standard | Shown or hidden with no travel |
| Cards | Hover | 250ms | standard | No illustration travel; border can still change |
| Page change | Navigation after the first load | 300ms opacity | standard | No fade; scroll still resets and focus moves to the heading |
| Buttons | Hover and focus | 150ms | standard | No movement; clay focus ring remains |
