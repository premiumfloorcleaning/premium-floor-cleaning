/**
 * Single source of truth for business details, service list, and FAQ copy.
 * All content here is lifted verbatim from the Claude Design source
 * "Premium Floor Cleaning Home.dc.html".
 *
 * Image and video URLs are not repeated here — they come from lib/media.ts.
 */

import { cloudinaryPaths, media } from "./media";

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
  /** The West End base. Feeds LocalBusiness.geo, which local search relies on. */
  geo: { lat: -27.4826, lon: 153.0068 },
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
    /**
     * "Larger map" escape hatch from the coverage map, which is a static image
     * and cannot be panned. The coverage map's own extent is derived from the
     * `map` field on each service area, not from a bbox here.
     */
    coverageLarge: "https://www.openstreetmap.org/#map=9/-27.30/153.10",
  },
} as const;

/**
 * Business WhatsApp — every wa.me link on the site is built from this.
 *
 * The same line as the call/text number, so it is derived from `phone.e164`
 * rather than typed out a second time and left to drift. wa.me wants digits
 * only, with no leading plus. If WhatsApp ever moves to its own number, replace
 * this with that number's digits.
 */
const WHATSAPP_NUMBER = site.phone.e164.replace(/\D/g, "");

export function whatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Bare host, derived so it follows `site.url` if the domain ever changes.
 * Shared with lib/quote.ts, which signs the form's own message with it.
 */
export const siteHost = new URL(site.url).host;

/**
 * Presets for the plain "message us" buttons — the quote form builds a fuller
 * message of its own (see quoteAsWhatsAppText in lib/quote.ts).
 *
 * Each opens with the full business name and closes with the site it came from,
 * so an enquiry arriving on the owner's phone is immediately distinguishable from
 * a cold message, and from a Facebook or flyer lead. The signature goes last so
 * the customer's cursor lands after it and anything they type reads naturally.
 */
function enquiryLink(opening: string): string {
  return whatsAppLink(`Hi ${site.name}, ${opening}\n\nSent from ${siteHost}`);
}

export const waQuoteLink = enquiryLink("I’d like a free on-site quote.");
export const waQuestionLink = enquiryLink("I have a question.");
export const waAreaLink = enquiryLink("do you cover my suburb?");

/* ------------------------------------------------------------------
   Service areas — the five South East QLD regions we cover.
   Brisbane is the home base; the rest are listed in the order we
   travel to them most.
   ------------------------------------------------------------------ */

export type ServiceArea = {
  /** URL segment for the region's own landing page: /areas/<slug>. */
  slug: string;
  name: string;
  /** Representative suburbs, so visitors can place themselves quickly. */
  suburbs: string[];
  /** Short badge — used for the "home base" marker on Brisbane. */
  note?: string;
  /**
   * Landing-page copy. Every region needs its own — five pages sharing one
   * templated paragraph with the place name swapped is exactly what Google
   * classes as a doorway page, and it will suppress all five.
   */
  intro: string;
  /** What we actually get called out for in this region, in plain terms. */
  local: string[];
  /** The region itself — a shot of the city, not of a finished job. */
  image: string;
  /** Cloudinary path for the same photo, so the page can build its share card. */
  imagePath: string;
  /**
   * Drives the coverage map. `radiusKm` is how far out we travel from that
   * centre, and the five circles are drawn as one shaded region — so the radii
   * have to overlap or the coverage area renders as disconnected islands.
   * `labelSide` keeps each label inside the frame and clear of its neighbours.
   */
  map: {
    lat: number;
    lon: number;
    radiusKm: number;
    labelSide: "left" | "right";
  };
};

