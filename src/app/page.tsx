import { site } from "@content/site";
import { LinkButton } from "@/components/button";
import { Container, Section } from "@/components/section";

export default function HomePage() {
  return (
    <>
      <Section>
        <Container>
          <div className="stack" data-reveal="">
            <p className="eyebrow">{site.hero.eyebrow}</p>
            <h1 tabIndex={-1}>{site.hero.title}</h1>
            <p className="lede">{site.hero.subhead}</p>
            <div className="cluster">
              <LinkButton href="/#products">{site.hero.primary}</LinkButton>
              <LinkButton href="/#approach" variant="text">
                {site.hero.secondary}
              </LinkButton>
            </div>
          </div>
        </Container>
      </Section>
      <Section id="products" labelledBy="products-title">
        <Container>
          <h2 id="products-title">{site.productsSection.title}</h2>
        </Container>
      </Section>
      <Section id="approach" labelledBy="approach-title">
        <Container>
          <h2 id="approach-title">{site.approach.title}</h2>
        </Container>
      </Section>
    </>
  );
}
