import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import { SOCIAL_CARD_SIZE } from "@/lib/media";
import {
  businessNode,
  defaultSocialCard,
  graph,
  websiteNode,
} from "@/lib/seo";
import { serviceAreaSentence, site } from "@/lib/site";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

/*
  Brand first. The old title opened with "Cleaning Services Brisbane, …", which
  reads well in a search result but leaves a browser tab — and the Google result's
  own site name — showing a generic phrase with no clue whose business it is.
  The region keywords still follow it, so nothing is lost from the snippet.

  The favicon that sits next to this comes from src/app/icon.png (and
  apple-icon.png), which is the Next.js file convention. Without those the host's
  own default icon is served, which is where the Vercel mark was coming from.
*/
const TITLE =
  "Premium Floor Cleaning Services | Brisbane, Gold Coast & SE QLD";
const DESCRIPTION = `Carpet, tile and grout, floor scrubbing, pressure washing, window cleaning and graffiti removal across ${serviceAreaSentence}. Free on-site quote, fixed price before we start. Open 7 days, 7am–9pm.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: TITLE,
    template: `%s | ${site.shortName}`,
  },
  description: DESCRIPTION,
  applicationName: site.name,
  // Root canonical. Every route sets its own; without this the home page has none.
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: site.url,
    siteName: site.name,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: defaultSocialCard,
        ...SOCIAL_CARD_SIZE,
        alt: "Restored timber floorboards with a clean, reflective finish",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [defaultSocialCard],
  },
  /*
    Signals that matter for local search specifically: they let Google, Apple
    Maps and Bing tie the pages to a physical place rather than inferring it.
  */
  other: {
    "geo.region": `${site.address.country}-${site.address.region}`,
    "geo.placename": site.address.locality,
    "geo.position": `${site.geo.lat};${site.geo.lon}`,
    ICBM: `${site.geo.lat}, ${site.geo.lon}`,
  },
  formatDetection: { telephone: true, address: true },
  // Add the Search Console token here once the property is verified:
  // verification: { google: "<token>" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" className={`${display.variable} ${body.variable}`}>
      <body>
        {/*
          No manual <head>: the root layout should not define one. React hoists
          these link tags into the document head on its own, and JSON-LD is read
          by search engines wherever it sits in the document.
        */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        {/* One business + website description, shared by every page. */}
        <JsonLd data={graph([businessNode, websiteNode])} />
        {children}
      </body>
    </html>
  );
}
