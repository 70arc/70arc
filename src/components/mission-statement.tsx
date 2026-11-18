import type { CSSProperties } from "react";
import { site } from "@content/site";
import { Container, Section } from "@/components/section";
import styles from "./mission-statement.module.css";

const words = site.mission.split(" ");

export function MissionStatement() {
  return (
    <Section className={styles.mission} progress>
      <Container>
        <p className={styles.statement} aria-label={site.mission}>
          {words.map((word, index) => (
            <span
              key={`${word}-${index}`}
              className={styles.word}
              style={{ "--i": index, "--n": words.length } as CSSProperties}
              aria-hidden="true"
            >
              {word}
              {index < words.length - 1 ? " " : null}
            </span>
          ))}
        </p>
      </Container>
    </Section>
  );
}
