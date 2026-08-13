import type { MetadataRoute } from "next";
import { absolute } from "@/lib/seo";
import { serviceAreas, services } from "@/lib/site";

/**
 * Generated from the same data the pages are built from, so a new service or
 * region appears in the sitemap the moment it exists — no second list to forget.
 *
 * `lastModified` uses build time. That is honest for a statically generated site:
 * every page really is regenerated on each deploy. Do not hand-write dates here;
 * a stale-but-specific date is worse than none.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: absolute("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    /*
      The commercial hub, at the same weight as a service page. It is hand-listed
      because it is a single fixed route rather than one of a generated set — if a
      second hub ever joins it, give them an array of their own rather than
      letting this list grow entry by entry.
    */
    {
      url: absolute("/commercial"),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    ...services.map((service) => ({
      url: absolute(`/services/${service.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...serviceAreas.map((area) => ({
      url: absolute(`/areas/${area.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