/** Brisbane leads the list: it is the home base. */
export const serviceAreas: ServiceArea[] = [
  {
    slug: "brisbane",
    name: "Brisbane",
    suburbs: ["West End", "New Farm", "Chermside", "Indooroopilly", "Carindale"],
    note: "Home base",
    image: media.areas.brisbane,
    imagePath: cloudinaryPaths.brisbane,
    intro:
      "We are based in West End, so Brisbane is the work we do most and the work we get to fastest. Inner-city Queenslanders come with original hardwood that has been sanded thin, and the apartment towers along the river are almost all tile and grout. Both need a different approach to a suburban carpet clean, and we carry the gear for all three in the one van.",
    local: [
      "Original hardwood in pre-war Queenslanders, cleaned without stripping what is left of the timber",
      "Tile and grout in river-side apartment blocks, including balcony tiles that have gone green",
      "Office and retail floors in the CBD and Fortitude Valley, scheduled after hours",
    ],
    // 50km reaches Caboolture north, Beenleigh south and out past Ipswich.
    map: { lat: -27.4698, lon: 153.0251, radiusKm: 50, labelSide: "right" },
  },
  {
    slug: "gold-coast",
    name: "Gold Coast",
    suburbs: ["Southport", "Surfers Paradise", "Broadbeach", "Robina", "Coomera"],
    image: media.areas.goldCoast,
    imagePath: cloudinaryPaths.goldCoast,
    intro:
      "Salt air is the difference on the Gold Coast. Balcony tiles, glass balustrades and pool surrounds pick up a salt film that ordinary cleaning smears rather than removes, and holiday lets need turning around between guests rather than on a leisurely weekday. We work weekends here as a matter of course.",
    local: [
      "Salt film on balcony glass, balustrades and window tracks in high-rise apartments",
      "Pool surrounds and pavers where mould takes hold in the shaded sections",
      "Holiday-let and short-stay turnarounds, including carpet that has to be dry before check-in",
    ],
    // Centred on Southport. Label sits left, or it runs off the frame.
    map: { lat: -27.9676, lon: 153.4, radiusKm: 35, labelSide: "left" },
  },
  {
    slug: "ipswich",
    name: "Ipswich",
    suburbs: ["Springfield Lakes", "Ripley", "Booval", "Goodna", "Karalee"],
    image: media.areas.ipswich,
    imagePath: cloudinaryPaths.ipswich,
    intro:
      "Ipswich blocks are bigger, which means more concrete: driveways, paths, sheds and patios that have gone black with mould and lichen. Older homes around Booval and Goodna often have decades of build-up in the grout and lino that has never been machine scrubbed. Newer estates out at Ripley and Springfield Lakes are mostly tile and light-coloured grout, which shows every mark.",
    local: [
      "Long driveways, paths and shed slabs pressure washed in one visit",
      "Decades of build-up in grout and old vinyl in the established suburbs",
      "Light grout in the newer Ripley and Springfield estates, brought back to its original colour",
    ],
    map: { lat: -27.6146, lon: 152.7605, radiusKm: 30, labelSide: "right" },
  },
  {
    slug: "logan",
    name: "Logan",
    suburbs: ["Springwood", "Shailer Park", "Browns Plains", "Beenleigh", "Marsden"],
    image: media.areas.logan,
    imagePath: cloudinaryPaths.logan,
    intro:
      "Logan is family homes and a lot of rentals, so most of what we do here is carpet: pet stains, traffic lanes through the middle of the house, and end-of-lease cleans where the agent has a checklist and a deadline. We give you the written record of the clean, which is usually what the property manager actually wants.",
    local: [
      "End-of-lease carpet cleans, with before-and-after photos for the property manager",
      "Pet stains and odour treated at the underlay, not just the surface fibre",
      "Traffic lanes and entryways in family homes, plus the tiled wet areas at the same visit",
    ],
    map: { lat: -27.6392, lon: 153.1093, radiusKm: 25, labelSide: "right" },
  },
  {
    slug: "sunshine-coast",
    name: "Sunshine Coast",
    suburbs: ["Maroochydore", "Mooloolaba", "Caloundra", "Noosa", "Buderim"],
    image: media.areas.sunshineCoast,
    imagePath: cloudinaryPaths.sunshineCoast,
    intro:
      "Sand is the constant on the Sunshine Coast. It works into carpet backing and grout lines where a vacuum will never reach it, and it scratches timber and tile if it is left to sit. Add holiday homes that sit empty and then get used hard for a fortnight, and most jobs up here are either a deep reset or a turnaround between stays.",
    local: [
      "Sand worked out of carpet backing and grout lines by hot-water extraction",
      "Holiday-home resets after a season of being closed up",
      "Timber and tile in coastal homes where sand has been grinding at the finish",
    ],
    // Centred on Maroochydore. 42km is what joins this circle to Brisbane's;
    // drop it and the coverage area splits into two islands.
    map: { lat: -26.658, lon: 153.092, radiusKm: 42, labelSide: "right" },
  },
];

