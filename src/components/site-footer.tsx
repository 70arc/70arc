import Image from "next/image";
import Link from "next/link";
import { publishedProducts } from "@content/products";
import { site } from "@content/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const products = publishedProducts();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-brand">
          <Link href="/" aria-label={site.nav.home}>
            <Image src="/brand/logo-nav.png" alt="" width={72} height={72} />
          </Link>
          <p>{site.footer.tagline}</p>
        </div>
        <div className="footer-columns">
          <nav aria-label={site.footer.products}>
            <p className="label">{site.footer.products}</p>
            {products.map((product) => (
              <Link key={product.slug} href={`/products/${product.slug}`}>{product.name}</Link>
            ))}
          </nav>
          <nav aria-label={site.footer.company}>
            <p className="label">{site.footer.company}</p>
            <Link href="/company">{site.nav.company}</Link>
            <Link href="/#approach">{site.nav.approach}</Link>
          </nav>
        </div>
        <p className="footer-legal">© {year} {site.name}. {site.footer.rights}</p>
      </div>
    </footer>
  );
}
