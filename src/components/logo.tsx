import Image from "next/image";
import Link from "next/link";
import { site } from "@content/site";
import styles from "./logo.module.css";

export function Logo({ priority = false, current = false }: { priority?: boolean; current?: boolean }) {
  return (
    <Link href="/" className={styles.logo} aria-label={site.nav.home} aria-current={current ? "page" : undefined}>
      <Image className={styles.mark} src="/brand/logo-nav.png" alt="" width={28} height={28} priority={priority} />
      <span>{site.name}</span>
    </Link>
  );
}
