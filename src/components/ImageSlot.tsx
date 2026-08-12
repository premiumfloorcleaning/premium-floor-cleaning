import Image from "next/image";
import styles from "./ImageSlot.module.css";

/** Anything matching this renders as a looping <video> rather than next/image. */
const VIDEO_SRC = /\.(mp4|webm|ogv|ogg|mov|m4v)(\?.*)?$/i;

export type ImageSlotProps = {
  /**
   * Point this at an entry in `media` (lib/media.ts). While it is unset the
   * slot renders the dashed placeholder from the design, captioned with `label`
   * — the Next.js equivalent of the source's <image-slot placeholder="…">.
   *
   * A video extension switches the slot to a muted, looping, autoplaying
   * background <video>. next/image cannot render video: it would hand the file
   * to the image optimizer, which stalls and yields a broken slot.
   */
  src?: string;
  alt?: string;
  label: string;
  fit?: "cover" | "contain";
  /** CSS object-position, e.g. "bottom center" to sit a cut-out on its baseline. */
  position?: string;
  priority?: boolean;
  sizes?: string;
  /** Video only: still shown while the file buffers, and on reduced-motion. */
  poster?: string;
  /** Placeholder tint for slots that sit on the dark ink panels. */
  tone?: "light" | "dark";
};

export default function ImageSlot({
  src,
  alt = "",
  label,
  fit = "cover",
  position,
  priority = false,
  sizes = "100vw",
  poster,
  tone = "light",
}: ImageSlotProps) {
  if (src && VIDEO_SRC.test(src)) {
    return (
      <video
        className={styles.video}
        style={{ objectFit: fit, objectPosition: position }}
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        // Decorative background footage — nothing here to announce or focus.
        aria-hidden="true"
        tabIndex={-1}
      />
    );
  }

  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        style={{ objectFit: fit, objectPosition: position }}
      />
    );
  }

  return (
    <div
      className={`${styles.slot} ${tone === "dark" ? styles.dark : ""}`}
      role="img"
      aria-label={label}
    >
      <span className={styles.label}>{label}</span>
    </div>
  );
}
