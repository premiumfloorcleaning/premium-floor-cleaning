import Link from "next/link";
import { serviceAreas, site } from "@/lib/site";
import styles from "./CoverageMap.module.css";

/**
 * Real map tiles with the coverage area shaded on top.
 *
 * The previous version was an OpenStreetMap `/export/embed.html` iframe, which
 * could not do this: that embed fits its bbox by snapping to an integer zoom, so
 * the visible extent is wider than what you asked for by an unpredictable amount.
 * Anything overlaid on it drifts off the geography underneath, and it only
 * supports a single marker.
 *
 * So the projection is done here instead. We pick the zoom, compute the Web
 * Mercator pixel position of every region ourselves, and lay the tiles out to
 * match — which is what Leaflet does internally, minus the 45KB and the client
 * JavaScript. Because the projection is known, the shaded circles and the labels
 * land exactly where those places actually are.
 *
 * Everything below is computed once at module scope, so it runs at build time and
 * ships as plain markup.
 */

const TILE = 256;
/** 9 gives ~15 tiles for this area. 10 would be 40 — four times the payload. */
const ZOOM = 9;
/** Breathing room around the coverage circles, in map pixels. */
const PAD = 26;

/**
 * Tile source. OpenStreetMap's own tiles are fine for low-volume use and need the
 * attribution shown below, but their usage policy would rather commercial sites
 * used a provider or self-hosted tiles. Swapping to MapTiler, Stadia or similar
 * (all have free tiers, and dark styles that would suit this panel better) is a
 * change to this one line plus the attribution text.
 */
const tileUrl = (x: number, y: number) =>
  `https://tile.openstreetmap.org/${ZOOM}/${x}/${y}.png`;

const SCALE = TILE * 2 ** ZOOM;

const worldX = (lon: number) => ((lon + 180) / 360) * SCALE;

const worldY = (lat: number) => {
  const s = Math.sin((lat * Math.PI) / 180);
  return (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * SCALE;
};

/** Ground resolution, needed to turn a radius in km into a radius in pixels. */
const metresPerPixel = (lat: number) =>
  (156543.03392804097 * Math.cos((lat * Math.PI) / 180)) / 2 ** ZOOM;

const projected = serviceAreas.map((area) => ({
  slug: area.slug,
  name: area.name,
  labelSide: area.map.labelSide,
  wx: worldX(area.map.lon),
  wy: worldY(area.map.lat),
  radius: (area.map.radiusKm * 1000) / metresPerPixel(area.map.lat),
}));

/** Frame the coverage circles themselves, not an arbitrary bounding box. */
const bounds = projected.reduce(
  (acc, p) => ({
    minX: Math.min(acc.minX, p.wx - p.radius),
    maxX: Math.max(acc.maxX, p.wx + p.radius),
    minY: Math.min(acc.minY, p.wy - p.radius),
    maxY: Math.max(acc.maxY, p.wy + p.radius),
  }),
  { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity },
);

const MIN_X = bounds.minX - PAD;
const MIN_Y = bounds.minY - PAD;
const BOX_W = bounds.maxX + PAD - MIN_X;
const BOX_H = bounds.maxY + PAD - MIN_Y;

const tiles: { key: string; x: number; y: number; left: number; top: number }[] =
  [];
for (let x = Math.floor(MIN_X / TILE); x <= Math.floor((MIN_X + BOX_W) / TILE); x += 1) {
  for (let y = Math.floor(MIN_Y / TILE); y <= Math.floor((MIN_Y + BOX_H) / TILE); y += 1) {
    tiles.push({
      key: `${x}-${y}`,
      x,
      y,
      left: ((x * TILE - MIN_X) / BOX_W) * 100,
      top: ((y * TILE - MIN_Y) / BOX_H) * 100,
    });
  }
}

/*
  Tiles are positioned as percentages of a box whose aspect ratio is locked to
  BOX_W:BOX_H, so the whole mosaic scales with the container and the SVG overlay
  stays registered to it. The +1px is a deliberate overlap: percentage rounding
  otherwise leaves hairline seams between tiles.
*/
const TILE_W = `calc(${(TILE / BOX_W) * 100}% + 1px)`;
const TILE_H = `calc(${(TILE / BOX_H) * 100}% + 1px)`;

/** Region positions in the SVG's own coordinate space, and as percentages. */
const regions = projected.map((p) => ({
  ...p,
  x: p.wx - MIN_X,
  y: p.wy - MIN_Y,
  leftPct: ((p.wx - MIN_X) / BOX_W) * 100,
  topPct: ((p.wy - MIN_Y) / BOX_H) * 100,
}));

export default function CoverageMap() {
  return (
    <div className={styles.panel}>
      <div
        className={styles.frame}
        style={{ aspectRatio: `${BOX_W} / ${BOX_H}` }}
      >
        {/* Wrapper so the colour grade is one composited layer, not fifteen. */}
        <div className={styles.tiles}>
          {tiles.map((tile) => (
            /*
              Plain <img>, not next/image: these are already 256px PNGs served
              from a CDN, so putting 15 of them through the optimizer costs build
              time and cache space for no gain.
            */
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={tile.key}
              src={tileUrl(tile.x, tile.y)}
              alt=""
              width={TILE}
              height={TILE}
              loading="lazy"
              decoding="async"
              className={styles.tile}
              style={{
                left: `${tile.left}%`,
                top: `${tile.top}%`,
                width: TILE_W,
                height: TILE_H,
              }}
            />
          ))}
        </div>

        {/*
          preserveAspectRatio="none" so the overlay stretches exactly as the
          percentage-positioned tiles do — "meet" would letterbox on any rounding
          difference and pull the shading off the map.
        */}
        <svg
          viewBox={`0 0 ${BOX_W} ${BOX_H}`}
          preserveAspectRatio="none"
          className={styles.shade}
          aria-hidden="true"
        >
          {/* Soft outer band, so the boundary reads as approximate. */}
          <g opacity="0.13" fill="#1e6fbf">
            {regions.map((region) => (
              <circle
                key={region.slug}
                cx={region.x}
                cy={region.y}
                r={region.radius * 1.07}
              />
            ))}
          </g>
          {/*
            Group opacity, not per-circle: applied after the circles composite,
            so the five overlaps do not stack into dark patches and the union
            reads as one continuous area.
          */}
          <g opacity="0.28" fill="#1e6fbf">
            {regions.map((region) => (
              <circle
                key={region.slug}
                cx={region.x}
                cy={region.y}
                r={region.radius}
              />
            ))}
          </g>
        </svg>

        {/*
          Markers are HTML, not SVG text: text inside a scaled viewBox shrinks
          with the artwork and is unreadable on a phone. Each is a zero-size
          anchor at the exact projected point, with the label offset from it.
        */}
        {regions.map((region) => (
          <Link
            key={region.slug}
            href={`/areas/${region.slug}`}
            className={`${styles.marker} ${
              region.labelSide === "left" ? styles.markerLeft : ""
            }`}
            style={{ left: `${region.leftPct}%`, top: `${region.topPct}%` }}
          >
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.label}>{region.name}</span>
          </Link>
        ))}

        <span className={styles.badge} aria-hidden="true">
          Our coverage area
        </span>
      </div>

      <div className={styles.foot}>
        <p className={styles.caption}>
          Shaded area is indicative. Map data ©{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener"
            className={styles.captionLink}
          >
            OpenStreetMap
          </a>{" "}
          contributors.
        </p>
        <a
          href={site.map.coverageLarge}
          target="_blank"
          rel="noopener"
          className={styles.expand}
        >
          Larger map
        </a>
      </div>
    </div>
  );
}
