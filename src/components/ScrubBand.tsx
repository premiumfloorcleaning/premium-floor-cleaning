"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { media } from "@/lib/media";
import styles from "./ScrubBand.module.css";

/**
 * The copy is rendered once, clean, and never duplicated — a canvas film of dust
 * sits on top of it and is erased away by the scrubber. The earlier version
 * stacked a second "clean" copy of the text above the grimy one and revealed it
 * through a mask, which doubled the headline whenever the mask failed and needed
 * a glow on the clean copy to hide the seam. One layer means neither problem can
 * happen: the text you read is always the real, crisp text.
 */
const HEADLINE = "Bright grout. Fresh carpet. Even concrete. Clear glass.";

const FEATURES = [
  "Machine scrub, not a mop",
  "Extracted, not left to dry",
  "Green, biodegradable products",
  "Dry in about 4–8 hours",
];

/** One loop: dust settles, sits long enough to read as dirty, gets worked off, holds clean. */
const SOIL_MS = 950;
const DIRTY_MS = 700;
const SCRUB_MS = 4300;
const CLEAN_MS = 2100;
const CYCLE_MS = SOIL_MS + DIRTY_MS + SCRUB_MS + CLEAN_MS;

/** Boustrophedon pass — three lanes, alternating direction, like a real floor machine. */
const LANES = 3;

/** How long the last film takes to dry off at the start of the clean hold. */
const DRY_MS = 420;

function easeInOutSine(t: number) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

/**
 * Seeded, so the grit lands in the same places on every load and every resize.
 * An unseeded Math.random() makes the panel look subtly different each visit and
 * re-scatters the whole texture the moment the window changes width.
 */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A film of dust, built from four passes rather than one flat wash:
 * an uneven base, soft blotches of heavier and lighter soiling, three sizes of
 * grit, and faint traffic streaks. Edges hold more dirt than the middle, which
 * is what stops it reading as a grey rectangle.
 */
