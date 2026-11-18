import { site } from "@content/site";
import { LinkButton } from "@/components/button";
import { pageMeta } from "@/lib/seo";
import styles from "./not-found.module.css";

export const metadata = pageMeta(site.notFound.title, site.notFound.text);

export default function NotFound() {
  return (
    <section className={styles.page}>
      <div className={styles.inner}>
        <h1 tabIndex={-1}>{site.notFound.title}</h1>
        <p className="lede">{site.notFound.text}</p>
        <LinkButton href="/">{site.notFound.home}</LinkButton>
      </div>
    </section>
  );
}
