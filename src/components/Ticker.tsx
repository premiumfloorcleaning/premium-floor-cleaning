import { Fragment } from "react";
import { tickerItems } from "@/lib/site";
import styles from "./Ticker.module.css";

function Row({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div className={styles.row} aria-hidden={ariaHidden || undefined}>
      {tickerItems.map((item) => (
        <Fragment key={item}>
          <span>{item}</span>
          <span className={styles.sparkle}>✦</span>
        </Fragment>
      ))}
    </div>
  );
}

export default function Ticker() {
  return (
    <div className={styles.wrap}>
      <div className={styles.track}>
        <Row />
        {/* Duplicate row so the -50% translate loops seamlessly. */}
        <Row ariaHidden />
      </div>
    </div>
  );
}
