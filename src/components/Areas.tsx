import { ArrowRight, Pin } from "./Icons";
import { serviceAreas, waAreaLink } from "@/lib/site";
import styles from "./Areas.module.css";

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
        {serviceAreas.map((area) => (
          <div key={area.name} className={styles.card}>
            <div className={styles.cardHead}>
              <span className={`iconDot ${styles.cardIcon}`}>
                <Pin size={17} />
              </span>
              <h3 className={styles.cardTitle}>{area.name}</h3>
              {area.note ? (
                <span className={styles.note}>{area.note}</span>
              ) : null}
            </div>
            <p className={styles.suburbs}>
              {area.suburbs.join(" · ")} and surrounding suburbs
            </p>
          </div>
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
    </section>
  );
}
