import { publishedProducts } from "@content/products";
import { site } from "@content/site";
import { ProductCard } from "@/components/product-card";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(`Products | ${site.name}`, site.productsSection.indexIntro);

export default function ProductsPage() {
  return (
    <section className="section page-top">
      <div className="container">
        <h1 className="display" tabIndex={-1}>{site.productsSection.indexTitle}</h1>
        <p className="lede measure">{site.productsSection.indexIntro}</p>
        <div className="cards cards-large">
          {publishedProducts().map((product) => (
            <ProductCard key={product.slug} product={product} heading="h2" />
          ))}
        </div>
      </div>
    </section>
  );
}
