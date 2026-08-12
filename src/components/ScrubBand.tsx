"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { media } from "@/lib/media";
import styles from "./ScrubBand.module.css";

/**
 * Both layers render the same string — that is what lets the mask reveal read as
 * one surface being cleaned. The wording is the "before" state of the six
 * services, so each phrase maps to something we actually sell.
 */
const HEADLINE = "Dark grout. Stained carpet. Dull concrete. Streaky glass.";

const FEATURES = [
  "Machine scrub, not a mop",
  "Extracted, not left to dry",
  "Green, biodegradable products",
  "Dry in about 4–8 hours",
];

/**
 * Fixed scatter of scrub patches — random-looking, but stable across renders so
 * the same spot never re-dirties mid-pass as the soap works around the panel.
 */
const PATCHES = [
  { x: 18, y: 30 },
  { x: 44, y: 22 },
  { x: 68, y: 34 },
  { x: 86, y: 26 },
  { x: 78, y: 52 },
  { x: 52, y: 46 },
  { x: 26, y: 52 },
  { x: 14, y: 72 },
  { x: 38, y: 78 },
  { x: 62, y: 70 },
  { x: 84, y: 78 },
  { x: 50, y: 62 },
];

/**
 * Patch reach in px. An explicit radius matters: without one the gradient sizes
 * itself to the farthest corner, so on a wide, short panel a single patch wipes
 * most of the headline at once.
 */
const RADIUS_PX = 190;
const EMPTY_MASK = "radial-gradient(circle 0 at 50% 50%, rgba(0,0,0,0) 0 100%)";

/**
 * One loop of the effect: the soap works across the panel, the clean result is
 * held long enough to read, then the grime fades back in and it starts over.
 */
const SCRUB_MS = 4600;
const HOLD_MS = 1600;
const RESOIL_MS = 900;
const CYCLE_MS = SCRUB_MS + HOLD_MS + RESOIL_MS;

type Shape = { x: number; y: number; r: number };

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - (1 - t) * (1 - t) * 2;
}

/** Where we are in the loop: how much is scrubbed, and how visible the clean layer is. */
function cycleAt(elapsed: number) {
  const t = elapsed % CYCLE_MS;

  if (t < SCRUB_MS) {
    return { progress: easeInOut(t / SCRUB_MS), cleanOpacity: 1 };
  }
  if (t < SCRUB_MS + HOLD_MS) {
    return { progress: 1, cleanOpacity: 1 };
  }
  // Grime creeping back in: keep the mask open and fade the clean layer away.
  const fade = (t - SCRUB_MS - HOLD_MS) / RESOIL_MS;
  return { progress: 1, cleanOpacity: 1 - fade };
}

/** Patches already scrubbed, plus the soap's interpolated position. */
function scrubState(progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  const pos = p * PATCHES.length;
  const done = Math.floor(pos);
  const frac = pos - done;

  const shapes: Shape[] = [];
  for (let i = 0; i < PATCHES.length; i += 1) {
    const grow = i < done ? 1 : i === done ? frac : 0;
    if (grow <= 0) continue;
    shapes.push({
      x: PATCHES[i].x,
      y: PATCHES[i].y,
      r: Math.round(RADIUS_PX * (0.55 + grow * 0.45)),
    });
  }

  // Interpolate between patch centres so the soap sweeps instead of teleporting.
  const from = PATCHES[Math.min(done, PATCHES.length - 1)];
  const to = PATCHES[Math.min(done + 1, PATCHES.length - 1)];

  return {
    p,
    shapes,
    x: from.x + (to.x - from.x) * frac,
    y: from.y + (to.y - from.y) * frac,
  };
}

function buildMask(shapes: Shape[], core: number, grow = 0) {
  const layers = shapes.map(
    (s) =>
      `radial-gradient(circle ${s.r + grow}px at ${s.x}% ${s.y}%, ` +
      `#000 0 ${core}%, rgba(0,0,0,0) 100%)`,
  );
  return layers.length > 0 ? layers.join(", ") : EMPTY_MASK;
}

