import type { CSSProperties } from "react";
import Link from "next/link";
import { publishedProducts } from "@content/products";
import { site } from "@content/site";
import { Icon } from "@/components/icon";
import { ProductLinkText } from "@/components/product-link-text";
import { ProductVisual } from "@/components/product-visual";
import { Container, Section } from "@/components/section";
import { StatusPill } from "@/components/status-pill";
import { pageMeta } from "@/lib/seo";
import styles from "./products.module.css";

export const metadata = pageMeta(`Products | ${site.name}`, site.productsSection.indexIntro);

export default function ProductsPage() {
  const products = publishedProducts();

  return (
    <Section>
      <Container>
        <header className={styles.intro}>
          <h1 tabIndex={-1} data-reveal="">
            {site.productsSection.indexTitle}
          </h1>
          <p className="lede" data-reveal="" data-stagger="1">
            {site.productsSection.indexIntro}
          </p>
        </header>
        <ul className={styles.grid}>
          {products.map((product, index) => (
            <li key={product.slug} data-reveal="" data-stagger={index}>
              <Link href={`/products/${product.slug}`} className={styles.card}>
                <div className={styles.visual} aria-hidden="true" style={{ viewTransitionName: `vt-${product.slug}` } as CSSProperties}>
                  <div className="scroll-shift" data-scroll-progress="">
                    <ProductVisual art={product.art} />
                  </div>
                </div>
                <StatusPill status={product.status} />
                <h2>{product.name}</h2>
                <p className={styles.tagline}>{product.tagline}</p>
                <span className="chevron-link">
                  <ProductLinkText name={product.name} />
                  <Icon name="chevron" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
