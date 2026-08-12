/**
 * Renders one structured-data block. The content is built at build time from
 * lib/site.ts and lib/seo.ts — no user input reaches it, which is what makes
 * dangerouslySetInnerHTML the right call here (JSON-LD must not be escaped).
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
