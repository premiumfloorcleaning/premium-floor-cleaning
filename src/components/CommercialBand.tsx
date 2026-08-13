import Link from "next/link";
import ImageSlot from "./ImageSlot";
import { ArrowRight, Clock } from "./Icons";
import { SECTOR_ICONS } from "./sectorIcons";
import { media } from "@/lib/media";
import { commercialSectors } from "@/lib/site";
import styles from "./CommercialBand.module.css";

/**
 * The home page's route into /commercial.
 *
 * Before this existed, the commercial hub was reachable only from the header nav
 * and the footer — so the largest page on the site, aimed at the highest-value
 * buyer, was invisible to anyone who landed on the home page and scrolled. That
 * is the gap this closes.
 *
 * It sits directly after the services grid on purpose: the visitor has just seen
 * what we do, and this is the answer to "who do you do it for". The sectors and
 * their glyphs come from the same sources the hub page uses, so the two can never
 * show a different set of industries.
 */
export default function CommercialBand() {
  return (
    <section className="container section">
      <div className={styles.panel}>
        <div className={styles.media}>
          {/* Framed rather than bled to the panel edge — a collage has its own
              internal edges, and running it to the corner fights them. */}
          <div className={styles.mediaFrame}>
            <ImageSlot
              src={media.commercial.collage}
              alt="Commercial floor cleaning jobs: office, corridor and warehouse floors"
              label="Commercial floor cleaning"
              sizes="(min-width: 940px) 42vw, 90vw"
            />
          </div>
        </div>

        <div className={styles.body}>
          <span className="eyebrow">Commercial</span>
          <h2 className={styles.title}>
            Most of our work is in working buildings
          </h2>
          <p className={styles.copy}>
            Commercial floors carry a sealed finish with a service life. Once
            traffic cuts through it, cleaning stops working and the floor needs
            stripping and resealing instead — which costs a fraction of replacing
            it.
          </p>

          <ul className={styles.sectors}>
            {commercialSectors.map((sector) => {
              const Glyph = SECTOR_ICONS[sector.icon];
              return (
                <li key={sector.name} className={styles.sector}>
                  <span className={styles.sectorGlyph}>
                    <Glyph size={17} />
                  </span>
                  {sector.name}
                </li>
              );
            })}
          </ul>

          <div className={styles.foot}>
            <p className={styles.scheduling}>
              <Clock size={15} className={styles.schedulingIcon} />
              Overnight, weekends and shutdown periods — so the site is never out
              of use during trading hours
            </p>

            <Link href="/commercial" className="btn btnDark">
              See commercial floor cleaning
              <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
