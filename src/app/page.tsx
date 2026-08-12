import About from "@/components/About";
import Areas from "@/components/Areas";
import BeforeAfter from "@/components/BeforeAfter";
import Contact from "@/components/Contact";
import CtaBanner from "@/components/CtaBanner";
import Faq from "@/components/Faq";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import ScrubBand from "@/components/ScrubBand";
import Services from "@/components/Services";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import StickyActions from "@/components/StickyActions";
import Ticker from "@/components/Ticker";
import { faqs, serviceAreas, site } from "@/lib/site";

const structuredData = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
  name: site.name,
  telephone: site.phone.e164,
  email: site.email,
  url: site.url,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    postalCode: site.address.postcode,
    addressCountry: site.address.country,
  },
  areaServed: serviceAreas.map((area) => ({
    "@type": "City",
    name: area.name,
    address: {
      "@type": "PostalAddress",
      addressRegion: "QLD",
      addressCountry: "AU",
    },
  })),
  openingHours: "Mo-Su 07:00-21:00",
  sameAs: [site.social.facebook, site.social.instagram],
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function Home() {
  return (
    <div id="top">
      <script
        type="application/ld+json"
        // Static, build-time content — no user input reaches this string.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SiteHeader />
      <main>
        <Hero />
        <Ticker />
        <Services />
        <BeforeAfter />
        <HowItWorks />
        <ScrubBand />
        <CtaBanner />
        <About />
        <Areas />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
      <StickyActions />
    </div>
  );
}
