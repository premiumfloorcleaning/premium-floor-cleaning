/**
 * The shape of a quote enquiry, and the one place its wording is defined.
 *
 * Both delivery paths format from here: the API route builds the email from it,
 * and the browser builds the pre-filled WhatsApp message from it. Keeping one
 * definition means the two never drift into saying different things.
 */

import { site, siteHost } from "./site";

/*
  Every message is signed with `siteHost`: a WhatsApp enquiry landing on the
  owner's phone otherwise looks identical to a cold message, with no way to tell
  a website lead apart from Facebook, a flyer or a referral.
*/

export type Quote = {
  name: string;
  phone: string;
  email: string;
  suburb: string;
  service: string;
  timing: string;
  message: string;
};

export const QUOTE_FIELD_LIMITS = {
  name: 120,
  phone: 40,
  email: 160,
  suburb: 120,
  // Roomy, because "Something else" sends the customer's own wording here.
  service: 200,
  timing: 40,
  message: 2000,
} as const satisfies Record<keyof Quote, number>;

/** Trim and cap a single field. Anything not a string becomes "". */
export function cleanField(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function toQuote(input: Record<string, unknown>): Quote {
  return {
    name: cleanField(input.name, QUOTE_FIELD_LIMITS.name),
    phone: cleanField(input.phone, QUOTE_FIELD_LIMITS.phone),
    email: cleanField(input.email, QUOTE_FIELD_LIMITS.email),
    suburb: cleanField(input.suburb, QUOTE_FIELD_LIMITS.suburb),
    service: cleanField(input.service, QUOTE_FIELD_LIMITS.service),
    timing: cleanField(input.timing, QUOTE_FIELD_LIMITS.timing),
    message: cleanField(input.message, QUOTE_FIELD_LIMITS.message),
  };
}

/** Rows shared by the email body and the WhatsApp message, in reading order. */
function rows(quote: Quote): [string, string][] {
  return (
    [
      ["Name", quote.name],
      ["Phone", quote.phone],
      ["Email", quote.email],
      ["Suburb", quote.suburb],
      ["Service", quote.service],
      ["Preferred time", quote.timing],
      ["Notes", quote.message],
    ] as [string, string][]
  ).filter(([, value]) => value !== "");
}

/**
 * The message the customer sends from their own WhatsApp.
 *
 * Written in the customer's voice, because it is genuinely their message leaving
 * their phone — a business-voiced "New quote request" header would read as odd in
 * their own sent items. One detail per line so it stays scannable on a phone, and
 * signed with the site it came from.
 *
 * Deliberately no *bold* markup: WhatsApp would render it once sent, but on
 * mobile the customer sees the raw asterisks in the compose box first, and
 * anything that looks like a glitch at the moment of sending costs leads.
 */
export function quoteAsWhatsAppText(quote: Quote): string {
  const details = rows(quote).map(([label, value]) => `${label}: ${value}`);

  return [
    `Hi ${site.name}, I’d like a free on-site quote.`,
    "",
    ...details,
    "",
    `Sent from the quote form on ${siteHost}`,
  ].join("\n");
}

/* The email rendering lives in lib/quoteEmail.ts — see renderQuoteEmail(). */
