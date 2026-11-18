import { site } from "@content/site";
import { Container, Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import styles from "./values-section.module.css";

export function ValuesSection() {
  return (
    <Section labelledBy="values-title">
      <Container>
        <SectionHeading
          eyebrow={site.values.eyebrow}
          title={site.values.title}
          titleId="values-title"
        />
        <ul className={styles.list}>
          {site.values.items.map((item, index) => (
            <li key={item.title} className={styles.item} data-reveal="" data-stagger={index}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
