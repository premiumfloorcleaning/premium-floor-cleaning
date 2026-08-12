/**
 * The lead-notification email: subject, HTML and plain-text, from one place.
 *
 * Written to email-client rules, not browser rules. Inbox renderers are roughly
 * a decade behind: no flexbox, no grid, no external or `<style>` CSS that can be
 * relied on, and margins are unreliable. So layout is nested tables with
 * `role="presentation"`, every style is inline, and spacing comes from cell
 * padding. It is verbose on purpose — the alternative is a template that
 * collapses in Outlook.
 *
 * There is deliberately no logo image. Most clients block remote images until
 * the reader clicks "show images", so a logo-led header would arrive broken more
 * often than not. A text wordmark always renders.
 */

import type { Quote } from "./quote";
import { site, siteHost } from "./site";

/* Pulled from globals.css so the email matches the site. */
const INK = "#0b2340";
const BONE = "#f5f2ec";
const BRASS = "#1e6fbf";
const MINT = "#e4edf7";
const TEXT = "#101b29";
const MUTED = "#5a6472";
const LINE = "#dcd8d0";
const WHATSAPP = "#1fa855";
/** --brass-lo. Mid brass on ink is close to unreadable; this is legible. */
const BRASS_LO = "#cfe2f7";
/** Bone at 70% over ink, pre-blended: Outlook does not support rgba(). */
const ON_INK_MUTED = "#afb4b8";

/**
 * Single quotes around "Segoe UI", not double.
 *
 * This whole stack gets interpolated into `style="..."` attributes. A double
 * quote in here closes the attribute early, and every declaration after it —
 * colour, text-decoration, the lot — is thrown away by the parser. The symptom
 * is subtle and only visible in a real client: dark text on the dark header, and
 * buttons rendering as default underlined blue links.
 */
const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/*
  Guard against the mistake that already bit this file once. Every constant above
  is interpolated into a `style="..."` attribute; a double quote in any of them
  closes the attribute early and silently discards every declaration after it —
  which renders as unstyled text and default blue underlined links, and is only
  visible in a real inbox. Checked at module load, so it fails on the first
  request rather than in someone's email.
*/
for (const [name, value] of Object.entries({
  FONT,
  INK,
  BONE,
  BRASS,
  BRASS_LO,
  MINT,
  TEXT,
  MUTED,
  LINE,
  WHATSAPP,
  ON_INK_MUTED,
})) {
  if (value.includes('"')) {
    throw new Error(
      `quoteEmail: ${name} contains a double quote, which would break every style attribute it appears in. Use single quotes.`,
    );
  }
}

/**
 * Digits suitable for a `tel:` or `wa.me` link.
 *
 * An explicit `+` is trusted as already carrying a country code. A leading 0 is
 * treated as an Australian local number and swapped for 61 — which is the case
 * for virtually every number typed into this form. Anything else is passed
 * through as typed rather than guessed at.
 */
function dialDigits(phone: string): string | null {
  const raw = phone.trim();
  const digits = raw.replace(/\D/g, "");
  if (digits === "") return null;
  if (raw.startsWith("+")) return digits;
  if (digits.startsWith("0")) return `61${digits.slice(1)}`;
  return digits;
}

function receivedAtLabel(at: Date): string {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Australia/Brisbane",
  }).format(at);
}

/** Every field, in reading order. Blanks are shown, not dropped. */
function detailRows(quote: Quote): { label: string; value: string }[] {
  return [
    { label: "Name", value: quote.name },
    { label: "Phone", value: quote.phone },
    { label: "Email", value: quote.email },
    { label: "Suburb", value: quote.suburb },
    { label: "Service needed", value: quote.service },
    { label: "Preferred time", value: quote.timing },
  ];
}

/** A table-based button. The only kind that survives Outlook. */
function button(href: string, label: string, background: string): string {
  return [
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-block;margin:0 8px 8px 0">',
    "<tr><td",
    ` bgcolor="${background}" style="border-radius:6px;padding:13px 22px;text-align:center">`,
    `<a href="${href}" style="font-family:${FONT};font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;display:inline-block">${escapeHtml(label)}</a>`,
    "</td></tr></table>",
  ].join("");
}

export type RenderedEmail = { subject: string; html: string; text: string };

