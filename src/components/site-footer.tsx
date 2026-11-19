import Link from "next/link";
import { publishedProducts } from "@content/products";
import { site } from "@content/site";
import { Logo } from "@/components/logo";
import { Container } from "@/components/section";
import { SocialIcon } from "@/components/social-icon";
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
            <ul className={styles.social}>
              {site.social.map((item) => (
                <li key={item.id}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.aria}>
                    <SocialIcon name={item.icon} />
                    {item.mark ? <span className={styles.mark}>{item.mark}</span> : null}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.columns}>
            <nav aria-label={site.footer.products}>
              <p className="caption">{site.footer.products}</p>
              {products.map((product) => (
                <Link key={product.slug} className="line-link" href={`/products/${product.slug}`}>
                  {product.name}
                </Link>
              ))}
            </nav>
            <nav aria-label={site.footer.company}>
              <p className="caption">{site.footer.company}</p>
              <Link className="line-link" href="/company">
                {site.nav.company}
              </Link>
              <Link className="line-link" href="/#approach">
                {site.nav.approach}
              </Link>
              <Link className="line-link" href="/contact">
                {site.nav.contact}
              </Link>
            </nav>
          </div>
        </div>
        <p className={styles.legal}>
          <span>
            © {year} {site.name}. {site.footer.rights}
          </span>
          <span>{site.contact.place}</span>
        </p>
      </Container>
    </footer>
  );
}
