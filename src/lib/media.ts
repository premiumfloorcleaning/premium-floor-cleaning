/**
 * Every image and video URL the site uses, in one place.
 *
 * Assets are hosted on Cloudinary, so swapping a photo is a one-line change
 * here — no component edits, no files to drop into /public. Cloudinary stamps a
 * `v<version>` segment into each URL when the asset is (re)uploaded, so the
 * version is stored per asset rather than derived from a shared prefix.
 *
 * Two assets are still local, and are kept here anyway so this file remains the
 * only place any media path appears: see LOCAL_* below.
 *
 * Adding a new remote host? It also has to be allow-listed in
 * `next.config.ts` → `images.remotePatterns`, or next/image will reject it.
 */

const CLOUDINARY = "https://res.cloudinary.com/yvflssro";

const image = (path: string) => `${CLOUDINARY}/image/upload/${path}`;
const video = (path: string) => `${CLOUDINARY}/video/upload/${path}`;

export const media = {
  /** Brand marks — still served from /public, no Cloudinary copy yet. */
  brand: {
    logoBadge: "/logo-badge.png",
  },

  /** One per service card, reused on that service's own page. */
  services: {
    floorScrubbing: image("v1786529699/floor_scrubing.png"),
    tileCleaning: image("v1786529693/tile_cleaning.png"),
    carpetCleaning: image("v1786529704/carpet_cleaning.png"),
    pressureWashing: image("v1786529705/pressure_washing.png"),
    windowCleaning: image("v1786529693/window_cleaning.png"),
    graffitiRemoval: image("v1786530011/graffiti_removal.png"),
  },

  /**
   * Matched before/after pairs. Each pair must share framing and aspect ratio,
   * or the reveal handle will not line the two shots up.
   */
  results: {
    timberBefore: image("v1786529699/image.webp"),
    timberAfter: image("v1786529701/image_1.webp"),
    vctHallwayBefore: image("v1786529693/worn_vct_hallway.webp"),
    vctHallwayAfter: image("v1786529696/glossy_hallway_reflection.webp"),
    floorboardsBefore: image("v1786529691/worn_timber_floorboards.webp"),
    floorboardsAfter: image("v1786529700/polished_honey_wood_floor.webp"),
    drivewayBefore: image("v1786529695/dirty_driveway_overcast.webp"),
    drivewayAfter: image("v1786529691/clean_driveway_pressure_washed.webp"),
  },

  /** Transparent-background cut-out for the mid-page CTA panel. */
  people: {
    cleaningGirl: image("v1786529697/cleaning_girl.png"),
  },

  video: {
    /**
     * Hero background footage — still local. There is no Cloudinary copy, and
     * the hero is the largest asset on the page, so move it when one exists.
     */
    hero: "/team/0107.mp4",
    jobClip: video("v1786529697/cleaning.mp4"),
  },

  /**
   * Animated WebPs driving the scrub band. These render with `unoptimized` so
   * every frame survives — next/image would flatten them to a single frame.
   */
  scrub: {
    bubbles: image("v1786530027/bubbles.webp"),
    soap: image("v1786530032/soap.webp"),
  },
} as const;
