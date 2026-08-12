import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ImageSlot from "@/components/ImageSlot";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import StickyActions from "@/components/StickyActions";
import { ArrowRight, Phone, WhatsApp } from "@/components/Icons";
import {
  serviceAreas,
  serviceAreaSentence,
  services,
  site,
  waQuoteLink,
} from "@/lib/site";
import styles from "./page.module.css";

/**
 * Destination for the home page's service cards. The Claude Design project has
 * a separate "Service Pages" file — until that is imported, this renders the
 * service's own copy from the home page plus the standard contact actions, so
 * no card links into a dead end.
 */

type Params = { slug: string };

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
  return {
    title: service.title,
    description: `${service.blurb} Available across ${serviceAreaSentence}.`,
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

  return (
    <div id="top">
      <SiteHeader />
      <main>
        <section className="container section">
          <Link href="/#services" className={styles.back}>
            ← All services
          </Link>

          <div className={styles.head}>
            <div>
              <span className="eyebrow">Our services</span>
              <h1 className={styles.title}>{service.title}</h1>
              <p className={styles.blurb}>{service.blurb}</p>
              <div className={styles.areas}>
                {serviceAreas.map((area) => (
                  <span key={area.name} className="tag">
                    {area.name}
                  </span>
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
                Available across {serviceAreaSentence}. Not sure this is the right
                fix?{" "}
                <a href={waQuoteLink} target="_blank" rel="noopener">
                  Send a photo on WhatsApp
                </a>{" "}
                and we’ll tell you.
              </p>
            </div>

            <div className={styles.media}>
              <ImageSlot
                src={service.image}
                alt={service.title}
                label={service.imageLabel}
                priority
                sizes="(min-width: 940px) 50vw, 100vw"
              />
            </div>
          </div>
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
