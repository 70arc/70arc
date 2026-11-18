import type { ProductArt } from "@content/products";
import styles from "./product-visual.module.css";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Stack() {
  return (
    <g {...stroke}>
      <rect x="196" y="72" width="248" height="72" rx="22" opacity="0.4" />
      <rect x="156" y="168" width="328" height="84" rx="22" opacity="0.68" />
      <rect x="104" y="276" width="432" height="120" rx="32" />
      <path d="M232 336q88-52 176 0" />
    </g>
  );
}

function GridArt() {
  return (
    <g {...stroke}>
      <rect x="88" y="56" width="464" height="368" rx="32" />
      <path d="M320 80v320M112 240h416" opacity="0.35" />
      <rect x="136" y="96" width="152" height="112" rx="22" opacity="0.55" />
      <rect x="352" y="272" width="160" height="112" rx="22" />
      <rect x="392" y="128" width="72" height="72" rx="12" opacity="0.8" />
    </g>
  );
}

function Exploded() {
  return (
    <g {...stroke}>
      <path d="M72 352Q320 28 568 352" opacity="0.28" />
      <rect x="96" y="248" width="176" height="80" rx="32" />
      <rect x="252" y="88" width="120" height="120" rx="22" />
      <rect x="412" y="176" width="140" height="96" rx="22" />
      <path d="M272 288C300 240 276 168 292 148" strokeDasharray="1.5 7" opacity="0.55" />
      <path d="M372 148C404 168 404 196 412 212" strokeDasharray="1.5 7" opacity="0.55" />
    </g>
  );
}

export function ProductVisual({ art, title }: { art: ProductArt; title?: string }) {
  const labelled = Boolean(title);
  return (
    <svg
      className={styles.visual}
      viewBox="0 0 640 480"
      role={labelled ? "img" : undefined}
      aria-hidden={labelled ? undefined : true}
      aria-label={labelled ? title : undefined}
    >
      {art === "stack" ? <Stack /> : art === "grid" ? <GridArt /> : <Exploded />}
    </svg>
  );
}
