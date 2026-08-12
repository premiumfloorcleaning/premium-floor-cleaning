import { NextResponse } from "next/server";
import { toQuote, type Quote } from "@/lib/quote";
import { renderQuoteEmail } from "@/lib/quoteEmail";

/**
 * Delivers a quote enquiry by email through Resend's REST API — called with
 * fetch, so there is no SDK to install.
 *
 * There is deliberately no fallback when email is not configured. The previous
 * version logged the lead to the console and returned 200, which means a live
 * site silently swallowed every enquiry while telling the customer it had been
 * received. Losing a lead quietly is worse than showing an error: the form's
 * error state tells them to call or use WhatsApp instead, so the enquiry still
 * has somewhere to go.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

/** Absent and empty are the same thing here — an unset variable. */
function readEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim() !== "" ? value.trim() : undefined;
}

type MailConfig = { apiKey: string; to: string[]; from: string };

/**
 * All three or none. A half-configured mailer is a deployment mistake, and
 * guessing a default for the missing piece would send leads somewhere nobody is
 * watching — so it is reported rather than papered over.
 */
function mailConfig(): MailConfig | null {
  const apiKey = readEnv("RESEND_API_KEY");
  const to = readEnv("QUOTE_EMAIL_TO");
  const from = readEnv("QUOTE_EMAIL_FROM");

  if (!apiKey && !to && !from) return null;
  if (!apiKey || !to || !from) {
    const missing = [
      !apiKey && "RESEND_API_KEY",
      !to && "QUOTE_EMAIL_TO",
      !from && "QUOTE_EMAIL_FROM",
    ].filter(Boolean);
    throw new Error(`Quote email is half-configured. Missing: ${missing.join(", ")}`);
  }

  // Comma-separated, so a lead can go to the owner and the office at once.
  const recipients = to
    .split(",")
    .map((address) => address.trim())
    .filter((address) => address !== "");
  if (recipients.length === 0) {
    throw new Error("QUOTE_EMAIL_TO is set but contains no address.");
  }

  return { apiKey, to: recipients, from };
}

async function sendEmail(quote: Quote, config: MailConfig): Promise<void> {
  // Stamped here rather than in the template, so the time is the server's.
  const { subject, html, text } = renderQuoteEmail(quote, new Date());

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      // Charset stated explicitly so accented names and dashes survive.
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      from: config.from,
      to: config.to,
      // Hitting reply in the inbox answers the customer directly.
      ...(quote.email ? { reply_to: [quote.email] } : {}),
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend returned ${response.status}: ${detail.slice(0, 300)}`);
  }
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  /*
    Honeypot. The form renders a field no human can see; a bot that fills every
    input trips it. Answer 200 so the bot has nothing to learn from the response,
    but send nothing.
  */
  if (typeof payload.botField === "string" && payload.botField.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const quote = toQuote(payload);

  if (!quote.name || !quote.phone) {
    return NextResponse.json(
      { error: "Please give us your name and a phone number." },
      { status: 422 },
    );
  }
  // Enough digits to be dialable — catches slips, not deliberate nonsense.
  if ((quote.phone.match(/\d/g) ?? []).length < 8) {
    return NextResponse.json(
      { error: "That phone number looks incomplete." },
      { status: 422 },
    );
  }

  let config: MailConfig | null;
  try {
    config = mailConfig();
  } catch (error) {
    console.error("[quote] configuration error", error);
    return NextResponse.json(
      { error: "We couldn’t send that just now." },
      { status: 503 },
    );
  }

  if (!config) {
    console.error(
      "[quote] no delivery configured — set RESEND_API_KEY, QUOTE_EMAIL_TO and " +
        "QUOTE_EMAIL_FROM. Enquiry NOT delivered:",
      quote,
    );
    return NextResponse.json(
      { error: "Our form isn’t connected yet." },
      { status: 503 },
    );
  }

  try {
    await sendEmail(quote, config);
  } catch (error) {
    console.error("[quote] send failed", error);
    return NextResponse.json(
      { error: "We couldn’t send that just now." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
