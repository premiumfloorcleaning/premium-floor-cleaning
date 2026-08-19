import Image from "next/image";
import Link from "next/link";
import ImageSlot from "./ImageSlot";
import { ArrowRight, GoogleG, Star, WhatsApp } from "./Icons";
import { media } from "@/lib/media";
import { googleRating, heroHighlights, site, waQuoteLink } from "@/lib/site";
import styles from "./Hero.module.css";

export default function Hero() {
  const reviewWord = googleRating.count === 1 ? "review" : "reviews";

  return (
    <section className={styles.section}>
      <div className={styles.stage}>
        <div className={styles.media}>
          {/*
            The poster is what makes Largest Contentful Paint survivable here: a
            bare <video> has nothing to paint until enough of the file has
            buffered, and LCP is a ranking signal. The still loads in a fraction
            of the time and the clip fades in over it.
          */}
          <ImageSlot
            src={media.video.hero}
            poster={media.heroPoster}
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
            {/*
              The old H1 promised floors that "look brand new again", which is a
              result no cleaner can guarantee on a floor they have not seen — some
              wear, etching and staining is permanent. This one keeps the terms
              people actually search on (floor cleaning, surface care, the region)
              and drops the promise. "Restoration" is deliberately absent: it is
              not a service the business offers.
            */}
            <h1 className={styles.title}>
              Floor cleaning &amp; surface care across South East QLD
            </h1>
            <p className={styles.blurb}>
              Commercial and residential floors that everyday cleaning can’t fix —
              stripped, sealed and scrubbed back to an even finish. Free on-site
              quote, fixed price before we start.
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

            {/*
              Real links, not decoration. This is the highest-authority block on
              the highest-authority page, so the four terms the site is trying to
              win get a link from it — and it puts the specialist work in front of
              the visitor before they scroll.
            */}
            <div className={styles.highlights}>
              {heroHighlights.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={styles.highlight}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <aside className={styles.trustCard}>
            {/*
              Styled after the way Google itself presents a rating — white card,
              the four-colour G, the score, then the stars — because that is the
              form people already trust. A blue-star line reading "5-star rated on
              Google" looked like a claim the site was making about itself; this
              looks like the thing it is quoting.
            */}
            <div className={styles.googleCard}>
              <div className={styles.googleTop}>
                <GoogleG size={18} />
                <span className={styles.googleBrand}>Google Reviews</span>
              </div>

              <div className={styles.googleScore}>
                <span className={styles.googleValue}>{googleRating.value}</span>
                <span className={styles.googleStars}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={16} />
                  ))}
                </span>
              </div>

              <p className={styles.googleCount}>
                {/* Based on {googleRating.count} {reviewWord} */}
                {googleRating.url ? (
                  <>
                    {" · "}
                    <a
                      href={googleRating.url}
                      target="_blank"
                      rel="noopener"
                      className={styles.googleLink}
                    >
                      Read them
                    </a>
                  </>
                ) : null}
              </p>
            </div>

            <div className={styles.trustRow}>
              <Image
                src={media.brand.logoBadge}
                alt=""
                width={300}
                height={304}
                className={styles.trustBadge}
              />
              {/*
                No hard <br /> here: the card is 380px wide on desktop but full
                width on a phone and a third of a row on a tablet, so a fixed
                break lands in the wrong place at two of the three sizes.
              */}
              <span className={styles.trustText}>
                Servicing Brisbane, Gold Coast, Ipswich, Logan &amp; Sunshine
                Coast
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