function paintDust(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const rand = mulberry32(0x5c2b17);

  // Base film. Deliberately not opaque — a ghost of the copy shows through, so
  // there is something legible to resolve rather than a blank slab.
  ctx.fillStyle = "rgba(158, 149, 133, 0.9)";
  ctx.fillRect(0, 0, w, h);

  // Cloudy, uneven soiling.
  const reach = Math.max(w, h);
  for (let i = 0; i < 34; i += 1) {
    const x = rand() * w;
    const y = rand() * h;
    const r = (0.08 + rand() * 0.24) * reach;
    const alpha = 0.05 + rand() * 0.13;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
    gradient.addColorStop(
      0,
      rand() > 0.45
        ? `rgba(210, 202, 186, ${alpha})`
        : `rgba(92, 85, 71, ${alpha})`,
    );
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  // Grit. Mostly fine, with a scattering of coarser pieces catching the light.
  const specks = Math.round((w * h) / 900);
  for (let i = 0; i < specks; i += 1) {
    const x = rand() * w;
    const y = rand() * h;
    const fine = rand() < 0.84;
    const r = fine ? 0.35 + rand() * 0.75 : 1.1 + rand() * 1.6;
    ctx.fillStyle =
      rand() < 0.55
        ? `rgba(68, 62, 52, ${0.1 + rand() * 0.3})`
        : `rgba(236, 230, 217, ${0.08 + rand() * 0.26})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Traffic wear — near-vertical, slightly skewed, very low contrast.
  for (let i = 0; i < 22; i += 1) {
    const x = rand() * w;
    const width = 8 + rand() * 30;
    const skew = 10 + rand() * 26;
    ctx.fillStyle = `rgba(112, 104, 88, ${0.025 + rand() * 0.045})`;
    ctx.beginPath();
    ctx.moveTo(x, -8);
    ctx.lineTo(x + width, -8);
    ctx.lineTo(x + width + skew, h + 8);
    ctx.lineTo(x + skew, h + 8);
    ctx.closePath();
    ctx.fill();
  }

  // Corners and edges collect what the middle does not.
  const vignette = ctx.createRadialGradient(
    w / 2,
    h / 2,
    Math.min(w, h) * 0.16,
    w / 2,
    h / 2,
    Math.max(w, h) * 0.74,
  );
  vignette.addColorStop(0, "rgba(64, 58, 48, 0)");
  vignette.addColorStop(1, "rgba(64, 58, 48, 0.3)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
}

/**
 * The eraser, pre-rendered once and stamped along the path. Building a fresh
 * radial gradient per stamp costs far more than reusing one bitmap, and the
 * feathered rim is what makes the stroke look wiped rather than cut out.
 */
function makeBrush(radius: number, dpr: number) {
  const canvas = document.createElement("canvas");
  const size = Math.max(2, Math.ceil(radius * 2 * dpr));
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  gradient.addColorStop(0, "rgba(0, 0, 0, 1)");
  gradient.addColorStop(0.6, "rgba(0, 0, 0, 0.99)");
  gradient.addColorStop(0.84, "rgba(0, 0, 0, 0.6)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return canvas;
}

/** Where the head sits at `t` (0–1) through the pass. */
function headAt(t: number, w: number, h: number) {
  const pos = Math.min(Math.max(t, 0), 1) * LANES;
  const lane = Math.min(Math.floor(pos), LANES - 1);
  const laneT = pos - lane;
  const rightward = lane % 2 === 0;

  const inset = w * 0.04;
  const span = w - inset * 2;
  const band = h / LANES;

  return {
    x: inset + span * (rightward ? laneT : 1 - laneT),
    // A shallow bob, so the pass reads as worked by hand rather than plotted.
    // sin() returns to 0 at both ends of a lane, which keeps the lanes joined.
    y: band * (lane + 0.5) + Math.sin(laneT * Math.PI * 2) * band * 0.1,
  };
}

export default function ScrubBand() {
  const panelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrubberRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panelEl = panelRef.current;
    const canvasEl = canvasRef.current;
    const scrubber = scrubberRef.current;
    if (!panelEl || !canvasEl) return;

    const context = canvasEl.getContext("2d");
    if (!context) return;

    /*
      Re-bound with explicitly non-nullable types.

      The helpers below are hoisted function declarations, and TypeScript will not
      carry a null-check narrowing into those — it has to assume they could be
      called before the check ran. Annotating these makes the non-null type the
      declared one, so no narrowing needs to travel into the closures. `scrubber`
      is not re-bound because place() null-checks it in its own body.
    */
    const panel: HTMLDivElement = panelEl;
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = context;

    /*
      Everything below runs on refs and direct style writes rather than React
      state. The old version called setState on every animation frame, which
      re-rendered the whole section 60 times a second to move one element.
    */
    let dust: HTMLCanvasElement | null = null;
    let brush: HTMLCanvasElement | null = null;
    let width = 0;
    let height = 0;
    let radius = 0;
    let step = 0.01;

    let frame: number | null = null;
    let elapsed = 0;
    let lastStamp: number | null = null;
    // How far through the pass the panel is already wiped, and which loop we are
    // on — a change in loop index is what triggers the dust being laid back down.
    let cut = 0;
    let loop = -1;

    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    function place(at: { x: number; y: number }, opacity: number) {
      if (!scrubber) return;
      scrubber.style.transform = `translate3d(${at.x}px, ${at.y}px, 0) translate(-50%, -50%)`;
      scrubber.style.opacity = String(opacity);
    }

    function layDust() {
      ctx.clearRect(0, 0, width, height);
      if (dust) ctx.drawImage(dust, 0, 0, width, height);
    }

    function wipe(from: number, to: number) {
      if (!brush) return;
      ctx.globalCompositeOperation = "destination-out";
      for (let t = from + step; t < to; t += step) {
        const at = headAt(t, width, height);
        ctx.drawImage(brush, at.x - radius, at.y - radius, radius * 2, radius * 2);
      }
      // Always finish on the head itself, so the stroke ends under the soap.
      const end = headAt(to, width, height);
      ctx.drawImage(brush, end.x - radius, end.y - radius, radius * 2, radius * 2);
      ctx.globalCompositeOperation = "source-over";
    }

    function measure() {
      const rect = panel.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      if (w < 2 || h < 2) return false;

      // Capped: a 3x buffer on a large panel costs a lot for no visible gain.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = w;
      height = h;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      dust = document.createElement("canvas");
      dust.width = canvas.width;
      dust.height = canvas.height;
      const dustCtx = dust.getContext("2d");
      if (!dustCtx) return false;
      dustCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintDust(dustCtx, w, h);

      // Wide enough that three lanes overlap into full coverage, including corners.
      radius = Math.max(78, (h / LANES) * 0.92);
      brush = makeBrush(radius, dpr);
      // Stamp spacing as a fraction of the pass, from the path length in px.
      step = Math.min(0.02, (radius * 0.22) / (w * LANES));
      return true;
    }

    if (reduced) {
      // No dust, no scrubber — just the copy, already clean.
      canvas.style.opacity = "0";
      if (scrubber) scrubber.style.opacity = "0";
      return;
    }

    if (!measure()) return;

    function render() {
      const t = elapsed % CYCLE_MS;
      const index = Math.floor(elapsed / CYCLE_MS);

      if (index !== loop) {
        loop = index;
        cut = 0;
        layDust();
      }

      if (t < SOIL_MS) {
        canvas.style.opacity = String(easeOutCubic(t / SOIL_MS));
        place(headAt(0, width, height), 0);
        return;
      }

      const afterSoil = t - SOIL_MS;
      if (afterSoil < DIRTY_MS) {
        canvas.style.opacity = "1";
        place(headAt(0, width, height), 0);
        return;
      }

      const afterDirty = afterSoil - DIRTY_MS;
      if (afterDirty < SCRUB_MS) {
        canvas.style.opacity = "1";
        const progress = easeInOutSine(afterDirty / SCRUB_MS);
        if (progress > cut) {
          wipe(cut, progress);
          cut = progress;
        }
        place(headAt(progress, width, height), 1);
        return;
      }

      // Clean hold. Finish any remainder, then dry the last film off — which
      // also guarantees a pristine panel regardless of feathering residue.
      if (cut < 1) {
        wipe(cut, 1);
        cut = 1;
      }
      const drying = Math.min(1, (afterDirty - SCRUB_MS) / DRY_MS);
      canvas.style.opacity = String(1 - easeOutCubic(drying));
      place(headAt(1, width, height), 0);
    }

    const tick = (now: number) => {
      if (lastStamp !== null) elapsed += now - lastStamp;
      lastStamp = now;
      render();
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame !== null) return;
      lastStamp = null;
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (frame === null) return;
      cancelAnimationFrame(frame);
      frame = null;
      lastStamp = null;
    };

    // Run from mount so the loop never waits on an observer callback landing;
    // the observer only parks it while the panel is off screen.
    start();

    const visible = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) start();
          else stop();
        }
      },
      { threshold: 0 },
    );
    visible.observe(panel);

    // A width change re-flows the copy and changes the panel height, so the film
    // and the brush both have to be rebuilt, then re-wiped to where we were.
    const resized = new ResizeObserver(() => {
      const was = cut;
      if (!measure()) return;
      layDust();
      if (was > 0) wipe(0, was);
      cut = was;
    });
    resized.observe(panel);

    return () => {
      visible.disconnect();
      resized.disconnect();
      stop();
    };
  }, []);

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
          {/* The only copy on the panel. In flow, so it sets the height. */}
          <div className={styles.content}>
            <p className={styles.headline}>{HEADLINE}</p>
            <div className={styles.chips}>
              {FEATURES.map((feature) => (
                <span key={feature} className={styles.chip}>
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* The dust film, erased in place. */}
          <canvas ref={canvasRef} className={styles.dust} aria-hidden="true" />

          <div ref={scrubberRef} className={styles.scrubber} aria-hidden="true">
            <span className={styles.wet} />
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
