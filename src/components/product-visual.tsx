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
      <rect x="168" y="88" width="280" height="64" rx="16" opacity="0.35" />
      <rect x="148" y="156" width="320" height="76" rx="18" opacity="0.62" />
      <rect x="112" y="236" width="392" height="132" rx="22" />
      <path d="M156 292h176" opacity="0.7" />
      <path d="M156 316h112" opacity="0.4" />
      <path d="M430 292a28 28 0 0 1 28 28" opacity="0.8" />
    </g>
  );
}

function GridArt() {
  return (
    <g {...stroke}>
      <rect x="96" y="72" width="448" height="336" rx="24" />
      <path d="M208 96v288M320 96v288M432 96v288" opacity="0.4" />
      <path d="M120 184h400M120 296h400" opacity="0.4" />
      <rect x="228" y="204" width="72" height="72" rx="12" />
      <path d="M456 112a36 36 0 0 1 36 36" />
      <path d="M132 120l40 40" opacity="0.45" />
    </g>
  );
}

function Exploded() {
  return (
    <g {...stroke}>
      <path d="M320 214v72M284 250h72" opacity="0.35" />
      <circle cx="206" cy="148" r="50" />
      <rect x="386" y="112" width="96" height="96" rx="18" />
      <rect x="164" y="308" width="156" height="44" rx="22" />
      <path d="M248 184L292 226" strokeDasharray="1.5 7" opacity="0.55" />
      <path d="M386 176L348 226" strokeDasharray="1.5 7" opacity="0.55" />
      <path d="M250 308L304 274" strokeDasharray="1.5 7" opacity="0.55" />
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
