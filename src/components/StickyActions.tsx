import Link from "next/link";
import { Phone, WhatsApp } from "./Icons";
import { site, waQuoteLink } from "@/lib/site";
import styles from "./StickyActions.module.css";

/**
 * Below 940px: a three-up action bar pinned to the bottom of the viewport.
 * At 940px and up: a single floating WhatsApp button. Both are CSS-gated, so
 * there is no layout flash on hydration (the design source switched on a JS
 * width measurement).
 */
export default function StickyActions() {
  return (
    <>
      <div className={styles.spacer} aria-hidden="true" />

      <div className={styles.bar}>
        <a href={site.phone.href} className={styles.barCall}>
          <Phone size={16} />
          Call
        </a>
        <a
          href={waQuoteLink}
          target="_blank"
          rel="noopener"
          className={styles.barWhatsApp}
        >
          <WhatsApp size={17} />
          WhatsApp
        </a>
        <Link href="/#contact" className={styles.barQuote}>
          Quote
        </Link>
      </div>

      <a
        href={waQuoteLink}
        target="_blank"
        rel="noopener"
        aria-label="Chat on WhatsApp"
        className={styles.fab}
      >
        <WhatsApp size={30} />
      </a>
    </>
  );
}
