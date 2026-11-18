"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

function markShown(node: Element, reveal: IntersectionObserver) {
  if (!(node instanceof HTMLElement)) return;
  node.setAttribute("data-shown", "true");
  node.style.willChange = node.tagName === "H1" ? "transform" : "transform, opacity";
  let pending = node.tagName === "H1" ? 1 : 2;
  const clear = (event: TransitionEvent) => {
    if (event.target !== node) return;
    if (event.propertyName !== "transform" && event.propertyName !== "opacity") return;
    pending -= 1;
    if (pending > 0) return;
    node.style.willChange = "";
    node.removeEventListener("transitionend", clear);
  };
  node.addEventListener("transitionend", clear);
  reveal.unobserve(node);
}

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
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!("startViewTransition" in document)) return;

    let running = false;
    let path = location.pathname;

    const arm = (nextPath: string) => {
      if (running || reduced.matches || nextPath === path) return;
      path = nextPath;
      const before = document.querySelector("main h1")?.textContent ?? "";
      const started = performance.now();
      try {
        running = true;
        const transition = document.startViewTransition(
          () =>
            new Promise<void>((resolve) => {
              const check = () => {
                const text = document.querySelector("main h1")?.textContent ?? "";
                if ((location.pathname === nextPath && text !== before) || performance.now() - started > 1500) {
                  resolve();
                  return;
                }
                window.setTimeout(check, 16);
              };
              check();
            }),
        );
        transition.ready.catch(() => {});
        transition.finished.catch(() => {});
        transition.updateCallbackDone.finally(() => {
          running = false;
        });
      } catch {
        running = false;
      }
    };

    const onClick = (event: MouseEvent) => {
      if (reduced.matches || event.defaultPrevented === false) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      let url: URL;
      try {
        url = new URL(anchor.href);
      } catch {
        return;
      }
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      arm(url.pathname);
    };

    const onPop = () => {
      if (reduced.matches || location.pathname === path) return;
      arm(location.pathname);
    };

    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches || document.documentElement.dataset.motion !== "on") return;

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          markShown(entry.target, reveal);
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

    const timeline = CSS.supports("animation-timeline", "view()");
    let frame = 0;
    let listening = false;
    const visible = new Set<HTMLElement>();

    const tick = () => {
      frame = 0;
      if (visible.size === 0) return;
      const viewport = window.innerHeight;
      for (const node of visible) {
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
    const onScroll = () => requestTick();
    const syncListener = () => {
      if (visible.size === 0) {
        if (!listening) return;
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        listening = false;
        if (frame !== 0) {
          window.cancelAnimationFrame(frame);
          frame = 0;
        }
        return;
      }
      if (listening) return;
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      listening = true;
      requestTick();
    };

    const watch = timeline
      ? null
      : new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (!(entry.target instanceof HTMLElement)) continue;
              if (entry.isIntersecting) visible.add(entry.target);
              else visible.delete(entry.target);
            }
            syncListener();
          },
          { rootMargin: "64px 0px" },
        );

    if (watch) {
      document.querySelectorAll<HTMLElement>("[data-scroll-progress]").forEach((node) => watch.observe(node));
    }

    const onChange = () => {
      if (!media.matches) return;
      reveal.disconnect();
      watch?.disconnect();
      if (listening) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
    media.addEventListener("change", onChange);

    return () => {
      reveal.disconnect();
      watch?.disconnect();
      if (listening) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
      media.removeEventListener("change", onChange);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
