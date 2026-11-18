import { site } from "@content/site";
import { LinkButton } from "@/components/button";
import { Container, Section } from "@/components/section";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(site.notFound.title, site.notFound.text);

export default function NotFound() {
  return (
    <Section>
      <Container>
        <div className="center">
          <h1 tabIndex={-1}>{site.notFound.title}</h1>
          <p className="lede">{site.notFound.text}</p>
          <LinkButton href="/">{site.notFound.home}</LinkButton>
        </div>
      </Container>
    </Section>
  );
}
