/**
 * Structured data and canonical-URL helpers.
 *
 * Everything is emitted as one `@graph` per page with stable `@id`s, so the
 * business, the website and the page-specific nodes reference each other instead
 * of repeating themselves. Google reads a graph far more reliably than several
 * disconnected script blocks, and it means the business only has to be described
 * once.
 *
 * Deliberately absent: `aggregateRating` and `review`. Review markup has to
 * reflect reviews genuinely collected and displayed on this site, and inventing a
 * rating is a policy violation that can cost every rich result the domain has.
 * Once real reviews exist, add them here — see the note in `businessNode`.
 */

import { cloudinaryPaths, media, socialCard } from "./media";
import { faqs, serviceAreas, services, site, type Service } from "./site";

export const BUSINESS_ID = `${site.url}/#business`;
export const WEBSITE_ID = `${site.url}/#website`;

/** Absolute URL for a root-relative path. Canonical tags must be absolute. */
export function absolute(path = "/") {
  return new URL(path, site.url).toString();
}

export const defaultSocialCard = socialCard(cloudinaryPaths.social);

/** Areas served, as schema.org City nodes — the field local search reads. */
const areaServed = serviceAreas.map((area) => ({
  "@type": "City",
  name: area.name,
  address: {
    "@type": "PostalAddress",
    addressRegion: site.address.region,
    addressCountry: site.address.country,
  },
}));

/**
 * The business itself. `@id` is referenced by every other node, so this object
 * is the single description of the company in the whole site's structured data.
 */
export const businessNode = {
  "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
  "@id": BUSINESS_ID,
  name: site.name,
  // No alternateName: the only one we had was the full name with "Services"
  // trimmed off, and declaring a truncation as a second trading name is worse
  // than declaring nothing. Add one here if the business genuinely has one.
  url: site.url,
  telephone: site.phone.e164,
  email: site.email,
  // Not a real currency claim — a broad band, which is all Google wants here.
  priceRange: "$$",
  currenciesAccepted: "AUD",
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    postalCode: site.address.postcode,
    addressCountry: site.address.country,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: site.geo.lat,
    longitude: site.geo.lon,
  },
  areaServed,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "07:00",
      closes: "21:00",
    },
  ],
  image: [
    defaultSocialCard,
    socialCard(cloudinaryPaths.glossyHallway),
    socialCard(cloudinaryPaths.cleanDriveway),
  ],
  logo: absolute(media.brand.logoBadge),
  sameAs: [site.social.facebook, site.social.instagram],
  // Every service, so Google can associate the business with each of them.
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Cleaning services",
    itemListElement: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        url: absolute(`/services/${service.slug}`),
      },
    })),
  },
  // TODO once reviews are genuinely collected and shown on the site: add
  // aggregateRating { ratingValue, reviewCount } and individual review nodes.
};

export const websiteNode = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: site.url,
  name: site.name,
  inLanguage: "en-AU",
  publisher: { "@id": BUSINESS_ID },
};

/** Every FAQ on the home page, as its own node rather than nested in the business. */
export const faqNode = {
  "@type": "FAQPage",
  "@id": `${site.url}/#faq`,
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export function breadcrumbNode(trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: step.name,
      item: absolute(step.path),
    })),
  };
}

export function serviceNode(service: Service) {
  return {
    "@type": "Service",
    "@id": `${absolute(`/services/${service.slug}`)}#service`,
    name: service.title,
    description: service.metaDescription,
    serviceType: service.title,
    url: absolute(`/services/${service.slug}`),
    image: socialCard(service.imagePath),
    provider: { "@id": BUSINESS_ID },
    areaServed,
    // The searches this page is actually answering, stated as data.
    additionalType: service.alsoKnownAs,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `What ${service.title} includes`,
      itemListElement: service.includes.map((item) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: item },
      })),
    },
  };
}

export function webPageNode({
  path,
  name,
  description,
}: {
  path: string;
  name: string;
  description: string;
}) {
  return {
    "@type": "WebPage",
    "@id": `${absolute(path)}#webpage`,
    url: absolute(path),
    name,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": BUSINESS_ID },
    inLanguage: "en-AU",
  };
}

/** Wrap page nodes into the single script block a page emits. */
export function graph(nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
