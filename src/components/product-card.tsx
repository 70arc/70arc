import Link from "next/link";
import { site } from "@content/site";
import type { Product } from "@content/products";
import { Arrow } from "@/components/arrow";
import { ProductArt } from "@/components/art";

export function ProductCard({ product, heading = "h3" }: { product: Product; heading?: "h2" | "h3" }) {
  const href = product.url ?? `/products/${product.slug}`;
  const external = Boolean(product.url && /^https?:/i.test(product.url));
  const label = product.url ? site.productsSection.visit : site.productsSection.learnMore;
  const className = "text-link";
  const Title = heading;
  return (
    <article className="card">
      <div className="card-art">
        <ProductArt art={product.art} mode="static" />
      </div>
      <p className="pill">{product.status}</p>
      <Title>{product.name}</Title>
      <p className="card-copy">{product.tagline}</p>
      {external ? (
        <a className={className} href={href} target="_blank" rel="noopener noreferrer">
          {label}
          <span className="sr-only"> about {product.name}</span>
          <Arrow />
        </a>
      ) : (
        <Link className={className} href={href}>
          {label}
          <span className="sr-only"> about {product.name}</span>
          <Arrow />
        </Link>
      )}
    </article>
  );
}
