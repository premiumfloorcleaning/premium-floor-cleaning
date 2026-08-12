"use client";

import { useState } from "react";
import AutoReveal from "./AutoReveal";
import ImageSlot from "./ImageSlot";
import { Drag } from "./Icons";
import { beforeAfter, galleryItems } from "@/lib/site";
import styles from "./BeforeAfter.module.css";

export default function BeforeAfter() {
  const [reveal, setReveal] = useState(52);

  return (
    <section id="results" className="container section">
      <div className={styles.top}>
        <div>
          <span className="eyebrow">Real results</span>
          <h2 className={`sectionTitle ${styles.title}`}>
            Drag the handle. Same floor, same day.
          </h2>
          <p className={`lede ${styles.copy}`}>
            Every job gets photographed before and after, so you can see exactly
            what you paid for. This slider is where your own before/after shots
            go.
          </p>
          <div className={styles.tags}>
            <span className="tag">Photographed every job</span>
            <span className="tag">Walk-through before we leave</span>
          </div>
        </div>

        <div className={styles.viewer}>
          <div className={styles.layer}>
            <ImageSlot
              src={beforeAfter.after.src}
              alt={beforeAfter.after.alt}
              label="After photo"
              tone="dark"
              sizes="(min-width: 940px) 50vw, 100vw"
            />
          </div>
          {/* Clipped from the right, so dragging left reveals more of the after shot. */}
          <div
            className={styles.layer}
            style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }}
          >
            <ImageSlot
              src={beforeAfter.before.src}
              alt={beforeAfter.before.alt}
              label="Before photo"
              tone="dark"
              sizes="(min-width: 940px) 50vw, 100vw"
            />
          </div>

          <span className={`${styles.badge} ${styles.badgeBefore}`}>BEFORE</span>
          <span className={`${styles.badge} ${styles.badgeAfter}`}>AFTER</span>

          <div className={styles.handleLine} style={{ left: `${reveal}%` }}>
            <span className={styles.handle}>
              <Drag />
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={reveal}
            onChange={(event) => setReveal(Number(event.target.value))}
            aria-label="Reveal before and after"
            className={styles.range}
          />
        </div>
      </div>

      <div className={styles.gallery}>
        {galleryItems.map((item, index) => (
          <figure key={item.id} className={styles.figure}>
            <div className={styles.figureMedia}>
              {item.beforeImage && item.image ? (
                <AutoReveal
                  before={{
                    src: item.beforeImage,
                    alt: item.beforeAlt ?? `${item.caption} — before`,
                  }}
                  after={{ src: item.image, alt: item.alt ?? item.caption }}
                  sizes="(min-width: 940px) 25vw, 50vw"
                  // Spread the cards around the 7s cycle so they don't sweep in unison.
                  offsetMs={index * 2300}
                />
              ) : (
                <ImageSlot
                  src={item.image}
                  alt={item.alt ?? item.caption}
                  label={item.label}
                  tone={item.id === "g4" ? "dark" : "light"}
                  sizes="(min-width: 940px) 25vw, 50vw"
                />
              )}
            </div>
            <figcaption className={styles.caption}>{item.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
