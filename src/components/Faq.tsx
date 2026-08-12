import { ArrowRight, WhatsApp } from "./Icons";
import { faqs, waQuestionLink } from "@/lib/site";
import styles from "./Faq.module.css";

export default function Faq() {
  return (
    <section id="faq" className="container section">
      {/*
        The intro used to sit in its own column beside the questions, which left
        the list stacked in roughly half the page width — fourteen questions deep.
        Moving it into a header row frees the full width for two columns below.
      */}
      <div className={styles.head}>
        <div>
          <span className="eyebrow">FAQs</span>
          <h2 className={`sectionTitle ${styles.title}`}>
            Questions we get asked
          </h2>
        </div>
        <div className={styles.headSide}>
          <p className={`lede ${styles.copy}`}>
            Still unsure? Message us and we’ll answer in plain English.
          </p>
          <a
            href={waQuestionLink}
            target="_blank"
            rel="noopener"
            className={styles.ask}
          >
            <WhatsApp size={17} />
            Ask on WhatsApp
            <ArrowRight size={15} />
          </a>
        </div>
      </div>

      <div className={styles.list}>
        {faqs.map((faq) => (
          /*
            A shared `name` makes these an exclusive accordion natively: opening
            one closes the rest, so the section cannot grow without bound as a
            visitor works through it. Browsers without support simply allow more
            than one open at a time, which is a fine fallback.
          */
          <details key={faq.q} name="faq" className={styles.item}>
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
    </section>
  );
}
