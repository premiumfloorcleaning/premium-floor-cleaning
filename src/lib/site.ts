/**
 * Single source of truth for business details, service list, and FAQ copy.
 * All content here is lifted verbatim from the Claude Design source
 * "Premium Floor Cleaning Home.dc.html".
 *
 * Image and video URLs are not repeated here — they come from lib/media.ts.
 */

import { media } from "./media";

export const site = {
  name: "Premium Floor Cleaning Services",
  shortName: "Premium Floor Cleaning",
  kicker: "South East QLD · Est. 2014",
  url: "https://premiumfloorcleaning.com",
  phone: {
    display: "0435 211 512",
    href: "tel:+61435211512",
    e164: "+61435211512",
  },
  email: "contact@premiumfloorcleaning.com",
  address: {
    street: "11B Archibald Street",
    locality: "West End",
    region: "QLD",
    postcode: "4101",
    country: "AU",
  },
  hours: "Mon to Sun, 7:00am – 9:00pm",
  hoursShort: "7am–9pm, incl. weekends",
  replyTime: "Under 10 min",
  social: {
    facebook: "https://www.facebook.com/PremiumFloorCleaningBrisbane",
    instagram: "https://www.instagram.com/premiumcleaning_brisbane/",
  },
  map: {
    embed:
      "https://www.openstreetmap.org/export/embed.html?bbox=152.99500%2C-27.49100%2C153.01900%2C-27.47500&layer=mapnik&marker=-27.48260%2C153.00680",
    directions:
      "https://www.google.com/maps/search/?api=1&query=11B+Archibald+Street+West+End+QLD+4101",
  },
} as const;

/**
 * Business WhatsApp — every wa.me link on the site is built from this.
 * 0450 601 512, i.e. a different line to the call/text number above.
 */
const WHATSAPP_NUMBER = "61450601512";

export function whatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const waQuoteLink = whatsAppLink(
  "Hi Premium Floor Cleaning, I’d like a quote",
);
export const waQuestionLink = whatsAppLink(
  "Hi Premium Floor Cleaning, I have a question",
);
export const waAreaLink = whatsAppLink(
  "Hi Premium Floor Cleaning, do you cover my suburb?",
);

/* ------------------------------------------------------------------
   Service areas — the five South East QLD regions we cover.
   Brisbane is the home base; the rest are listed in the order we
   travel to them most.
   ------------------------------------------------------------------ */

export type ServiceArea = {
  name: string;
  /** Representative suburbs, so visitors can place themselves quickly. */
  suburbs: string[];
  /** Short badge — used for the "home base" marker on Brisbane. */
  note?: string;
};

export const serviceAreas: ServiceArea[] = [
  {
    name: "Brisbane",
    suburbs: ["West End", "New Farm", "Chermside", "Indooroopilly", "Carindale"],
    note: "Home base",
  },
  {
    name: "Gold Coast",
    suburbs: ["Southport", "Surfers Paradise", "Broadbeach", "Robina", "Coomera"],
  },
  {
    name: "Ipswich",
    suburbs: ["Springfield Lakes", "Ripley", "Booval", "Goodna", "Karalee"],
  },
  {
    name: "Logan",
    suburbs: ["Springwood", "Shailer Park", "Browns Plains", "Beenleigh", "Marsden"],
  },
  {
    name: "Sunshine Coast",
    suburbs: ["Maroochydore", "Mooloolaba", "Caloundra", "Noosa", "Buderim"],
  },
];

/** "Brisbane, Gold Coast, Ipswich, Logan and the Sunshine Coast" — for prose. */
export const serviceAreaSentence =
  "Brisbane, Gold Coast, Ipswich, Logan and the Sunshine Coast";

/** Dot-separated form — for kickers, footers and other tight spots. */
export const serviceAreaList = serviceAreas
  .map((area) => area.name)
  .join(" · ");

export type Service = {
  slug: string;
  title: string;
  blurb: string;
  /** Pull from `media` in lib/media.ts. Unset renders the dashed placeholder. */
  image?: string;
  /** Placeholder caption shown until a real photo is dropped into the slot. */
  imageLabel: string;
};

export const services: Service[] = [
  {
    slug: "floor-scrubbing-acid-washing",
    title: "Floor Scrubbing & Acid Washing",
    blurb:
      "Ground-in dirt, oil marks and dull concrete brought back to an even, clean finish.",
    image: media.services.floorScrubbing,
    imageLabel: "Floor scrubbing",
  },
  {
    slug: "tile-cleaning-grout-removal",
    title: "Tile Cleaning & Grout Removal",
    blurb:
      "Dark grout lines and stained tiles in kitchens, bathrooms and entryways restored.",
    image: media.services.tileCleaning,
    imageLabel: "Tile & grout",
  },
  {
    slug: "carpet-cleaning",
    title: "Carpet Cleaning",
    blurb:
      "Deep steam extraction that lifts stains, smells and allergens. Dry in about 4–8 hours.",
    image: media.services.carpetCleaning,
    imageLabel: "Carpet cleaning",
  },
  {
    slug: "pressure-wash",
    title: "Pressure Wash",
    blurb:
      "Driveways, paths, patios and pool surrounds — mould, moss and black streaks gone.",
    image: media.services.pressureWashing,
    imageLabel: "Pressure washing",
  },
  {
    slug: "windows-cleaning",
    title: "Windows Cleaning",
    blurb:
      "Inside and out, frames and tracks included. Streak-free glass and more daylight.",
    image: media.services.windowCleaning,
    imageLabel: "Window cleaning",
  },
  {
    slug: "graffiti-removal",
    title: "Graffiti Removal",
    blurb:
      "Paint and tags removed from brick, render, fences and roller doors without damage.",
    image: media.services.graffitiRemoval,
    imageLabel: "Graffiti removal",
  },
];

