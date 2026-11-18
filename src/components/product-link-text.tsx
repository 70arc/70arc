import { site } from "@content/site";

export function ProductLinkText({ name, external = false }: { name: string; external?: boolean }) {
  return (
    <>
      {external ? site.productsSection.visit : site.productsSection.learnMore}
      {external ? null : (
        <span className="sr-only">
          {" "}
          {site.productsSection.learnMoreAbout} {name}
        </span>
      )}
    </>
  );
}
