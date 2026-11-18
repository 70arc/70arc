"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function MotionRoot() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const heading = document.querySelector("main h1");
    if (heading instanceof HTMLElement) {
      if (heading.tabIndex < 0) heading.tabIndex = -1;
      heading.focus();
    }
  }, [pathname]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches || document.documentElement.dataset.motion !== "on") return;

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-shown", "true");
          reveal.unobserve(entry.target);
        }
      },
      { threshold: 0.15 },
    );

    document.querySelectorAll("[data-reveal]:not([data-shown='true'])").forEach((node) => {
      if (node instanceof HTMLElement && node.dataset.stagger) {
        node.style.setProperty("--reveal-index", node.dataset.stagger);
      }
      reveal.observe(node);
    });

    let frame = 0;
    const tick = () => {
      frame = 0;
      const viewport = window.innerHeight;
      const nodes = document.querySelectorAll<HTMLElement>("[data-scroll-progress]");
      for (const node of nodes) {
        const rect = node.getBoundingClientRect();
        if (rect.bottom <= 0 || rect.top >= viewport) continue;
        const progress = (viewport - rect.top) / (viewport + rect.height);
        const next = Math.min(1, Math.max(0, progress)).toFixed(3);
        if (node.style.getPropertyValue("--p") !== next) node.style.setProperty("--p", next);
      }
    };
    const requestTick = () => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(tick);
    };

    requestTick();
    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick, { passive: true });

    const onChange = () => {
      if (!media.matches) return;
      reveal.disconnect();
      window.removeEventListener("scroll", requestTick);
      window.removeEventListener("resize", requestTick);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
    media.addEventListener("change", onChange);

    return () => {
      reveal.disconnect();
      window.removeEventListener("scroll", requestTick);
      window.removeEventListener("resize", requestTick);
      media.removeEventListener("change", onChange);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