/**
 * Individual patches leave gaps in the corners, so the last stretch of progress
 * floods the whole panel to guarantee a genuinely finished, fully clean state.
 */
function floodLayer(p: number) {
  const t = Math.max(0, Math.min(1, (p - 0.84) / 0.16));
  if (t <= 0) return null;
  const r = Math.round(t * 1600);
  return `radial-gradient(circle ${r}px at 50% 50%, #000 0 74%, rgba(0,0,0,0) 100%)`;
}

export default function ScrubBand() {
  const panelRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [{ progress, cleanOpacity }, setFrame] = useState({
    progress: 0,
    cleanOpacity: 1,
  });

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setFrame({ progress: 1, cleanOpacity: 1 });
      return;
    }

    // Elapsed cycle time, accumulated so pausing off-screen doesn't skip ahead.
    let elapsed = 0;
    let last: number | null = null;

    const step = (now: number) => {
      if (last !== null) elapsed += now - last;
      last = now;
      setFrame(cycleAt(elapsed));
      frameRef.current = requestAnimationFrame(step);
    };

    const start = () => {
      if (frameRef.current !== null) return;
      last = null;
      frameRef.current = requestAnimationFrame(step);
    };

    const stop = () => {
      if (frameRef.current === null) return;
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      last = null;
    };

    // Run from mount, so the loop never depends on an observer callback landing.
    // The observer only pauses it while the panel is off screen.
    start();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) start();
          else stop();
        }
      },
      { threshold: 0 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      stop();
    };
  }, []);

  const { p, shapes, x, y } = scrubState(progress);
  const flood = floodLayer(p);
  const cleanMask = [buildMask(shapes, 62), flood].filter(Boolean).join(", ");
  const sheenMask = buildMask(shapes.slice(-2), 34, 30);
  const settled = p > 0.995;

  return (
    <section
      id="difference"
      className="section"
      style={{ paddingInline: "var(--pad-x)" }}
    >
      <div className={styles.inner}>
        <span className="eyebrow">Watch the difference</span>
        <h2 className={`sectionTitle ${styles.title}`}>
          One pass is all it takes
        </h2>

        <div className={styles.panel} ref={panelRef}>
          {/* Grimy state — in flow, so it sets the panel's height. */}
          <div className={styles.layer}>
            <p className={styles.headlineDirty}>{HEADLINE}</p>
            <div className={styles.chips}>
              {FEATURES.map((feature) => (
                <span key={feature} className={styles.chipDirty}>
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Dust and grit sitting on top of the grimy state. */}
          <div className={styles.grit} aria-hidden="true" />

          {/*
            Clean state — a full duplicate on an opaque ink background, revealed
            only where the soap has passed. Because it is opaque it wipes out both
            the grimy text and the grit above it. Fading its opacity at the end of
            each cycle is what lets the grime creep back in before the next pass.
          */}
          <div
            className={`${styles.layer} ${styles.layerClean}`}
            aria-hidden="true"
            style={{
              maskImage: cleanMask,
              WebkitMaskImage: cleanMask,
              opacity: cleanOpacity,
            }}
          >
            <p className={styles.headlineClean}>{HEADLINE}</p>
            <div className={styles.chips}>
              {FEATURES.map((feature) => (
                <span key={feature} className={styles.chipClean}>
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Wet sheen trailing the last couple of patches. */}
          <div
            className={`${styles.sheen} ${settled ? styles.sheenDone : ""}`}
            aria-hidden="true"
            style={{ maskImage: sheenMask, WebkitMaskImage: sheenMask }}
          />

          {/* The soap, with suds bursting behind it. */}
          <div
            className={`${styles.scrubber} ${settled ? styles.scrubberDone : ""}`}
            style={{ left: `${x}%`, top: `${y}%` }}
            aria-hidden="true"
          >
            <Image
              src={media.scrub.bubbles}
              alt=""
              width={320}
              height={320}
              // Animated WebP — must bypass the optimizer to keep every frame.
              unoptimized
              className={styles.suds}
            />
            <Image
              src={media.scrub.soap}
              alt=""
              width={320}
              height={320}
              unoptimized
              className={styles.soap}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