export function renderQuoteEmail(quote: Quote, at: Date): RenderedEmail {
  const where = quote.suburb ? `, ${quote.suburb}` : "";
  const subject = `New enquiry: ${quote.name} — ${quote.service || "cleaning"}${where}`;

  const dial = dialDigits(quote.phone);
  const received = receivedAtLabel(at);

  /*
    Preheader: the grey line an inbox shows next to the subject. Without one,
    clients scrape the first visible text, which would be the wordmark. The
    trailing whitespace stops later body copy being pulled in after it.
  */
  const preheader = [quote.phone, quote.timing, quote.message]
    .filter((part) => part !== "")
    .join(" · ");

  const rowsHtml = detailRows(quote)
    .map(({ label, value }, index) => {
      const border = index === 0 ? "none" : `1px solid ${LINE}`;
      const shown = value
        ? `<span style="color:${TEXT};font-weight:600">${escapeHtml(value)}</span>`
        : `<span style="color:${MUTED};font-style:italic">Not provided</span>`;
      return [
        "<tr>",
        `<td style="padding:12px 16px 12px 0;border-top:${border};font-family:${FONT};font-size:13px;color:${MUTED};white-space:nowrap;vertical-align:top">${label}</td>`,
        `<td style="padding:12px 0;border-top:${border};font-family:${FONT};font-size:15px;line-height:1.5;vertical-align:top">${shown}</td>`,
        "</tr>",
      ].join("");
    })
    .join("");

  const actions = [
    dial ? button(`tel:+${dial}`, `Call ${quote.phone}`, INK) : "",
    dial ? button(`https://wa.me/${dial}`, "WhatsApp them", WHATSAPP) : "",
    quote.email ? button(`mailto:${quote.email}`, "Email them", BRASS) : "",
  ]
    .filter((part) => part !== "")
    .join("");

  /*
    Line breaks become <br> rather than relying on white-space:pre-wrap, which
    Outlook ignores — it would run a multi-paragraph note together into one block.
    Escaped first, so the <br> we insert is the only markup that survives.
  */
  const notesHtml = quote.message
    ? `<div style="font-family:${FONT};font-size:15px;line-height:1.65;color:${TEXT}">${escapeHtml(
        quote.message,
      ).replace(/\r?\n/g, "<br>")}</div>`
    : `<div style="font-family:${FONT};font-size:15px;color:${MUTED};font-style:italic">No additional notes.</div>`;

  const html = [
    '<!doctype html><html lang="en-AU"><head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    `<title>${escapeHtml(subject)}</title>`,
    "</head>",
    `<body style="margin:0;padding:0;background:${BONE};-webkit-text-size-adjust:100%">`,

    `<div style="display:none;font-size:1px;color:${BONE};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">${escapeHtml(preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>`,

    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BONE}">`,
    '<tr><td align="center" style="padding:24px 12px">',
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:100%;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden">',

    // Header
    `<tr><td bgcolor="${INK}" style="padding:26px 28px">`,
    `<div style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:${BRASS_LO}">${escapeHtml(site.name)}</div>`,
    `<div style="font-family:${FONT};font-size:24px;font-weight:700;color:${BONE};padding-top:8px">New quote request</div>`,
    `<div style="font-family:${FONT};font-size:13px;color:${ON_INK_MUTED};padding-top:6px">${escapeHtml(received)}</div>`,
    "</td></tr>",

    // Headline + actions
    '<tr><td style="padding:28px 28px 4px">',
    `<div style="font-family:${FONT};font-size:19px;font-weight:700;color:${TEXT};padding-bottom:4px">${escapeHtml(quote.name)} wants a quote for ${escapeHtml(quote.service || "cleaning")}.</div>`,
    `<div style="font-family:${FONT};font-size:14px;color:${MUTED};padding-bottom:18px">Aim to reply within 10 minutes.</div>`,
    actions,
    "</td></tr>",

    // Details
    '<tr><td style="padding:16px 28px 0">',
    `<div style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${MUTED};padding-bottom:4px">Their details</div>`,
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">',
    rowsHtml,
    "</table></td></tr>",

    // Notes
    '<tr><td style="padding:24px 28px 0">',
    `<div style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${MUTED};padding-bottom:10px">Notes from the customer</div>`,
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${MINT};border-radius:8px">`,
    `<tr><td style="padding:16px 18px">${notesHtml}</td></tr>`,
    "</table></td></tr>",

    // Footer
    '<tr><td style="padding:26px 28px 30px">',
    `<div style="border-top:1px solid ${LINE};padding-top:16px;font-family:${FONT};font-size:12px;line-height:1.6;color:${MUTED}">`,
    `Sent from the quote form on <a href="${site.url}" style="color:${BRASS}">${escapeHtml(siteHost)}</a>.`,
    quote.email
      ? " Replying to this email goes straight to the customer."
      : " They did not leave an email address, so reply by phone.",
    "</div></td></tr>",

    "</table></td></tr></table></body></html>",
  ].join("");

  const text = [
    `NEW QUOTE REQUEST — ${site.name}`,
    received,
    "",
    `${quote.name} wants a quote for ${quote.service || "cleaning"}.`,
    "",
    ...detailRows(quote).map(
      ({ label, value }) => `${label}: ${value || "(not provided)"}`,
    ),
    "",
    "Notes from the customer:",
    quote.message || "(none)",
    "",
    ...(dial ? [`Call: +${dial}`, `WhatsApp: https://wa.me/${dial}`] : []),
    ...(quote.email ? [`Email: ${quote.email}`] : []),
    "",
    `Sent from the quote form on ${siteHost}`,
  ].join("\n");

  return { subject, html, text };
}
