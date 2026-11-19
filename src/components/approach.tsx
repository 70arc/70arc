import { site } from "@content/site";
import { Container, Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import styles from "./approach.module.css";

export function Approach() {
  return (
    <Section labelledBy="approach-title" marker="approach">
      <Container>
        <SectionHeading
          id="approach"
          titleId="approach-title"
          eyebrow={site.approach.eyebrow}
          title={site.approach.title}
        />
        <div className={styles.rail} data-reveal="" data-stagger="2" data-scroll-progress="">
          <div className={styles.track} aria-hidden="true">
            <span className={styles.fill} />
          </div>
          <ol className={styles.steps}>
            {site.approach.steps.map((step) => (
              <li key={step.title} className={styles.step}>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
