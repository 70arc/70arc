export const productStatuses = ["Coming soon", "In development", "Beta", "Live"] as const;
export const productArts = ["stack", "grid", "exploded"] as const;

export type ProductStatus = (typeof productStatuses)[number];
export type ProductArt = (typeof productArts)[number];

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  status: ProductStatus;
  summary: string;
  art: ProductArt;
  url?: string;
  published: boolean;
};

const summary = "Details about this product will be shared here.";

export const products: Product[] = [
  // PLACEHOLDER: replace with a real product
  {
    slug: "product-one",
    name: "Product One",
    tagline: "Details coming soon.",
    status: "Coming soon",
    summary,
    art: "stack",
    published: true,
  },
  // PLACEHOLDER: replace with a real product
  {
    slug: "product-two",
    name: "Product Two",
    tagline: "Details coming soon.",
    status: "Coming soon",
    summary,
    art: "grid",
    published: true,
  },
  // PLACEHOLDER: replace with a real product
  {
    slug: "product-three",
    name: "Product Three",
    tagline: "Details coming soon.",
    status: "Coming soon",
    summary,
    art: "exploded",
    published: true,
  },
];

export function publishedProducts() {
  return products.filter((product) => product.published);
}

export function productBySlug(slug: string) {
  return publishedProducts().find((product) => product.slug === slug);
}
