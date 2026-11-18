import Link from "next/link";
import { site } from "@content/site";
import { Arrow } from "@/components/arrow";
import { ArtExploded } from "@/components/art";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(site.notFound.title, site.notFound.text);

export default function NotFound() {
  return (
    <section className="section page-top miss">
      <div className="container narrow">
        <ArtExploded mode="animated" />
        <h1 className="display" tabIndex={-1}>{site.notFound.title}</h1>
        <p className="lede">{site.notFound.text}</p>
        <Link className="btn" href="/">
          {site.notFound.home}
          <Arrow />
        </Link>
      </div>
    </section>
  );
}
