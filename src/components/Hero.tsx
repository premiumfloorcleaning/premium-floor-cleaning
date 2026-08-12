import Image from "next/image";
import ImageSlot from "./ImageSlot";
import { ArrowRight, Star, WhatsApp } from "./Icons";
import { media } from "@/lib/media";
import { site, waQuoteLink } from "@/lib/site";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.section}>
      <div className={styles.stage}>
        <div className={styles.media}>
          <ImageSlot
            src={media.video.hero}
            label="Hero video — drop a still or a muted, looping 15–20s clip: scrubber passing over a floor, wet shine following it"
            fit="cover"
            tone="dark"
            priority
            sizes="100vw"
          />
        </div>
        <div className={styles.scrim} />

        <div className={styles.content}>
          <div>
            <span className={styles.availability}>
              <span className={styles.pulse} />
              Taking bookings this week
            </span>
            <h1 className={styles.title}>Floors that look brand new again</h1>
            <p className={styles.blurb}>
              Deep cleaning for the floors, carpets, tiles, driveways and windows
              that everyday cleaning can’t fix. Free on-site quote, fixed price
              before we start.
            </p>
            <div className={styles.ctas}>
              <a href="#contact" className="btn btnLight">
                Get my free quote
                <ArrowRight />
              </a>
              <a
                href={waQuoteLink}
                target="_blank"
                rel="noopener"
                className="btn btnGlass"
              >
                <WhatsApp />
                WhatsApp us
              </a>
            </div>
          </div>

          <aside className={styles.trustCard}>
            <div className={styles.trustRow}>
              <span className={styles.stars}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} />
                ))}
              </span>
              <span className={styles.trustStrong}>5-star rated on Google</span>
            </div>

            <div className={styles.rule} />

            <div className={styles.trustRow}>
              <Image
                src={media.brand.logoBadge}
                alt=""
                width={300}
                height={304}
                className={styles.trustBadge}
              />
              <span className={styles.trustText}>
                Servicing Brisbane, Gold Coast,
                <br />
                Ipswich, Logan &amp; Sunshine Coast
              </span>
            </div>

            <div className={styles.rule} />

            <div className={styles.stats}>
              <div>
                <p className={styles.statValue}>
                  Under 10<span className={styles.statUnit}> min</span>
                </p>
                <p className={styles.statLabel}>Average reply time</p>
              </div>
              <div>
                <p className={styles.statValue}>7 days</p>
                <p className={styles.statLabel}>{site.hoursShort}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
