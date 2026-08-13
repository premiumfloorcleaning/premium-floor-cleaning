import Link from "next/link";
import ImageSlot from "./ImageSlot";
import { ArrowRight } from "./Icons";
import {
  serviceAreaSentence,
  serviceAreas,
  services,
  site,
} from "@/lib/site";
import styles from "./About.module.css";

/*
  Every figure here has to be checkable against something else on the site. The
  previous three — 98% satisfaction, 10+ years, a 5.0 Google rating — were none
  of them substantiated, and an unsupported performance claim is the business's
  exposure under Australian Consumer Law, not the website's.

  These are counted from the same arrays the pages are built from, so adding a
  region or a service updates the figure instead of leaving it to go stale.
*/
const stats = [
  { value: String(serviceAreas.length), label: "Regions covered" },
  { value: String(services.length), label: "Specialist services" },
  { value: "7 days", label: "Open, weekends included" },
];

export default function About() {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.panel}>
        <div className={styles.grid}>
          <div>
            <span className="eyebrow eyebrowOnDark">About us</span>
            <h2 className={`sectionTitle ${styles.title}`}>
              We don’t just clean floors. We restore them.
            </h2>
            <p className={styles.copy}>
              Premium Floor Cleaning Services works on floors for offices, medical
              centres, schools, warehouses, strata common areas and homes across{" "}
              {serviceAreaSentence}. Most of what we are called out for is a floor
              somebody assumed needed replacing — stripped back, resealed and
              handed over looking like the floor it was meant to be.
            </p>
            <p className={styles.copy}>
              We match the machine, the pad and the chemical to the floor in front
              of us rather than running one process over every surface. If a
              treatment will not get you the result you are picturing, we say so at
              the quote instead of after the invoice.
            </p>
            <Link href="/commercial" className={styles.commercialLink}>
              See our commercial work
              <ArrowRight size={15} className={styles.commercialArrow} />
            </Link>
            <div className={styles.stats}>
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className={styles.statValue}>{stat.value}</p>
                  <p className={styles.statLabel}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.media}>
            <div className={styles.photo}>
              <ImageSlot
                label="Team at work"
                tone="dark"
                sizes="(min-width: 940px) 45vw, 100vw"
              />
            </div>
            <div className={styles.notes}>
              <div className={styles.note}>
                <h4 className={styles.noteTitle}>Matched to your floor</h4>
                <p className={styles.noteBody}>
                  Tested on a hidden section before the whole floor is committed.
                </p>
              </div>
              <div className={styles.note}>
                <h4 className={styles.noteTitle}>Fast replies</h4>
                <p className={styles.noteBody}>
                  {site.replyTime} on average · {site.hoursShort}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
