import { steps } from "@/lib/site";
import styles from "./HowItWorks.module.css";

export default function HowItWorks() {
  return (
    <section className="container section">
      <span className="eyebrow">How it works</span>
      <h2 className={`sectionTitle ${styles.title}`}>Three steps, no surprises</h2>

      <div className={styles.grid}>
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          return (
            <div
              key={step.number}
              className={`${styles.card} ${isLast ? styles.cardDark : ""}`}
            >
              <span className={styles.number}>{step.number}</span>
              <h3 className={styles.cardTitle}>{step.title}</h3>
              <p className={styles.cardBody}>{step.body}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
