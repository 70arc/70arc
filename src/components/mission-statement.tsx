import type { CSSProperties } from "react";
import { site } from "@content/site";
import { Container, Section } from "@/components/section";
import styles from "./mission-statement.module.css";

const words = site.mission.split(" ");

export function MissionStatement() {
  return (
    <Section className={styles.mission} progress>
      <Container>
        <div className={styles.statement}>
          <p className="sr-only">{site.mission}</p>
          <p className={styles.line} aria-hidden="true">
            {words.map((word, index) => (
              <span key={`${word}-${index}`} className={styles.word} style={{ "--i": index, "--n": words.length } as CSSProperties}>
                {word}
                {index < words.length - 1 ? "\u00a0" : ""}
              </span>
            ))}
          </p>
        </div>
      </Container>
    </Section>
  );
}
