import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { productBySlug, publishedProducts } from "@content/products";
import { site } from "@content/site";
import { LinkButton } from "@/components/button";
import { ProductVisual } from "@/components/product-visual";
import { Container, Section } from "@/components/section";
import { StatusPill } from "@/components/status-pill";
import { pageMeta } from "@/lib/seo";
import styles from "./product.module.css";

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
        <div className={styles.hero}>
          <StatusPill status={product.status} />
          <h1 tabIndex={-1}>{product.name}</h1>
          <p className="lede">{product.tagline}</p>
        </div>
        <div className={styles.visual} data-reveal="" style={{ viewTransitionName: `vt-${product.slug}` } as CSSProperties}>
          <div className="scroll-shift" data-scroll-progress="">
            <ProductVisual art={product.art} />
          </div>
        </div>
        <section className={styles.overview} aria-labelledby="overview-title">
          <h2 id="overview-title">{site.productsSection.overview}</h2>
          <p>{product.summary}</p>
          <div className={styles.links}>
            <LinkButton href="/products" variant="text">
              {site.productsSection.back}
            </LinkButton>
            {product.url ? (
              <LinkButton href={product.url} variant="secondary">
                {site.productsSection.visit}
              </LinkButton>
            ) : null}
          </div>
        </section>
      </Container>
    </Section>
  );
}
