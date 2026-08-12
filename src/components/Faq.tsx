import { ArrowRight } from "./Icons";
import { faqs, waQuestionLink } from "@/lib/site";
import styles from "./Faq.module.css";

export default function Faq() {
  return (
    <section id="faq" className="container section">
      <div className={styles.grid}>
        <div>
          <span className="eyebrow">FAQs</span>
          <h2 className={`sectionTitle ${styles.title}`}>Questions we get asked</h2>
          <p className={`lede ${styles.copy}`}>
            Still unsure? Message us and we’ll answer in plain English.
          </p>
          <a
            href={waQuestionLink}
            target="_blank"
            rel="noopener"
            className={styles.ask}
          >
            Ask on WhatsApp
            <ArrowRight size={15} />
          </a>
        </div>

        <div className={styles.list}>
          {faqs.map((faq) => (
            <details key={faq.q} className={styles.item}>
              <summary className={styles.summary}>
                <span className={styles.question}>{faq.q}</span>
                <span className={styles.marker} aria-hidden="true">
                  +
                </span>
              </summary>
              <p className={styles.answer}>{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
