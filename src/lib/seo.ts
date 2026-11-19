import type { Metadata } from "next";
import { xHandle } from "@content/site";

export function pageMeta(title: string, description: string): Metadata {
  const handle = xHandle();
  return {
    title: { absolute: title },
    description,
    openGraph: { title, description },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: handle,
      creator: handle,
    },
  };
}
