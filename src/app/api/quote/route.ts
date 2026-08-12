import { NextResponse } from "next/server";

type QuoteRequest = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  suburb?: unknown;
  service?: unknown;
  timing?: unknown;
  message?: unknown;
};

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let payload: QuoteRequest;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const quote = {
    name: text(payload.name, 120),
    phone: text(payload.phone, 40),
    email: text(payload.email, 160),
    suburb: text(payload.suburb, 120),
    // Roomy, because "Something else" sends the customer's own wording here.
    service: text(payload.service, 200),
    timing: text(payload.timing, 40),
    message: text(payload.message, 2000),
  };

  if (!quote.name || !quote.phone) {
    return NextResponse.json(
      { error: "Name and phone are required" },
      { status: 422 },
    );
  }

  // The design has no backend. Wire this up to however leads should actually
  // land — transactional email, a CRM webhook, or a database write — and return
  // a non-2xx status on failure so the form surfaces its error state.
  console.info("[quote] new enquiry", quote);

  return NextResponse.json({ ok: true });
}
