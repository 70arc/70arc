import Link from "next/link";
import { publishedProducts } from "@content/products";
import { site } from "@content/site";
import { StatusPill } from "@/components/status-pill";
import { Container, Section } from "@/components/section";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(`Products | ${site.name}`, site.productsSection.indexIntro);

export default function ProductsPage() {
  return (
    <Section>
      <Container>
        <div className="stack">
          <h1 tabIndex={-1}>{site.productsSection.indexTitle}</h1>
          <p className="lede">{site.productsSection.indexIntro}</p>
          <ul className="stack">
            {publishedProducts().map((product) => (
              <li key={product.slug} className="stack">
                <StatusPill status={product.status} />
                <Link href={`/products/${product.slug}`}>{product.name}</Link>
                <p className="lede">{product.tagline}</p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
