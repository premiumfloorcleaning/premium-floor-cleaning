/**
 * Every image and video URL the site uses, in one place.
 *
 * Assets are hosted on Cloudinary, so swapping a photo is a one-line change
 * here — no component edits, no files to drop into /public. Cloudinary stamps a
 * `v<version>` segment into each URL when the asset is (re)uploaded, so the
 * version is stored per asset rather than derived from a shared prefix.
 *
 * The logo badge is the only asset still served from /public, and it is listed
 * here anyway so this file remains the only place any media path appears.
 *
 * Adding a new remote host? It also has to be allow-listed in
 * `next.config.ts` → `images.remotePatterns`, or next/image will reject it.
 */

const CLOUDINARY = "https://res.cloudinary.com/yvflssro";

const image = (path: string) => `${CLOUDINARY}/image/upload/${path}`;

/**
 * A video re-encoded to H.264 and capped at 1600px wide.
 *
 * `vc_h264` is not optional. Phone footage is often HEVC/H.265 (the source for
 * the hero is `codecs=hvc1`), which Safari plays and Chrome and Firefox largely
 * do not — so an untranscoded upload silently shows nothing but the poster for a
 * large share of visitors. H.264 plays everywhere, and the width cap keeps a
 * decorative background clip from shipping at full phone resolution.
 */
const playableVideo = (path: string) =>
  `${CLOUDINARY}/video/upload/vc_h264,w_1600,c_limit,q_auto/${path}`;

/**
 * A single frame pulled out of a video, for use as its poster. `path` is the
 * video's path with a .jpg extension, and `second` is how far in to grab —
 * a second or two, because frame zero of a clip is often black.
 */
const videoFrame = (path: string, second = 1.5) =>
  `${CLOUDINARY}/video/upload/so_${second},c_fill,g_auto,w_1600,h_900,f_jpg,q_auto/${path}`;

/**
 * A 1200×630 JPEG crop of any asset, for og:image / twitter:image. Social
 * scrapers want that exact ratio and are unreliable with WebP, so Cloudinary
 * does the crop and the format conversion on delivery — no second upload.
 */
export const socialCard = (path: string) =>
  `${CLOUDINARY}/image/upload/c_fill,g_auto,w_1200,h_630,f_jpg,q_auto/${path}`;

/** Dimensions of everything socialCard() returns — required by og:image. */
export const SOCIAL_CARD_SIZE = { width: 1200, height: 630 } as const;

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

  /**
   * Poster for the hero clip — a real frame out of that same video, so the still
   * and the footage match. It is the page's Largest Contentful Paint, which is
   * why it is capped at 1600×900 and compressed rather than served full size.
   */
  heroPoster: videoFrame("v1786529717/0107.jpg"),

  video: {
    /** Hero background footage. */
    hero: playableVideo("v1786529717/0107.mp4"),
    jobClip: playableVideo("v1786529697/cleaning.mp4"),
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

/**
 * Cloudinary paths, not full URLs — socialCard() and the schema image list both
 * need to re-derive a URL from these, which a finished URL will not allow.
 */
export const cloudinaryPaths = {
  /** Default share card for the site: the most recognisable finished result. */
  social: "v1786529700/polished_honey_wood_floor.webp",
  floorScrubbing: "v1786529699/floor_scrubing.png",
  tileCleaning: "v1786529693/tile_cleaning.png",
  carpetCleaning: "v1786529704/carpet_cleaning.png",
  pressureWashing: "v1786529705/pressure_washing.png",
  windowCleaning: "v1786529693/window_cleaning.png",
  graffitiRemoval: "v1786530011/graffiti_removal.png",
  glossyHallway: "v1786529696/glossy_hallway_reflection.webp",
  cleanDriveway: "v1786529691/clean_driveway_pressure_washed.webp",
} as const;
