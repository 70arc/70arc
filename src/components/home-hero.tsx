import { site } from "@content/site";
import { LinkButton } from "@/components/button";
import { Container } from "@/components/section";
import styles from "./home-hero.module.css";

const arcs = [
  { inset: 40, mid: 36, opacity: 0.5 },
  { inset: 130, mid: 96, opacity: 0.66 },
  { inset: 220, mid: 156, opacity: 1, accent: true },
  { inset: 310, mid: 214, opacity: 0.74 },
  { inset: 400, mid: 268, opacity: 0.55 },
];

function HeroArc() {
  const cx = 600;
  const baseline = 348;
  return (
    <svg className={styles.arc} viewBox="0 0 1200 320" fill="none" aria-hidden="true" data-arc="">
      {arcs.map((arc) => (
        <path
          key={arc.mid}
          pathLength={1}
          d={`M ${arc.inset} ${baseline} Q ${cx} ${2 * arc.mid - baseline} ${1200 - arc.inset} ${baseline}`}
          stroke={arc.accent ? "var(--accent)" : "currentColor"}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity={arc.opacity}
        />
      ))}
    </svg>
  );
}

export function HomeHero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <Container>
        <div className={styles.copy}>
          <p className={`eyebrow ${styles.eyebrow}`}>{site.hero.eyebrow}</p>
          <h1 id="hero-title" tabIndex={-1} className={styles.title}>
            {site.hero.title}
          </h1>
          <p className={`lede ${styles.subhead}`}>{site.hero.subhead}</p>
          <div className={styles.actions}>
            <LinkButton href="/#products">{site.hero.primary}</LinkButton>
            <LinkButton href="/#approach" variant="text">
              {site.hero.secondary}
            </LinkButton>
          </div>
        </div>
        <div className={styles.visualSlot}>
          <div className={styles.visual} data-scroll-progress="">
            <HeroArc />
          </div>
        </div>
      </Container>
    </section>
  );
}
