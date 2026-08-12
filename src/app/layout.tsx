import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import { site } from "@/lib/site";
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

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default:
      "Floor, Carpet & Pressure Cleaning | Brisbane, Gold Coast, Ipswich, Logan & Sunshine Coast",
    template: `%s | ${site.name}`,
  },
  description:
    "Deep cleaning for the floors, carpets, tiles, driveways and windows that everyday cleaning can’t fix. Free on-site quote, fixed price before we start. Brisbane, Gold Coast, Ipswich, Logan and Sunshine Coast, 7 days.",
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: site.name,
    title:
      "Floor, Carpet & Pressure Cleaning | Brisbane, Gold Coast, Ipswich, Logan & Sunshine Coast",
    description:
      "Floor scrubbing, tile and grout, carpet steam cleaning, pressure washing, windows and graffiti removal across Brisbane, the Gold Coast, Ipswich, Logan and the Sunshine Coast.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