/** Look-up used by the /areas/[slug] route. */
export function findServiceArea(slug: string) {
  return serviceAreas.find((area) => area.slug === slug);
}

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
  /** Cloudinary path for the same photo, so the page can build its share card. */
  imagePath: string;
  /** Placeholder caption shown until a real photo is dropped into the slot. */
  imageLabel: string;
  /**
   * A page that is a heading, one sentence and a photo has nothing to rank. Each
   * service needs its own body copy, its own list of what the job covers, and
   * its own search-facing title and description.
   */
  metaTitle: string;
  metaDescription: string;
  body: string[];
  /** What the job actually includes — rendered as a checklist. */
  includes: string[];
  /**
   * The same job in order, start to finish.
   *
   * `includes` answers "what do I get"; this answers "what happens on the day",
   * which is the question most people are actually asking when they ring up. It
   * is the one thing a quote cannot show them in advance, so it belongs on the
   * page — five short steps, no jargon, no upsell.
   */
  process: { title: string; body: string }[];
  /** Terms real people type. Drives the on-page copy, not a meta keywords tag. */
  alsoKnownAs: string[];
};

export const services: Service[] = [
  {
    slug: "floor-scrubbing-acid-washing",
    title: "Floor Scrubbing & Acid Washing",
    blurb:
      "Ground-in dirt, oil marks and dull concrete brought back to an even, clean finish.",
    image: media.services.floorScrubbing,
    imagePath: "v1786529699/floor_scrubing.png",
    imageLabel: "Floor scrubbing",
    metaTitle: "Floor Scrubbing & Acid Washing Brisbane, Gold Coast & SE QLD",
    metaDescription:
      "Machine floor scrubbing and acid washing for concrete, vinyl and sealed floors. Oil marks, ground-in dirt and dull patches evened out. Free on-site quote, fixed price.",
    body: [
      "A mop pushes dirt around a floor; it does not lift what has worked into the surface. We use a weighted rotary machine with the pad and chemical matched to the floor, then extract the slurry rather than leaving it to dry back into the concrete. That is the whole difference between a floor that looks wet-clean for an hour and one that stays even.",
      "Acid washing is for the jobs scrubbing alone will not shift — mineral deposits, efflorescence, rust bleed and the grey film left on new concrete. It is a controlled process and the wrong dilution will etch a floor permanently, which is why we test a section first and tell you what will and will not come up before we start.",
      "Common on warehouse and workshop slabs, garage floors, driveways, commercial kitchens, and the polished or sealed concrete in newer homes. If your floor is stained rather than dirty, we will say so at the quote instead of charging you to find out.",
    ],
    includes: [
      "Surface test on an out-of-the-way section before any chemical goes down",
      "Weighted rotary scrub with the pad and dilution matched to your floor",
      "Slurry extracted, not left to dry back into the surface",
      "Oil and grease spots pre-treated separately",
      "Edges and corners done by hand where the machine cannot reach",
      "Walk-through with you before we pack up",
    ],
    process: [
      {
        title: "We come and look",
        body: "We check the floor and tell you what will and won’t come out.",
      },
      {
        title: "Small test patch",
        body: "We clean a hidden corner first, so you can see the result.",
      },
      {
        title: "Area protected",
        body: "Loose items moved, skirtings and drains covered before we start.",
      },
      {
        title: "Machine scrub",
        body: "A heavy rotary machine does the work — not a mop.",
      },
      {
        title: "Dirty water out",
        body: "We vacuum it up, then walk the floor with you.",
      },
    ],
    alsoKnownAs: [
      "concrete cleaning",
      "garage floor cleaning",
      "warehouse floor scrubbing",
      "commercial floor cleaning",
    ],
  },
  {
    slug: "tile-cleaning-grout-removal",
    title: "Tile Cleaning & Grout Removal",
    blurb:
      "Dark grout lines and stained tiles in kitchens, bathrooms and entryways restored.",
    image: media.services.tileCleaning,
    imagePath: "v1786529693/tile_cleaning.png",
    imageLabel: "Tile & grout",
    metaTitle: "Tile & Grout Cleaning Brisbane, Gold Coast, Ipswich & Logan",
    metaDescription:
      "Professional tile and grout cleaning. Dark grout lines, mould in wet areas and stained tiles brought back. Sealing available. Free on-site quote, fixed price before we start.",
    body: [
      "Grout is porous, so it holds everything the tile sheds — grease in a kitchen, soap and body oil in a shower, tracked-in grit at an entryway. Once it is in there, a scrubbing brush and supermarket cleaner will not reach it. We use a high-pressure hot-water tool that works the grout line and vacuums the dirty water straight off the floor in the same pass.",
      "Where grout has failed rather than just discoloured — crumbling, cracked or missing — cleaning is not the fix. We will tell you that, and where it makes sense we remove the failed grout and re-grout the affected lines so the wet area is actually sealed again.",
      "Sealing after cleaning is worth it in a shower or a busy entry: it buys you a couple of years before the grout starts holding dirt again. We will price it as an option rather than folding it in without asking.",
    ],
    includes: [
      "Hot-water high-pressure grout tool with same-pass extraction",
      "Mould and soap scum treated in showers and wet areas",
      "Silicone and grout condition checked and reported",
      "Failed grout removed and replaced where needed",
      "Optional penetrating sealer, quoted separately",
      "Skirtings and cabinet kicks protected before we start",
    ],
    process: [
      {
        title: "We check the grout",
        body: "We tell you whether it needs cleaning or replacing.",
      },
      {
        title: "Area protected",
        body: "Skirtings and doorways covered before anything gets wet.",
      },
      {
        title: "Cleaner goes on",
        body: "Mould, soap scum and grease get time to soften first.",
      },
      {
        title: "Hot water, high pressure",
        body: "The tool cleans each grout line and sucks the dirty water up.",
      },
      {
        title: "Sealed and checked",
        body: "Sealer if you want it, then we walk the floor with you.",
      },
    ],
    alsoKnownAs: [
      "grout cleaning",
      "bathroom tile cleaning",
      "shower mould removal",
      "grout sealing",
      "regrouting",
    ],
  },
  {
    slug: "carpet-cleaning",
    title: "Carpet Cleaning",
    blurb:
      "Deep steam extraction that lifts stains, smells and allergens. Dry in about 4–8 hours.",
    image: media.services.carpetCleaning,
    imagePath: "v1786529704/carpet_cleaning.png",
    imageLabel: "Carpet cleaning",
    metaTitle: "Carpet Cleaning Brisbane, Logan, Gold Coast & Sunshine Coast",
    metaDescription:
      "Hot-water extraction carpet cleaning for homes, rentals and offices. Pet stains, odours and traffic lanes treated. Dry in about 4–8 hours. End-of-lease reports available.",
    body: [
      "Hot-water extraction — what most people call steam cleaning — is the method carpet manufacturers specify, and it is the only one that removes soil rather than redistributing it. We pre-spray, agitate the pile so the solution reaches the base of the fibre, then extract with enough vacuum that the carpet is damp rather than wet. That is what gets you a 4–8 hour dry time instead of two days of damp underlay.",
      "Pet stains are a different job to dirt. Urine soaks past the fibre into the backing and the underlay, and surface cleaning simply moves the smell around. We treat at the level the contamination actually sits at, and we will tell you honestly if it has gone far enough that the underlay needs replacing.",
      "For end-of-lease cleans we photograph before and after and give you the record in writing, because that is usually what the property manager wants to see before they sign off the bond.",
    ],
    includes: [
      "Pre-inspection, with anything unlikely to lift pointed out first",
      "Pre-spray and mechanical agitation before extraction",
      "Spot treatment for pet, food, ink and tannin stains",
      "Deodorising and anti-microbial treatment where it is needed",
      "Furniture moved and protected, blocks under legs while it dries",
      "Before-and-after photos, and a written record for end-of-lease",
    ],
    process: [
      {
        title: "We look at the carpet",
        body: "We point out anything that might not come out.",
      },
      {
        title: "Furniture moved",
        body: "We shift what we safely can and put blocks under the legs.",
      },
      {
        title: "Pre-spray",
        body: "Cleaner goes on and we work it down into the pile.",
      },
      {
        title: "Steam and extract",
        body: "Hot water in, dirt out. Dry in about 4–8 hours.",
      },
      {
        title: "Stains and photos",
        body: "Spots treated, plus before-and-after photos if you need them.",
      },
    ],
    alsoKnownAs: [
      "steam cleaning",
      "carpet steam cleaning",
      "end of lease carpet cleaning",
      "bond clean carpet",
      "pet stain removal",
      "rug cleaning",
    ],
  },
  {
    slug: "pressure-wash",
    title: "Pressure Wash",
    blurb:
      "Driveways, paths, patios and pool surrounds — mould, moss and black streaks gone.",
    image: media.services.pressureWashing,
    imagePath: "v1786529705/pressure_washing.png",
    imageLabel: "Pressure washing",
    metaTitle: "Pressure Washing Brisbane, Ipswich, Logan & Gold Coast",
    metaDescription:
      "Driveway, path, patio and pool-surround pressure washing across South East QLD. Mould, lichen and black streaks removed without striping the concrete. Free quote.",
    body: [
      "The mark of a bad pressure wash is stripes — the tell that someone waved a turbo nozzle at a slab freehand. We run a rotary surface cleaner, which holds a fixed distance and overlaps its own path, so the finish is even across the whole area. Hard-to-reach edges and detail get the wand, at a pressure chosen for the surface.",
      "Most of what looks like dirt on Queensland concrete is biological: mould, algae and lichen feeding on moisture in the shade. Pressure alone knocks the top off and it returns within months. We apply a treatment that kills it at the root first, which is why our work stays clean noticeably longer.",
      "Pressure has to suit the surface. Full pressure will destroy sandstone, strip render, force water behind cladding and blow the sand out of paver joints. We drop the pressure and change the method for those, and re-sand paver joints afterwards where they need it.",
    ],
    includes: [
      "Biological treatment applied first, so growth is killed not just knocked back",
      "Rotary surface cleaner for even coverage, no stripes",
      "Pressure and method matched to concrete, pavers, sandstone, render or timber",
      "Gutters, garden beds and downpipes considered before we start",
      "Paver joints re-sanded where washing has opened them up",
      "Optional sealing on driveways and patios, quoted separately",
    ],
    process: [
      {
        title: "We check the surface",
        body: "Concrete, pavers and sandstone each need a different pressure.",
      },
      {
        title: "Mould treated",
        body: "We kill it first, so it doesn’t grow straight back.",
      },
      {
        title: "Area protected",
        body: "Garden beds, gutters and downpipes covered before we start.",
      },
      {
        title: "Even machine wash",
        body: "A rotary cleaner gives one even finish, with no stripes.",
      },
      {
        title: "Edges and joints",
        body: "Corners done by hand, and paver joints re-sanded.",
      },
    ],
    alsoKnownAs: [
      "driveway cleaning",
      "high pressure cleaning",
      "concrete cleaning",
      "patio cleaning",
      "house washing",
      "paver cleaning",
    ],
  },
  {
    slug: "windows-cleaning",
    title: "Windows Cleaning",
    blurb:
      "Inside and out, frames and tracks included. Streak-free glass and more daylight.",
    image: media.services.windowCleaning,
    imagePath: "v1786529693/window_cleaning.png",
    imageLabel: "Window cleaning",
    metaTitle: "Window Cleaning Brisbane, Gold Coast & Sunshine Coast",
    metaDescription:
      "Inside-and-out window cleaning with frames, tracks and sills included. Salt film on coastal glass, screens and flyscreens washed. Homes and commercial, 7 days.",
    body: [
      "Most window cleaning leaves the glass clean and everything around it dirty, so the first rain washes the frame down over the pane and you are back where you started. We do the tracks, frames and sills as part of the job, not as an extra.",
      "Coastal glass is its own problem. Salt bonds to the surface and a normal wash smears it into a haze, particularly on balustrades and pool fencing on the Gold Coast and Sunshine Coast. That needs a different solution and more dwell time, which is what stops it drying back to a film.",
      "We use purified water and a squeegee finish on reachable glass and a water-fed pole for height, so there is nothing left behind to dry into spots. Where hard-water staining has already etched the glass we will tell you what will improve and what is permanent before you pay for it.",
    ],
    includes: [
      "Inside and outside glass, unless you only want one",
      "Frames, tracks and sills wiped out as part of the job",
      "Flyscreens removed, washed and refitted",
      "Purified water and squeegee finish — no drying spots",
      "Water-fed pole for upper storeys, no ladders against your render",
      "Salt film and hard-water staining assessed and reported honestly",
    ],
    process: [
      {
        title: "We count the glass",
        body: "We agree what’s included, inside and out.",
      },
      {
        title: "Screens off",
        body: "Washed separately, so they can’t dirty the glass again.",
      },
      {
        title: "Frames and tracks",
        body: "Done first, or the next rain washes them over the glass.",
      },
      {
        title: "Glass washed",
        body: "Purified water and a squeegee. Poles upstairs, no ladders.",
      },
      {
        title: "Screens back on",
        body: "We check every pane in the light before we leave.",
      },
    ],
    alsoKnownAs: [
      "window washing",
      "glass cleaning",
      "flyscreen cleaning",
      "commercial window cleaning",
    ],
  },
  {
    slug: "graffiti-removal",
    title: "Graffiti Removal",
    blurb:
      "Paint and tags removed from brick, render, fences and roller doors without damage.",
    image: media.services.graffitiRemoval,
    imagePath: "v1786530011/graffiti_removal.png",
    imageLabel: "Graffiti removal",
    metaTitle: "Graffiti Removal Brisbane, Logan, Ipswich & Gold Coast",
    metaDescription:
      "Graffiti and tag removal from brick, render, concrete, fences and roller doors. Substrate-safe methods, anti-graffiti coating available. Fast response, 7 days.",
    body: [
      "Speed matters with graffiti, for two reasons: fresh paint has not fully cured into the substrate and comes off far more completely, and a tag that stays up attracts more. We work seven days for this one and prioritise it accordingly.",
      "The substrate decides the method. Sealed or painted surfaces and roller doors usually take a solvent gel and a low-pressure rinse. Porous brick, block and unsealed concrete have absorbed pigment below the surface, which needs a poultice that draws it back out — pressure alone on porous brick just blasts the face off the masonry and leaves a permanent light patch that looks worse than the tag.",
      "Where a surface has been hit repeatedly, an anti-graffiti coating is worth costing. It gives you a sacrificial layer, so the next tag washes off in minutes rather than needing us back out.",
      "We work for body corporates, schools, councils and business owners, and we can invoice on account if you need repeat call-outs handled without a purchase order each time.",
    ],
    includes: [
      "Substrate identified before any product is used",
      "Solvent gel and low-pressure rinse on sealed surfaces and roller doors",
      "Poultice extraction on porous brick, block and unsealed concrete",
      "Test patch on anything we have not seen before",
      "Anti-graffiti sacrificial coating, quoted as an option",
      "Photo record for insurance, council or body corporate reporting",
    ],
    process: [
      {
        title: "We check the surface",
        body: "Brick, render and roller doors each need a different method.",
      },
      {
        title: "Test patch",
        body: "Tried out of sight first, before we touch the tag.",
      },
      {
        title: "Paint lifted",
        body: "Gel on sealed surfaces, a poultice to draw it out of brick.",
      },
      {
        title: "Rinsed and checked",
        body: "A second pass on anything the first one left behind.",
      },
      {
        title: "Photos and coating",
        body: "Photos for your records, plus a coating if it keeps happening.",
      },
    ],
    alsoKnownAs: [
      "tag removal",
      "paint removal",
      "anti graffiti coating",
      "graffiti cleaning",
    ],
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
  {
    q: "How much does professional cleaning cost?",
    a: "We quote on the actual surface rather than over the phone, because two rooms of the same size can be very different jobs. The on-site quote is free and the price we give you is fixed before we start — no hourly rate that grows, and no extras added afterwards. For a rough idea beforehand, send us a photo on WhatsApp and we will estimate from that.",
  },
  {
    q: "Do you do end-of-lease and bond cleans?",
    a: "Yes. We clean carpets and hard floors for end-of-lease, and we photograph the work before and after so you have a written record for the property manager. Tell us the inspection date when you book and we will work to it.",
  },
  {
    q: "Do you move the furniture?",
    a: "We move what two people can safely move and put protective blocks under the legs while the floor dries. We do not move pianos, full display cabinets, beds with storage bases, or anything electrical still connected. If a room needs to be cleared, tell us at the quote and we will factor it in.",
  },
  {
    q: "Are you insured?",
    a: "Yes, we carry public liability insurance. If your body corporate, property manager or building manager needs a certificate of currency before we can access the property, ask and we will send it through.",
  },
  {
    q: "Do you work weekends and after hours?",
    a: "Yes — seven days, 7:00am to 9:00pm, weekends included at no extra charge. Commercial work is often easier after hours or overnight, and we schedule it that way where it suits the site.",
  },
  {
    q: "What if I am not happy with the result?",
    a: "We walk the job with you before we pack up, so anything that is not right gets dealt with while we are still there with the equipment out. If something shows up after we have left, call us and we will come back and look at it.",
  },
  {
    q: "How soon can you come out?",
    a: "Usually within a few days, and often sooner for smaller jobs or for graffiti, which we treat as urgent. We reply to enquiries in under 10 minutes on average during opening hours, so the quickest way to find out is to call or message us.",
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
