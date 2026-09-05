"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface CountUpProps {
  end: number | string;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

function parseStat(end: number | string) {
  if (typeof end === "number") {
    return { lead: "", value: end, trail: "", decimals: 0 };
  }

  const match = end.match(/^(.*?)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) {
    return { lead: "", value: null, trail: end, decimals: 0 };
  }

  const raw = match[2];
  const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
  return {
    lead: match[1],
    value: parseFloat(raw),
    trail: match[3],
    decimals,
  };
}

function formatCount(value: number, decimals: number) {
  return decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
}

export default function CountUp({
  end,
  duration = 2,
  prefix = "",
  suffix = "",
  className = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const parsed = parseStat(end);
  const finalLabel =
    parsed.value === null
      ? `${prefix}${end}${suffix}`
      : `${prefix}${parsed.lead}${formatCount(parsed.value, parsed.decimals)}${parsed.trail}${suffix}`;
  const [animatedLabel, setAnimatedLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!isInView || parsed.value === null || parsed.value === 0) {
      return;
    }

    const startTime = performance.now();
    const durationMs = duration * 1000;
    let frame = 0;

    const updateCount = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = parsed.value! * eased;
      setAnimatedLabel(
        `${prefix}${parsed.lead}${formatCount(current, parsed.decimals)}${parsed.trail}${suffix}`
      );

      if (progress < 1) {
        frame = requestAnimationFrame(updateCount);
      }
    };

    frame = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(frame);
  }, [isInView, parsed.value, parsed.lead, parsed.trail, parsed.decimals, duration, prefix, suffix]);

  const display =
    isInView && parsed.value && parsed.value > 0
      ? animatedLabel ?? `${prefix}${parsed.lead}${formatCount(0, parsed.decimals)}${parsed.trail}${suffix}`
      : finalLabel;

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
