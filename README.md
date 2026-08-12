# Premium Floor Cleaning Services — Next.js site

Next.js 15 (App Router, TypeScript, CSS Modules) implementation of the Claude Design
project [Premium Floor Cleaning](https://claude.ai/design/p/d1c75d5b-98dc-487c-b63a-6809ba594179),
ported from `Premium Floor Cleaning Home.dc.html`.

## Run

```bash
npm run dev     # http://localhost:3000
npm run build
npm start
npm run lint
```

## Layout

```
src/
  app/
    layout.tsx                  fonts (next/font), metadata
    page.tsx                    home page — composes the sections + JSON-LD
    globals.css                 design tokens + shared primitives
    api/quote/route.ts          quote form endpoint
    services/[slug]/            service detail pages (see "Known gaps")
  components/
    SiteHeader / SiteFooter / StickyActions
    Hero / Ticker / Services / BeforeAfter / HowItWorks
    ScrubBand / CtaBanner / About / Faq / Contact
    ImageSlot                   image placeholder (see below)
    Icons                       inline SVG set
  lib/site.ts                   business details, services, FAQ copy
public/brand/logo-badge.png     logo from the design project's assets/
```

## Design tokens

Every colour, radius, shadow, and font in the design source is a CSS custom
property on `:root` in `src/app/globals.css`, with the same names as the source
(`--ink`, `--bone`, `--brass`, `--r`, `--shadow-lg`, …). Change the accent in one
place by editing `--brass`; `--bronze` derives from it via `color-mix`.

Shared, repeated patterns from the design live as global classes in the same
file (`.container`, `.section`, `.eyebrow`, `.sectionTitle`, `.lede`, `.btn`,
`.tag`, `.card`, `.iconDot`). Everything section-specific is a CSS Module next to
its component.

## Filling in the images

Nothing in the design project had real photography — every visual is an
`<image-slot>` placeholder. `ImageSlot` is the Next.js equivalent: with no `src`
it renders a dashed placeholder captioned with what belongs there; pass `src`
(a path under `public/`) and it renders `next/image` with `fill` instead.

Slots to fill, in page order:

| Where | What the design asks for |
| --- | --- |
| `Hero` | ⚠️ Wired to `public/team/0107.mp4` and looping correctly, but **that file is HEVC 4K and will not play for many visitors** — re-encode it (see below). `ImageSlot` renders any video extension as a muted, autoplaying, looping background `<video>`. |
| `Services` | One photo per service (6). |
| `BeforeAfter` | ✅ Pair filled — `image.webp` (before) / `image_1.webp` (after), both 4:3. Still needed: the 4 gallery items below it (the last is a ~20s video). |
| `ScrubBand` | Transparent-background GIF of a dishwash brush scrubbing with suds. |
| `CtaBanner` | ✅ Filled — `public/team/cleaning_girl.png`. |
| `About` | Team-at-work photo. |

## The quote form

`Contact` posts JSON to `POST /api/quote`. The route validates and logs; it does
**not** deliver anywhere yet — wire it to email, a CRM webhook, or a database in
`src/app/api/quote/route.ts`. Return a non-2xx status on failure and the form
shows its error state (with a fallback to phone/WhatsApp).

## Deviations from the design source

Deliberate changes, all noted so they can be reversed:

- **Responsive switching is CSS, not JS.** The source measured `window.innerWidth`
  and branched at 940px, which flashes the wrong layout before hydration. Here the
  940px breakpoint is a media query, so the header nav, mobile menu button, bottom
  action bar, and WhatsApp FAB all render correctly on first paint.
- **The scrub band's chips and progress bar are inside the dark panel.** In the
  source they sit just *after* the panel's closing tag, which put bone-coloured
  text on the bone page background and made the progress bar position against an
  unpositioned ancestor. This reads as an authoring slip; the intended placement
  is used here.
- **Hover/focus styling uses real pseudo-classes** rather than the source's
  `style-hover` / `style-focus` attributes (a design-canvas runtime feature).
- **Header and footer links are root-relative** (`/#services`) so the shared
  header works from the service pages.
- **Added:** JSON-LD `LocalBusiness` + FAQ structured data, `prefers-reduced-motion`
  handling for the ticker and card lifts, and an error state on the quote form.

## Known gaps

- `/services/[slug]` is a lightweight stub. The design project has a separate
  `Premium Floor Cleaning Service Pages.dc.html` that was not part of this import;
  the stub reuses each service's home-page copy so the cards don't link into a
  dead end. Replace it when that file is ported.
- Only the home page was in scope. The design project also contains logo files
  and a red colour variant (`Premium Floor Cleaning Home v1 (red).dc.html`).
