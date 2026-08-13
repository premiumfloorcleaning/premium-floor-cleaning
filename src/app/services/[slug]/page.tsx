import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ImageSlot from "@/components/ImageSlot";
import JsonLd from "@/components/JsonLd";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import StickyActions from "@/components/StickyActions";
import { ArrowRight, Check, Phone, Pin, WhatsApp } from "@/components/Icons";
import { SOCIAL_CARD_SIZE, socialCard } from "@/lib/media";
import {
  breadcrumbNode,
  graph,
  serviceNode,
  webPageNode,
} from "@/lib/seo";
import {
  serviceAreaSentence,
  serviceAreas,
  services,
  site,
  waQuoteLink,
} from "@/lib/site";
import styles from "./page.module.css";

type Params = { slug: string };

/**
 * Spelled-out counts read better than numerals in a sentence. Only the lengths a
 * `process` list realistically runs to are listed; anything else falls back to
 * the numeral, which is plainer but never wrong.
 */
const STEP_COUNT_WORDS: Record<number, string> = {
  3: "Three",
  4: "Four",
  5: "Five",
  6: "Six",
  7: "Seven",
  8: "Eight",
};

export function generateStaticParams(): Params[] {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) return {};

  const path = `/services/${service.slug}`;
  const card = socialCard(service.imagePath);

  return {
    // Absolute, so the long location-bearing title is not squeezed by the
    // site-wide template. This is the string that competes in the result list.
    title: { absolute: service.metaTitle },
    description: service.metaDescription,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: service.metaTitle,
      description: service.metaDescription,
      images: [{ url: card, ...SOCIAL_CARD_SIZE, alt: service.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: service.metaTitle,
      description: service.metaDescription,
      images: [card],
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();

  const others = services.filter((item) => item.slug !== slug);
  const path = `/services/${service.slug}`;

  const structuredData = graph([
    webPageNode({
      path,
      name: service.metaTitle,
      description: service.metaDescription,
    }),
    serviceNode(service),
    breadcrumbNode([
      { name: "Home", path: "/" },
      { name: "Services", path: "/#services" },
      { name: service.title, path },
    ]),
  ]);

  return (
    <div id="top">
      <JsonLd data={structuredData} />
      <SiteHeader />
      <main>
        <section className="container section">
          {/* Visible counterpart to the BreadcrumbList in the structured data. */}
          <nav aria-label="Breadcrumb" className={styles.crumbs}>
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/#services">Services</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{service.title}</span>
          </nav>

          <div className={styles.head}>
            <div>
              <span className="eyebrow">Our services</span>
              <h1 className={styles.title}>{service.h1 ?? service.title}</h1>
              <p className={styles.blurb}>{service.blurb}</p>
              <div className={styles.areas}>
                {serviceAreas.map((area) => (
                  <Link
                    key={area.slug}
                    href={`/areas/${area.slug}`}
                    className={styles.areaTag}
                  >
                    <Pin size={13} />
                    {area.name}
                  </Link>
                ))}
              </div>
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
              <p className={styles.note}>
                Not sure this is the right fix?{" "}
                <a href={waQuoteLink} target="_blank" rel="noopener">
                  Send a photo on WhatsApp
                </a>{" "}
                and we’ll tell you.
              </p>
            </div>

            <div className={styles.media}>
              <ImageSlot
                src={service.image}
                alt={`${service.title} — finished result`}
                label={service.imageLabel}
                priority
                sizes="(min-width: 940px) 50vw, 100vw"
              />
            </div>
          </div>
        </section>

        <section className="container section">
          <div className={styles.detail}>
            <div className={styles.copy}>
              <h2 className={styles.copyTitle}>
                What {service.title.toLowerCase()} actually involves
              </h2>
              {service.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className={styles.paragraph}>
                  {paragraph}
                </p>
              ))}
              <p className={styles.paragraph}>
                Available across {serviceAreaSentence}, seven days a week,{" "}
                {site.hoursShort}.
              </p>
            </div>

            <aside className={styles.includes}>
              <h2 className={styles.includesTitle}>What’s included</h2>
              <ul className={styles.includesList}>
                {service.includes.map((item) => (
                  <li key={item} className={styles.includesItem}>
                    <Check size={14} className={styles.includesIcon} />
                    {item}
                  </li>
                ))}
              </ul>
              <p className={styles.aka}>
                Also searched as: {service.alsoKnownAs.join(", ")}.
              </p>
            </aside>
          </div>
        </section>

        {/*
          What actually happens on the day. The checklist above says what you
          get; this says the order it happens in, which is the part a quote cannot
          show anyone in advance. Deliberately plain — a customer reading this is
          deciding whether to call, not comparing methods.

          The count is read off the array rather than written into the sentence:
          most services run to five steps, but strip & seal genuinely takes seven
          and the copy used to say "Five steps" regardless.
        */}
        <section className="container section">
          <span className="eyebrow">How the job runs</span>
          <h2 className={`sectionTitle ${styles.processHead}`}>
            What happens on the day
          </h2>
          <p className={styles.processNote}>
            {STEP_COUNT_WORDS[service.process.length] ?? service.process.length}{" "}
            steps, start to finish. Same either way — home or commercial.
          </p>

          <ol className={styles.processGrid}>
            {service.process.map((step) => (
              <li key={step.title} className={styles.processStep}>
                <h3 className={styles.processStepTitle}>{step.title}</h3>
                <p className={styles.processStepBody}>{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="container section">
          <h2 className="sectionTitle">Other services</h2>
          <div className={styles.grid}>
            {others.map((other) => (
              <Link
                key={other.slug}
                href={`/services/${other.slug}`}
                className={styles.card}
              >
                <h3 className={styles.cardTitle}>{other.title}</h3>
                <span className={styles.cardArrow}>
                  <ArrowRight size={15} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="container section">
          <a
            href={waQuoteLink}
            target="_blank"
            rel="noopener"
            className={styles.whatsapp}
          >
            <WhatsApp size={24} />
            Chat on WhatsApp
            <ArrowRight size={18} className={styles.whatsappArrow} />
          </a>
        </section>
      </main>
      <SiteFooter />
      <StickyActions />
    </div>
  );
}
