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
import JsonLd from "@/components/JsonLd";
import { faqNode, graph, webPageNode } from "@/lib/seo";
import { serviceAreaSentence } from "@/lib/site";

/*
  The business and website nodes are emitted once in the root layout. This page
  adds only what is specific to it: the page itself and its FAQ block. The FAQs
  used to hang off the LocalBusiness node as `mainEntity`, which is not a shape
  Google recognises for FAQ rich results — they need their own FAQPage node.
*/
const structuredData = graph([
  webPageNode({
    path: "/",
    name: "Cleaning Services Brisbane, Gold Coast, Ipswich, Logan & Sunshine Coast",
    description: `Carpet, tile and grout, floor scrubbing, pressure washing, window cleaning and graffiti removal across ${serviceAreaSentence}.`,
  }),
  faqNode,
]);

export default function Home() {
  return (
    <div id="top">
      <JsonLd data={structuredData} />
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
