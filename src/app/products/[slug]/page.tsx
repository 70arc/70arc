import Link from "next/link";
import { notFound } from "next/navigation";
import { productBySlug, publishedProducts } from "@content/products";
import { site } from "@content/site";
import { ProductArt } from "@/components/art";
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
    <section className="section page-top">
      <div className="container narrow">
        <Link className="text-link" href="/products">{site.productsSection.back}</Link>
        <p className="pill">{product.status}</p>
        <h1 className="display" tabIndex={-1}>{product.name}</h1>
        <p className="lede">{product.tagline}</p>
        <div className="product-art">
          <ProductArt art={product.art} mode="animated" />
        </div>
        <h2>{site.productsSection.overview}</h2>
        <p className="measure">{product.summary}</p>
      </div>
    </section>
  );
}
