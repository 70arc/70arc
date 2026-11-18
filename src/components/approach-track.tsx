"use client";

import { useEffect, useRef } from "react";

export function ApproachTrack() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const dot = ref.current;
    const section = dot?.closest(".approach");
    if (!dot || !section) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;
    let frame = 0;
    const paint = () => {
      frame = 0;
      const track = dot.parentElement;
      if (!track) return;
      const rect = section.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight * 0.55 - rect.top) / Math.max(rect.height, 1)));
      const wide = window.matchMedia("(min-width: 1024px)").matches;
      const travel = Math.max(0, (wide ? track.clientWidth : track.clientHeight) - 8);
      dot.style.transform = wide ? `translate3d(${progress * travel}px, 0, 0)` : `translate3d(0, ${progress * travel}px, 0)`;
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(paint);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="track" aria-hidden="true">
      <span className="dot" ref={ref} />
    </div>
  );
}
