import Link from "next/link";
import { publishedProducts } from "@content/products";
import { site } from "@content/site";
import { Container } from "@/components/section";
import { Logo } from "@/components/logo";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const products = publishedProducts();

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Logo />
            <p>{site.footer.tagline}</p>
          </div>
          <div className={styles.columns}>
            <nav aria-label={site.footer.products}>
              <p className="caption">{site.footer.products}</p>
              {products.map((product) => (
                <Link key={product.slug} href={`/products/${product.slug}`}>
                  {product.name}
                </Link>
              ))}
            </nav>
            <nav aria-label={site.footer.company}>
              <p className="caption">{site.footer.company}</p>
              <Link href="/company">{site.nav.company}</Link>
              <Link href="/#approach">{site.nav.approach}</Link>
            </nav>
          </div>
        </div>
        <p className={styles.legal}>
          © {year} {site.name}. {site.footer.rights}
        </p>
      </Container>
    </footer>
  );
}
