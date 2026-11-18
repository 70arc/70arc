import type { CSSProperties } from "react";
import type { ProductArt } from "@content/products";

type Mode = "animated" | "static";

const top = "18,50 80,18 142,50 80,82";
const left = "18,50 80,82 80,146 18,114";
const right = "80,82 142,50 142,114 80,146";

function Cube({ clay, index }: { clay?: "top" | "left" | "right"; index?: number }) {
  const fill = (face: "top" | "left" | "right", base: string) => (clay === face ? "var(--clay)" : base);
  return (
    <g className="mini" style={index === undefined ? undefined : ({ "--i": index } as CSSProperties)}>
      <polygon className="face face-top" points={top} fill={fill("top", "var(--surface)")} />
      <polygon className="face face-left" points={left} fill={fill("left", "var(--face-grey)")} />
      <polygon className="face face-right" points={right} fill={fill("right", "var(--canvas)")} />
    </g>
  );
}

export function HeroCube() {
  return (
    <div className="hero-visual">
      <svg className="hero-cube" viewBox="0 0 160 164" aria-hidden="true">
        <Cube clay="right" />
      </svg>
    </div>
  );
}

export function ArtStack({ mode }: { mode: Mode }) {
  return (
    <svg className={mode === "animated" ? "art-stack is-live" : "art-stack"} viewBox="0 0 220 210" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => {
        const y = 18 + index * 32;
        return (
          <g className="slab" key={y} style={{ "--i": index } as CSSProperties}>
            <polygon points={`20,${28 + y} 110,${8 + y} 200,${28 + y} 110,${48 + y}`} fill={index === 0 ? "var(--clay)" : "var(--surface)"} />
            <polygon points={`20,${28 + y} 110,${48 + y} 110,${62 + y} 20,${42 + y}`} fill="var(--face-grey)" />
            <polygon points={`110,${48 + y} 200,${28 + y} 200,${42 + y} 110,${62 + y}`} fill="var(--canvas)" />
          </g>
        );
      })}
    </svg>
  );
}

export function ArtGrid({ mode }: { mode: Mode }) {
  return (
    <svg className={mode === "animated" ? "art-grid is-live" : "art-grid"} viewBox="0 0 280 250" aria-hidden="true">
      {Array.from({ length: 9 }, (_, index) => {
        const column = index % 3;
        const row = Math.floor(index / 3);
        return (
          <g key={index} transform={`translate(${column * 78 + 8}, ${row * 70 + 4}) scale(0.48)`}>
            <Cube index={index} clay={index === 4 ? "top" : undefined} />
          </g>
        );
      })}
    </svg>
  );
}

export function ArtExploded({ mode }: { mode: Mode }) {
  return (
    <svg className={mode === "animated" ? "art-exploded is-live" : "art-exploded"} viewBox="0 0 200 200" aria-hidden="true">
      <Cube clay="right" />
    </svg>
  );
}

export function ProductArt({ art, mode }: { art: ProductArt; mode: Mode }) {
  if (art === "stack") return <ArtStack mode={mode} />;
  if (art === "grid") return <ArtGrid mode={mode} />;
  return <ArtExploded mode={mode} />;
}
