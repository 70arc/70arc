import type { SVGProps } from "react";
import { site } from "@content/site";
import { Container, Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import styles from "./principles.module.css";

const iconProps: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  width: 24,
  height: 24,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

function PrincipleIcon({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="7.25" />
        <path d="M8.75 12h6.5" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg {...iconProps}>
        <path d="M12 3.75 19.25 12 12 20.25 4.75 12 12 3.75z" />
      </svg>
    );
  }
  return (
    <svg {...iconProps}>
      <path d="M5 16.5a7 7 0 0 1 14 0" />
      <path d="M8 16.5a4 4 0 0 1 8 0" />
    </svg>
  );
}

export function Principles() {
  return (
    <Section labelledBy="featured-title">
      <Container>
        <SectionHeading
          eyebrow={site.featured.eyebrow}
          title={site.featured.title}
          titleId="featured-title"
        />
        <ul className={styles.grid}>
          {site.featured.items.map((item, index) => (
            <li key={item.title} className={styles.tile} data-reveal="" data-stagger={index}>
              <PrincipleIcon index={index} />
              <p className="caption">{item.number}</p>
              <h3>{item.title}</h3>
              <p className={styles.text}>{item.text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
