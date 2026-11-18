import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import { Announcement } from "@/components/announcement";
import { MotionRoot } from "@/components/motion-root";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { motionVars } from "@/lib/motion";
import { site } from "@content/site";
import { announcementKey } from "@content/site";
import "./globals.css";

const display = Newsreader({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-display",
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: true,
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-body",
  fallback: ["Segoe UI", "sans-serif"],
  adjustFontFallback: true,
  preload: false,
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
    title: site.title,
    description: site.description,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  description: site.description,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} style={motionVars}>
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
        <a className="skip" href="#content">{site.skip}</a>
        <Announcement />
        <SiteHeader />
        <MotionRoot />
        <main id="content" tabIndex={-1}>{children}</main>
        <SiteFooter />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
