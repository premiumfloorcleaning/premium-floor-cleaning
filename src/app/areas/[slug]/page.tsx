import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ImageSlot from "@/components/ImageSlot";
import JsonLd from "@/components/JsonLd";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import StickyActions from "@/components/StickyActions";
import { ArrowRight, Check, Clock, Phone, WhatsApp } from "@/components/Icons";
import { SOCIAL_CARD_SIZE, socialCard } from "@/lib/media";
import {
  BUSINESS_ID,
  absolute,
  breadcrumbNode,
  graph,
  webPageNode,
} from "@/lib/seo";
import {
  findServiceArea,
  serviceAreas,
  services,
  site,
  waQuoteLink,
} from "@/lib/site";
import styles from "./page.module.css";

/**
 * One page per region. This is the single biggest on-page lever for local search:
 * someone typing "carpet cleaning gold coast" is served a page that is genuinely
 * about the Gold Coast, rather than a Brisbane page hoping to be relevant.
 *
 * Each region's copy is written for that region — see `intro` and `local` in
 * lib/site.ts. Five near-identical pages with the place name swapped would be a
 * doorway-page pattern, and Google demotes all of them together.
 */

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return serviceAreas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = findServiceArea(slug);
  if (!area) return {};

  const title = `Cleaning Services ${area.name} | Carpet, Tile, Pressure Washing & Windows`;
  const description = `Professional carpet, tile and grout, floor scrubbing, pressure washing, window cleaning and graffiti removal across ${area.name} — ${area.suburbs.slice(0, 3).join(", ")} and surrounding suburbs. Free on-site quote, fixed price, open 7 days.`;
  // The region's own photo, so a shared link previews that city rather than the
  // same floorboards for all five.
  const card = socialCard(area.imagePath);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/areas/${area.slug}` },
    openGraph: {
      type: "article",
      url: `/areas/${area.slug}`,
      title,
      description,
      images: [
        { url: card, ...SOCIAL_CARD_SIZE, alt: `Cleaning services in ${area.name}` },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [card],
    },
  };
}

export default async function AreaPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const area = findServiceArea(slug);
  if (!area) notFound();

  const others = serviceAreas.filter((item) => item.slug !== area.slug);
  const path = `/areas/${area.slug}`;
  const title = `Cleaning Services ${area.name} | Carpet, Tile, Pressure Washing & Windows`;
  const description = `Professional cleaning across ${area.name} — ${area.suburbs.join(", ")} and surrounding suburbs.`;

  const structuredData = graph([
    webPageNode({ path, name: title, description }),
    breadcrumbNode([
      { name: "Home", path: "/" },
      { name: "Areas we cover", path: "/#areas" },
      { name: area.name, path },
    ]),
    /*
      A Service node scoped to this one region, rather than a second LocalBusiness.
      Duplicating the business per page would create five competing entities for
      the same company, which is exactly what confuses local search.
    */
    {
      "@type": "Service",
      "@id": `${absolute(path)}#service`,
      name: `Cleaning services in ${area.name}`,
      description,
      provider: { "@id": BUSINESS_ID },
      areaServed: {
        "@type": "City",
        name: area.name,
        address: {
          "@type": "PostalAddress",
          addressRegion: site.address.region,
          addressCountry: site.address.country,
        },
        containsPlace: area.suburbs.map((suburb) => ({
          "@type": "Place",
          name: suburb,
        })),
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `Services available in ${area.name}`,
        itemListElement: services.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: `${service.title} ${area.name}`,
            url: absolute(`/services/${service.slug}`),
          },
        })),
      },
    },
  ]);

  return (
    <div id="top">
      <JsonLd data={structuredData} />
      <SiteHeader />
      <main>
        <section className="container section">
          <nav aria-label="Breadcrumb" className={styles.crumbs}>
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/#areas">Areas we cover</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{area.name}</span>
          </nav>

          <div className={styles.head}>
            <div>
              <span className="eyebrow">Areas we cover</span>
              <h1 className={styles.title}>
                Cleaning services in {area.name}
              </h1>
              <p className={styles.intro}>{area.intro}</p>

              <div className={styles.actions}>
                <Link href="/#contact" className="btn btnDark">
                  Get my free quote
                  <ArrowRight />
                </Link>
                <a href={site.phone.href} className={styles.call}>
                  <Phone size={17} />
                  {site.phone.display}
                </a>
              </div>

              <p className={styles.hours}>
                <Clock size={15} />
                {site.hours} — weekends included at no extra charge
              </p>
            </div>

            <div className={styles.media}>
              <ImageSlot
                src={area.image}
                alt={`${area.name}, one of the five South East QLD regions we cover`}
                label={`${area.name} photo`}
                priority
                sizes="(min-width: 940px) 46vw, 100vw"
              />
            </div>
          </div>
        </section>

        <section className="container section">
          <div className={styles.split}>
            <div>
              <h2 className={styles.h2}>
                What we get called out for in {area.name}
              </h2>
              <ul className={styles.localList}>
                {area.local.map((item) => (
                  <li key={item} className={styles.localItem}>
                    <Check size={14} className={styles.localIcon} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.suburbCard}>
              <h2 className={styles.suburbTitle}>Suburbs we cover</h2>
              <p className={styles.suburbList}>
                {area.suburbs.join(" · ")}
              </p>
              <p className={styles.suburbNote}>
                Plus every surrounding suburb in the {area.name} area. If yours
                isn’t listed,{" "}
                <a href={waQuoteLink} target="_blank" rel="noopener">
                  message us
                </a>{" "}
                and we’ll confirm before you book.
              </p>
            </div>
          </div>
        </section>

        <section className="container section">
          <h2 className={styles.h2}>Every service, available in {area.name}</h2>
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
                    sizes="(min-width: 940px) 33vw, 100vw"
                  />
                </div>
                <div className={styles.serviceBody}>
                  <h3 className={styles.serviceTitle}>
                    {service.title} <span>{area.name}</span>
                  </h3>
                  <p className={styles.serviceBlurb}>{service.blurb}</p>
                  <span className={styles.serviceExplore}>
                    See the full process
                    <ArrowRight size={14} className={styles.serviceExploreArrow} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="container section">
          <div className={styles.footRow}>
            <div>
              <h2 className={styles.h2}>Also covering</h2>
              <div className={styles.otherAreas}>
                {others.map((other) => (
                  <Link
                    key={other.slug}
                    href={`/areas/${other.slug}`}
                    className={styles.otherArea}
                  >
                    {other.name}
                    <ArrowRight size={14} />
                  </Link>
                ))}
              </div>
            </div>

            <a
              href={waQuoteLink}
              target="_blank"
              rel="noopener"
              className={styles.whatsapp}
            >
              <WhatsApp size={24} />
              <span>
                <span className={styles.whatsappTitle}>Chat on WhatsApp</span>
                <span className={styles.whatsappNote}>
                  Send a photo, get an estimate
                </span>
              </span>
              <ArrowRight size={18} className={styles.whatsappArrow} />
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
      <StickyActions />
    </div>
  );
}