export const tickerItems = [
  "Carpet steam cleaning",
  "Tile & grout restoration",
  "Driveway pressure washing",
  "Floor scrubbing & acid wash",
  "Window cleaning",
  "Graffiti removal",
];

export const steps = [
  {
    number: "01",
    title: "Tell us the problem",
    body: "Call, WhatsApp or use the form. A photo of the floor is faster than explaining it.",
  },
  {
    number: "02",
    title: "Free on-site quote",
    body: "We look at the actual surface, say what will and won’t lift, and give you a fixed price.",
  },
  {
    number: "03",
    title: "We clean, you check",
    body: "We walk the job with you before packing up. If something isn’t right, we put it right.",
  },
];

/**
 * Matched pair for the Results slider — same camera position, before and after,
 * both 4:3 so they line up exactly under the reveal handle.
 */
export const beforeAfter = {
  before: {
    src: media.results.timberBefore,
    alt: "Timber floor before cleaning, covered in dirt, debris and scuff marks",
  },
  after: {
    src: media.results.timberAfter,
    alt: "The same timber floor after cleaning, clean and polished",
  },
};

/**
 * Single finished-result shots, one per card — not before/after pairs. The
 * slider above already tells the before/after story; these are proof-of-work.
 * `image` may also be a video file (g4), which ImageSlot renders as a loop.
 */
export type GalleryItem = {
  id: string;
  caption: string;
  /** Placeholder caption, shown until `image` is set. */
  label: string;
  /** From `media` — an image, or a video URL to loop. */
  image?: string;
  alt?: string;
  /**
   * Set this to turn the card into a self-sweeping before/after: `beforeImage`
   * is the grimy shot and `image` becomes the finished one. Needs a matched pair
   * (same framing and aspect ratio) or they will not line up.
   */
  beforeImage?: string;
  beforeAlt?: string;
};

export const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    caption: "Strip and seal — commercial floor",
    label: "Strip & seal job",
    image: media.results.vctHallwayAfter,
    alt: "Glossy commercial corridor floor after a strip and seal",
    beforeImage: media.results.vctHallwayBefore,
    beforeAlt:
      "The same corridor before the strip and seal: yellowed vinyl tile with black scuff marks",
  },
  {
    id: "g2",
    caption: "Timber floor — cleaned and polished",
    label: "Timber floor job",
    image: media.results.floorboardsAfter,
    alt: "Restored timber floorboards with a clean, reflective finish",
    beforeImage: media.results.floorboardsBefore,
    beforeAlt:
      "The same timber floor before cleaning, covered in dirt, debris and scuff marks",
  },
  {
    id: "g3",
    caption: "Pressure wash — driveway",
    label: "Driveway job",
    image: media.results.drivewayAfter,
    alt: "Dirty driveway after pressure washing",
    beforeImage: media.results.drivewayBefore,
    beforeAlt:
      "The same driveway before pressure washing, covered in dirt and debris",
  },
  {
    id: "g4",
    caption: "Video — Driveway pressure washing",
    label: "VIDEO — 20s job clip",
    image: media.video.jobClip,
    alt: "A rotary surface cleaner run across concrete, leaving a clean strip behind",
  },
];

export const faqs = [
  {
    q: "Which areas do you cover?",
    a: "Brisbane, the Gold Coast, Ipswich, Logan and the Sunshine Coast — homes and commercial properties in all five. If you are not sure whether your suburb is in range, send it to us on WhatsApp and we will confirm before you book.",
  },
  {
    q: "What floor cleaning services do you offer?",
    a: "Tile and grout cleaning, carpet cleaning, hardwood and vinyl floor cleaning, stone floor cleaning, floor sealing and floor restoration — for homes and commercial properties, across Brisbane, the Gold Coast, Ipswich, Logan and the Sunshine Coast.",
  },
  {
    q: "How often should floors be professionally cleaned?",
    a: "It depends on foot traffic, pets, children and the flooring type. Most homes benefit from a professional clean every 6–12 months; commercial properties usually need it more often.",
  },
  {
    q: "Is it safe for children and pets?",
    a: "Yes. Wherever possible we use professional-grade, environmentally responsible products, and our methods are designed to be safe for families, children, pets and employees.",
  },
  {
    q: "How long does it take to dry?",
    a: "Drying times vary with flooring type, humidity and method. Most carpets dry within 4–8 hours; hard floors are usually ready to use much sooner.",
  },
  {
    q: "Do you clean commercial properties?",
    a: "Yes — offices, retail, medical facilities, schools, restaurants, hotels and industrial premises across Brisbane, the Gold Coast, Ipswich, Logan and the Sunshine Coast.",
  },
  {
    q: "What are the benefits of professional floor cleaning?",
    a: "It improves appearance, extends the life of your floors, removes allergens and bacteria, and improves indoor air quality. Regular maintenance also reduces long-term repair costs.",
  },
];

/**
 * Picking this one reveals a free-text field, so an enquiry that isn't on the
 * list still comes through described in the customer's own words.
 */
export const OTHER_SERVICE = "Something else";

export const serviceChoices = [
  "Carpet cleaning",
  "Tile & grout",
  "Floor scrubbing",
  "Pressure wash",
  "Windows",
  "Graffiti removal",
  OTHER_SERVICE,
  "Not sure yet",
];

export const timingChoices = ["Weekdays", "Weekends", "Either"];

/** Root-relative so the shared header works from the service pages too. */
export const navLinks = [
  { href: "/#services", label: "Services" },
  { href: "/#results", label: "Results" },
  { href: "/#areas", label: "Areas" },
  { href: "/#about", label: "About" },
  { href: "/#faq", label: "FAQs" },
  { href: "/#contact", label: "Contact" },
];
