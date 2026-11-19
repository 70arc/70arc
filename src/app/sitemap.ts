import type { MetadataRoute } from "next";
import { publishedProducts } from "@content/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/products", "/company", "/contact", ...publishedProducts().map((product) => `/products/${product.slug}`)];
  return paths.map((url) => ({
    url,
    changeFrequency: "yearly",
    priority: url === "/" ? 1 : 0.7,
  }));
}
