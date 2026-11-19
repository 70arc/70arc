import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Announcement } from "@/components/announcement";
import { MotionRoot } from "@/components/motion-root";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { announcementKey, site, xHandle } from "@content/site";
import "./globals.css";
// Page CSS is part of the root layout stylesheet. A separate route chunk is
// preloaded on pages that do not render it (contact, not-found) and Chrome warns.
import "@/app/company/company.module.css";
import "@/app/products/products.module.css";
import "@/app/products/[slug]/product.module.css";
import "@/components/approach.module.css";
import "@/components/closing-cta.module.css";
import "@/components/home-hero.module.css";
import "@/components/mission-statement.module.css";
import "@/components/principles.module.css";
import "@/components/product-story.module.css";
import "@/components/product-visual.module.css";
import "@/components/section-heading.module.css";
import "@/components/values-section.module.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
  variable: "--font-inter",
  fallback: ["Segoe UI", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: { absolute: site.title },
  description: site.description,
  icons: {
    icon: [
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/brand/apple-touch-180.png",
  },
  openGraph: {
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    site: xHandle(),
    creator: xHandle(),
    title: site.title,
    description: site.description,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  description: site.description,
  logo: "/brand/logo-transparent.png",
  sameAs: site.social.map((item) => item.href),
  address: {
    "@type": "PostalAddress",
    addressCountry: site.contact.countryCode,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta property="og:image" content="/og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={site.name} />
        <meta name="twitter:image" content="/og.jpg" />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("${announcementKey}")==="dismissed")document.documentElement.dataset.announcement="off";if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.motion="on"}catch(e){}`,
          }}
        />
        <a className="skip-link" href="#content">
          {site.skip}
        </a>
        <Announcement />
        <SiteHeader />
        <MotionRoot />
        <main id="content" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
