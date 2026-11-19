import { site } from "@content/site";
import { LinkButton } from "@/components/button";
import { Container, Section } from "@/components/section";
import styles from "./closing-cta.module.css";

export function ClosingCta() {
  return (
    <Section labelledBy="cta-title">
      <Container>
        <div className={styles.panel} data-reveal="">
          <h2 id="cta-title">{site.cta.title}</h2>
          <div className={styles.actions}>
            <LinkButton href="/products">{site.cta.products}</LinkButton>
            <LinkButton href="/contact" variant="secondary">
              {site.cta.contact}
            </LinkButton>
            <LinkButton href="/company" variant="secondary">
              {site.cta.company}
            </LinkButton>
          </div>
        </div>
      </Container>
    </Section>
  );
}
