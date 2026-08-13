import type { Metadata } from "next";
import Link from "next/link";
import AutoReveal from "@/components/AutoReveal";
import ImageSlot from "@/components/ImageSlot";
import JsonLd from "@/components/JsonLd";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import StickyActions from "@/components/StickyActions";
import { ArrowRight, Check, Clock, Phone, Pin, WhatsApp } from "@/components/Icons";
import { SECTOR_ICONS } from "@/components/sectorIcons";
import { SOCIAL_CARD_SIZE, cloudinaryPaths, media, socialCard } from "@/lib/media";
import {
  BUSINESS_ID,
  absolute,
  breadcrumbNode,
  graph,
  webPageNode,
} from "@/lib/seo";
import {
  commercialDocumentation,
  commercialSectors,
  managedPropertyTypes,
  serviceAreaSentence,
  serviceAreas,
  services,
  site,
  waQuoteLink,
} from "@/lib/site";
import styles from "./page.module.css";

/**
 * The commercial hub.
 *
 * This is one page, not nine. A separate page per sector would be nine near-
 * identical documents competing with each other for the same handful of queries,
 * which is the cannibalisation pattern that suppresses all of them — so each
 * sector is a section here, and the long tail ("floor cleaning for medical
 * centres", "childcare floor sealing") is covered by that section's own copy.
 *
 * It deliberately does not duplicate the service pages. Anything about method
 * belongs on /services/*; this page is about what a building needs and when the
 * work can happen, which is the part a facility manager is actually deciding on.
 */

const PATH = "/commercial";
const TITLE = "Commercial Floor Cleaning Brisbane & South East QLD";
const DESCRIPTION =
  "Commercial floor cleaning for offices, medical centres, schools, retail, warehouses, gyms and strata across South East QLD. After-hours and weekend scheduling.";

const card = socialCard(cloudinaryPaths.commercialHero);

/**
 * The hero's proof row. Every figure is counted off the arrays the site is built
 * from, so none of them can quietly become untrue — the same rule the About
 * section's stats follow.
 */
const heroStats = [
  { value: String(commercialSectors.length), label: "Sectors we work in" },
  { value: String(services.length), label: "Specialist services" },
  { value: String(serviceAreas.length), label: "Regions covered" },
  { value: "7 days", label: "Incl. after hours" },
];

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "article",
    url: PATH,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: card,
        ...SOCIAL_CARD_SIZE,
        alt: "A worn office floor being machine cleaned",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [card],
  },
};

const structuredData = graph([
  webPageNode({ path: PATH, name: TITLE, description: DESCRIPTION }),
  breadcrumbNode([
    { name: "Home", path: "/" },
    { name: "Commercial", path: PATH },
  ]),
  /*
    One Service node for the commercial offering, with the sectors as its offer
    catalogue. The sectors are not separate Services: they are the same service
    delivered into different buildings, and modelling them as nine Services would
    claim nine offerings that do not exist.
  */
  {
    "@type": "Service",
    "@id": `${absolute(PATH)}#service`,
    name: "Commercial floor cleaning",
    description: DESCRIPTION,
    serviceType: "Commercial floor cleaning",
    url: absolute(PATH),
    image: card,
    provider: { "@id": BUSINESS_ID },
    areaServed: serviceAreas.map((area) => ({
      "@type": "City",
      name: area.name,
      address: {
        "@type": "PostalAddress",
        addressRegion: site.address.region,
        addressCountry: site.address.country,
      },
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Commercial sectors we service",
      itemListElement: commercialSectors.map((sector) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: `Floor cleaning for ${sector.name.toLowerCase()}`,
          description: sector.body,
        },
      })),
    },
  },
]);

