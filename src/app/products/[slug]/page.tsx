import { notFound } from "next/navigation";
import { productBySlug, publishedProducts } from "@content/products";
import { site } from "@content/site";
import { LinkButton } from "@/components/button";
import { ProductVisual } from "@/components/product-visual";
import { Container, Section } from "@/components/section";
import { StatusPill } from "@/components/status-pill";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return publishedProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) return {};
  return pageMeta(`${product.name} | ${site.name}`, product.tagline);
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) notFound();

  return (
    <Section>
      <Container>
        <div className="stack">
          <LinkButton href="/products" variant="text">
            {site.productsSection.back}
          </LinkButton>
          <StatusPill status={product.status} />
          <h1 tabIndex={-1}>{product.name}</h1>
          <p className="lede">{product.tagline}</p>
          <ProductVisual art={product.art} title={product.name} />
          <h2 className="title-m">{site.productsSection.overview}</h2>
          <p className="measure">{product.summary}</p>
          {product.url ? (
            <LinkButton href={product.url} variant="secondary">
              {site.productsSection.visit}
            </LinkButton>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
