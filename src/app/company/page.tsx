import { site } from "@content/site";
import { Container, Section } from "@/components/section";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(`${site.company.title.replace(".", "")} | ${site.name}`, site.company.body);

export default function CompanyPage() {
  return (
    <Section>
      <Container>
        <div className="stack">
          <h1 tabIndex={-1}>{site.company.title}</h1>
          <p className="lede measure">{site.company.body}</p>
        </div>
      </Container>
    </Section>
  );
}