export default function CommercialPage() {
  return (
    <div id="top">
      <JsonLd data={structuredData} />
      <SiteHeader />
      <main>
        <section className="container section">
          <nav aria-label="Breadcrumb" className={styles.crumbs}>
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Commercial</span>
          </nav>

          {/*
            A dark panel rather than a full-bleed band: it reads as strongly as a
            hero but stays inside the container, so it cannot collide with the
            sticky header the way a bleeding section can.
          */}
          <div className={styles.heroPanel}>
            <div className={styles.heroCopy}>
              <span className="eyebrow eyebrowOnDark">Commercial</span>
              <h1 className={styles.title}>
                Commercial floor cleaning across South East QLD
              </h1>
              <p className={styles.intro}>
                Floors in a working building do not fail the way floors at home
                do. They wear in lanes, they carry a sealed finish with a service
                life, and they can rarely be closed off when it suits the cleaner.
                We work to the building’s hours, not ours.
              </p>

              <div className={styles.actions}>
                <Link href="/#contact" className="btn btnLight">
                  Request a site assessment
                  <ArrowRight />
                </Link>
                <a
                  href={waQuoteLink}
                  target="_blank"
                  rel="noopener"
                  className="btn btnGlass"
                >
                  <WhatsApp />
                  Send a photo
                </a>
              </div>

              <p className={styles.hours}>
                <Clock size={15} />
                Overnight, weekend and shutdown scheduling available
              </p>

              <dl className={styles.heroStats}>
                {heroStats.map((stat) => (
                  <div key={stat.label} className={styles.heroStat}>
                    <dt className={styles.heroStatValue}>{stat.value}</dt>
                    <dd className={styles.heroStatLabel}>{stat.label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Framed rather than bled to the panel edge, matching the home
                page's commercial band — a collage has its own internal edges, and
                running it into the corner fights them. */}
            <div className={styles.heroMedia}>
              <div className={styles.heroMediaFrame}>
                <ImageSlot
                  src={media.commercial.collage}
                  alt="Commercial floor cleaning jobs: office, corridor and warehouse floors"
                  label="Commercial floor cleaning"
                  tone="dark"
                  priority
                  sizes="(min-width: 940px) 42vw, 90vw"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="container section">
          <div className={styles.whySplit}>
            <div>
              <span className="eyebrow">Why it is a different job</span>
              <h2 className={`sectionTitle ${styles.whyHead}`}>
                The floor is fine. The finish is what wore out.
              </h2>
              <p className={styles.paragraph}>
                Almost every hard floor in a commercial building is carrying a
                coating, and that coating is the part that wears — not the vinyl,
                tile or concrete beneath it. It is meant to. Sealer is
                sacrificial, and once traffic has cut through it the floor stops
                being cleanable: you are mopping a surface that has already gone,
                which is why a tired commercial floor looks no better the day
                after a clean. Recoating on a schedule costs a fraction of
                replacing the floor.
              </p>
              <p className={styles.paragraph}>
                The second difference is access. A domestic job can take as long
                as it takes; a clinic, a classroom or a trading floor cannot. That
                changes the method, not just the timing — coats have to be planned
                around cure times so the area is genuinely walkable when you
                reopen, and where a floor cannot be closed in one go we work it in
                sections across several visits instead of promising something we
                would have to rush.
              </p>
              <p className={styles.callout}>
                Comparing quotes? Ask each contractor how many coats they are
                allowing and how long between them. It is the fastest way to tell
                a real strip and seal from a mop and a gloss.
              </p>
            </div>

            <div className={styles.whyMedia}>
              <ImageSlot
                src={media.services.stripAndSeal}
                alt="A commercial floor part-way through a strip and seal"
                label="Strip & seal in progress"
                sizes="(min-width: 940px) 42vw, 100vw"
              />
            </div>
          </div>
        </section>

        {/*
          The single most persuasive thing on the page, and it is a real job of
          ours — the VCT corridor pair, the same shots the home page gallery uses.
          It sweeps on its own so it works without anyone touching it.
        */}
        <section className={`container section ${styles.proof}`}>
          <div className={styles.proofHead}>
            <div>
              <span className="eyebrow">Real commercial result</span>
              <h2 className={`sectionTitle ${styles.proofTitle}`}>
                A corridor nobody wanted to replace
              </h2>
            </div>
            <p className={`lede ${styles.proofNote}`}>
              Yellowed vinyl tile with black scuff marks through the traffic lane,
              stripped back and resealed. Same floor, same corridor — no new tile.
            </p>
          </div>

          <div className={styles.proofViewer}>
            <AutoReveal
              before={{
                src: media.results.vctHallwayBefore,
                alt: "Worn commercial corridor before the strip and seal: yellowed vinyl tile with black scuff marks",
              }}
              after={{
                src: media.results.vctHallwayAfter,
                alt: "The same corridor after the strip and seal, with an even reflective finish",
              }}
              sizes="(min-width: 940px) 70vw, 100vw"
            />
            <span className={`${styles.proofBadge} ${styles.proofBadgeBefore}`}>
              BEFORE
            </span>
            <span className={`${styles.proofBadge} ${styles.proofBadgeAfter}`}>
              AFTER
            </span>
          </div>
        </section>

        <section className="container section">
          <span className="eyebrow">Who we work for</span>
          <h2 className={`sectionTitle ${styles.sectorHead}`}>
            Buildings we clean floors in
          </h2>

          <div className={styles.sectorGrid}>
            {commercialSectors.map((sector) => {
              const Glyph = SECTOR_ICONS[sector.icon];
              return (
                <article key={sector.name} className={styles.sectorCard}>
                  <span className={styles.sectorGlyph}>
                    <Glyph size={22} />
                  </span>
                  <h3 className={styles.sectorName}>{sector.name}</h3>
                  <p className={styles.sectorBody}>{sector.body}</p>
                  <p className={styles.sectorConstraint}>
                    <Clock size={14} className={styles.sectorIcon} />
                    {sector.constraint}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="container section">
          <div className={styles.split}>
            <div>
              <span className="eyebrow">Property managers</span>
              <h2 className={styles.h2}>
                A floor-care contractor who turns up when they said they would
              </h2>
              <p className={styles.paragraph}>
                Managing multiple properties means the clean is rarely the hard
                part — the hard part is a contractor who answers, arrives on the
                day, and gives you something you can forward to an owner or a
                tenant. We photograph the work before and after as standard, and
                you get the written record without having to ask for it.
              </p>
              <ul className={styles.propertyList}>
                {managedPropertyTypes.map((type) => (
                  <li key={type} className={styles.propertyItem}>
                    <Check size={14} className={styles.propertyIcon} />
                    {type}
                  </li>
                ))}
              </ul>
            </div>

            <aside className={styles.docCard}>
              <span className={styles.docGlyph}>
                <Check size={18} />
              </span>
              <h2 className={styles.docTitle}>What we can put in writing</h2>
              <ul className={styles.docList}>
                {commercialDocumentation.map((item) => (
                  <li key={item} className={styles.docItem}>
                    <Check size={14} className={styles.docIcon} />
                    {item}
                  </li>
                ))}
              </ul>
              <p className={styles.docNote}>
                Tell us what your building or committee needs to see before we
                attend, and we will confirm what we can provide before you book.
              </p>
            </aside>
          </div>
        </section>

        <section className="container section">
          <h2 className={styles.h2}>Every service, available commercially</h2>
          <div className={styles.serviceGrid}>
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className={styles.serviceCard}
              >
                <div className={styles.serviceMedia}>
                  <ImageSlot
                    src={service.image}
                    alt={service.title}
                    label={service.imageLabel}
                    sizes="(min-width: 940px) 25vw, 50vw"
                  />
                </div>
                <div className={styles.serviceBody}>
                  <h3 className={styles.serviceTitle}>{service.title}</h3>
                  <p className={styles.serviceBlurb}>{service.blurb}</p>
                  <span className={styles.serviceExplore}>
                    See the full process
                    <ArrowRight size={14} className={styles.serviceArrow} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="container section">
          <h2 className={styles.h2}>
            Commercial work across {serviceAreaSentence}
          </h2>
          <div className={styles.areaGrid}>
            {serviceAreas.map((area) => (
              <Link
                key={area.slug}
                href={`/areas/${area.slug}`}
                className={styles.areaCard}
              >
                <div className={styles.areaMedia}>
                  <ImageSlot
                    src={area.image}
                    alt={area.name}
                    label={area.name}
                    tone="dark"
                    sizes="(min-width: 940px) 20vw, 50vw"
                  />
                </div>
                <span className={styles.areaLabel}>
                  <Pin size={13} />
                  {area.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="container section">
          <div className={styles.ctaPanel}>
            <div>
              <h2 className={styles.ctaTitle}>
                Send us a photo of the floor and we will tell you what it needs.
              </h2>
              <p className={styles.ctaNote}>
                Free on-site assessment for commercial sites across{" "}
                {serviceAreaSentence}.
              </p>
            </div>
            <div className={styles.ctaActions}>
              <Link href="/#contact" className="btn btnLight">
                Request an assessment
                <ArrowRight />
              </Link>
              <a href={site.phone.href} className={styles.ctaCall}>
                <Phone size={17} />
                {site.phone.display}
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <StickyActions />
    </div>
  );
}
