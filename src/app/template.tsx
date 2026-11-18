"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { duration, ease } from "@/lib/motion";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo(0, 0);
    const heading = document.querySelector("main h1");
    if (heading instanceof HTMLElement) {
      heading.tabIndex = -1;
      heading.focus();
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const main = document.querySelector("main");
    if (!reduce && main) {
      main.animate([{ opacity: 0 }, { opacity: 1 }], { duration: duration.page, easing: ease, fill: "both" });
    }
  }, [pathname]);

  return children;
}
