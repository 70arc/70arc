import { site } from "@content/site";
import { Approach } from "@/components/approach";
import { ClosingCta } from "@/components/closing-cta";
import { Container, Section } from "@/components/section";
import { ValuesSection } from "@/components/values-section";
import { pageMeta } from "@/lib/seo";
import styles from "./company.module.css";

export const metadata = pageMeta(`${site.company.title.replace(".", "")} | ${site.name}`, site.company.body);

export default function CompanyPage() {
  return (
    <>
      <Section>
        <Container>
          <div className={styles.intro}>
            <h1 tabIndex={-1} data-reveal="">
              {site.company.title}
            </h1>
            <p className="lede" data-reveal="" data-stagger="1">
              {site.company.body}
            </p>
          </div>
        </Container>
      </Section>
      <ValuesSection />
      <Approach />
      <ClosingCta />
    </>
  );
}
