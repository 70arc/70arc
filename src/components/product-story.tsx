"use client";

import { useEffect, useRef, useState } from "react";
import { publishedProducts } from "@content/products";
import { site } from "@content/site";
import { LinkButton } from "@/components/button";
import { ProductVisual } from "@/components/product-visual";
import { Container, Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { StatusPill } from "@/components/status-pill";
import styles from "./product-story.module.css";

export function ProductStory() {
  const products = publishedProducts();
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const steps = Array.from(list.querySelectorAll<HTMLElement>("[data-story-step]"));
    const ratios = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) ratios.set(entry.target, entry.intersectionRatio);
        let best = 0;
        let bestRatio = 0;
        steps.forEach((step, index) => {
          const ratio = ratios.get(step) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = index;
          }
        });
        if (bestRatio > 0) setActive((current) => (current === best ? current : best));
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    for (const step of steps) observer.observe(step);
    return () => observer.disconnect();
  }, []);

  return (
    <Section labelledBy="products-title">
      <Container>
        <SectionHeading
          id="products"
          titleId="products-title"
          eyebrow={site.productsSection.eyebrow}
          title={site.productsSection.title}
          lede={site.productsSection.subhead}
        />
        <div className={styles.story}>
          <div className={styles.stage} aria-hidden="true">
            {products.map((product, index) => (
              <div key={product.slug} className={styles.stageVisual} data-on={index === active ? "true" : "false"}>
                <ProductVisual art={product.art} />
              </div>
            ))}
          </div>
          <ol ref={listRef} className={styles.steps}>
            {products.map((product) => {
              const href = product.url ?? `/products/${product.slug}`;
              const label = product.url ? site.productsSection.visit : site.productsSection.learnMore;
              return (
                <li key={product.slug} className={styles.step} data-story-step="">
                  <div className={styles.panelVisual} aria-hidden="true">
                    <ProductVisual art={product.art} />
                  </div>
                  <StatusPill status={product.status} />
                  <h3>{product.name}</h3>
                  <p className={`lede ${styles.tagline}`}>{product.tagline}</p>
                  <p className={styles.summary}>{product.summary}</p>
                  <LinkButton href={href} variant="text">
                    {label}
                  </LinkButton>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
