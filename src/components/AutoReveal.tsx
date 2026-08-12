import ImageSlot from "./ImageSlot";
import styles from "./AutoReveal.module.css";

type Shot = { src: string; alt: string };

export type AutoRevealProps = {
  /** The grimy shot. Sweeps in and out over `after`. */
  before: Shot;
  /** The finished shot, sitting underneath. */
  after: Shot;
  sizes?: string;
  /**
   * Offset into the sweep cycle, in ms. Several of these side by side would
   * otherwise animate in perfect lockstep, which looks mechanical. Applied as a
   * negative animation-delay so the card starts mid-cycle rather than waiting.
   */
  offsetMs?: number;
};

/**
 * A before/after reveal that sweeps on its own — no dragging. Used on the small
 * gallery cards, where a drag handle would be fiddly.
 *
 * Driven entirely by a CSS `clip-path` animation, so there is no JS, no state
 * and nothing to pause: the browser stops compositing it when it scrolls out of
 * view. Both photos must share a framing and aspect ratio or they will not line
 * up under the divider.
 */
export default function AutoReveal({
  before,
  after,
  sizes,
  offsetMs = 0,
}: AutoRevealProps) {
  const phase = { animationDelay: `-${offsetMs}ms` };

  return (
    <>
      <ImageSlot
        src={after.src}
        alt={after.alt}
        label="After photo"
        tone="dark"
        sizes={sizes}
      />

      {/* Clipped from the right, so the sweep uncovers the after shot. */}
      <div className={styles.before} style={phase}>
        <ImageSlot
          src={before.src}
          alt={before.alt}
          label="Before photo"
          tone="dark"
          sizes={sizes}
        />
      </div>

      {/* Rides the clip edge, so the effect reads as a slider rather than a fade. */}
      <span className={styles.divider} style={phase} aria-hidden="true" />
    </>
  );
}
