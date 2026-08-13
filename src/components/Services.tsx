import Link from "next/link";
import ImageSlot from "./ImageSlot";
import { ArrowRight } from "./Icons";
import { services } from "@/lib/site";
import styles from "./Services.module.css";

export default function Services() {
  return (
    <section id="services" className="container section">
      <div className={styles.head}>
        <div>
          <span className="eyebrow">Our services</span>
          {/*
            Was "Six ways we make a property feel new", which went stale the
            moment a seventh service was added and carried none of the terms this
            section is trying to rank for. Count-free and keyword-bearing.
          */}
          <h2 className={styles.title}>
            Specialist floor cleaning &amp; restoration
          </h2>
        </div>
        <p className={`lede ${styles.headNote}`}>
          Not sure what you need? Send a photo on WhatsApp and we’ll tell you the
          right fix — no pressure, no jargon.
        </p>
      </div>

      <div className={styles.grid}>
        {services.map((service) => (
          <Link
            key={service.slug}
            href={`/services/${service.slug}`}
            className={styles.card}
          >
            <div className={styles.media}>
              <ImageSlot
                src={service.image}
                alt={service.title}
                label={service.imageLabel}
                sizes="(min-width: 940px) 33vw, 100vw"
              />
            </div>
            <div className={styles.body}>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardBlurb}>{service.blurb}</p>
              {/*
                The whole card is a link to the service's own page, but nothing
                on it said so — the styles for this row already existed and were
                never rendered. `margin-top: auto` pins it to the bottom, so the
                row lines up across cards whose blurbs are different lengths.
              */}
              <span className={styles.explore}>
                See the full process
                <ArrowRight size={15} className={styles.exploreArrow} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
