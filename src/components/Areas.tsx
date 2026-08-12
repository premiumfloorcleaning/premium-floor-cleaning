import Link from "next/link";
import CoverageMap from "./CoverageMap";
import { ArrowRight, Check, Pin } from "./Icons";
import { serviceAreas, waAreaLink } from "@/lib/site";
import styles from "./Areas.module.css";

/** Claims already made elsewhere on the site — restated here as the coverage promise. */
const PROMISES = [
  "Free on-site quote in every region",
  "Same fixed pricing, wherever you are",
  "7 days a week, weekends included",
];

export default function Areas() {
  return (
    <section id="areas" className="container section">
      <div className={styles.head}>
        <div>
          <span className="eyebrow">Areas we cover</span>
          <h2 className={styles.title}>Five regions across South East QLD</h2>
        </div>
        <p className={`lede ${styles.headNote}`}>
          Same team, same fixed pricing, same free on-site quote — whether you are
          in the city, up the coast or out west.
        </p>
      </div>

      <div className={styles.grid}>
        <CoverageMap />

        {/*
          Unordered: the embedded map carries one marker, not five numbered pins,
          so numbering these rows would imply a correspondence that isn't there.
        */}
        <div className={styles.body}>
          <ul className={styles.list}>
            {serviceAreas.map((area) => (
              <li key={area.slug}>
                {/*
                  The whole row is the link to the region's page — that page is
                  what ranks for "<service> <region>" searches, so every route to
                  it counts.
                */}
                <Link href={`/areas/${area.slug}`} className={styles.item}>
                  <span className={styles.pin} aria-hidden="true">
                    <Pin size={15} />
                  </span>
                  <div className={styles.itemBody}>
                    <h3 className={styles.itemTitle}>
                      {area.name}
                      {area.note ? (
                        <span className={styles.note}>{area.note}</span>
                      ) : null}
                    </h3>
                    <p className={styles.suburbs}>
                      {area.suburbs.join(" · ")} and surrounding suburbs
                    </p>
                  </div>
                  <ArrowRight size={16} className={styles.itemArrow} />
                </Link>
              </li>
            ))}
          </ul>

          <div className={styles.promises}>
            {PROMISES.map((promise) => (
              <span key={promise} className={styles.promise}>
                <Check size={14} className={styles.promiseIcon} />
                {promise}
              </span>
            ))}
          </div>

          <p className={styles.footnote}>
            Not sure if your suburb is in range?{" "}
            <a
              href={waAreaLink}
              target="_blank"
              rel="noopener"
              className={styles.footnoteLink}
            >
              Send it to us on WhatsApp
              <ArrowRight size={14} />
            </a>{" "}
            and we’ll confirm before you book.
          </p>
        </div>
      </div>
    </section>
  );
}
