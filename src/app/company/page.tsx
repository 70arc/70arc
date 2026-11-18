import { site } from "@content/site";
import { ValuesBlock } from "@/components/values-block";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(`${site.company.title.replace(".", "")} | ${site.name}`, site.company.body);

export default function CompanyPage() {
  return (
    <>
      <section className="section page-top">
        <div className="container narrow">
          <h1 className="display" tabIndex={-1}>{site.company.title}</h1>
          <p className="lede measure">{site.company.body}</p>
        </div>
      </section>
      <section className="section sunken">
        <div className="container">
          <ValuesBlock />
        </div>
      </section>
    </>
  );
}
