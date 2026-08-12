"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Check,
  Clipboard,
  Mail,
  Phone,
  Pin,
  WhatsApp,
} from "./Icons";
import { quoteAsWhatsAppText, toQuote } from "@/lib/quote";
import {
  OTHER_SERVICE,
  serviceAreas,
  serviceAreaSentence,
  serviceChoices,
  site,
  timingChoices,
  waQuoteLink,
  whatsAppLink,
} from "@/lib/site";
import styles from "./Contact.module.css";

type Status = "idle" | "sending" | "sent" | "error";

const DEFAULT_SERVICE = serviceChoices[0];
const DEFAULT_TIMING = "Either";
const GENERIC_ERROR = "That didn’t go through.";

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState(GENERIC_ERROR);
  const [service, setService] = useState(DEFAULT_SERVICE);
  const [customService, setCustomService] = useState("");
  const [timing, setTiming] = useState(DEFAULT_TIMING);

  const wantsCustom = service === OTHER_SERVICE;

  /** "Something else" is a prompt, not an answer — send what they typed. */
  function resolvedService() {
    return wantsCustom ? customService.trim() || OTHER_SERVICE : service;
  }

  function readForm(form: HTMLFormElement) {
    return toQuote({
      ...Object.fromEntries(new FormData(form).entries()),
      service: resolvedService(),
      timing,
    });
  }

  function resetForm(form: HTMLFormElement) {
    form.reset();
    // The chips are controlled, so reset() alone leaves them where they were.
    setService(DEFAULT_SERVICE);
    setCustomService("");
    setTiming(DEFAULT_TIMING);
  }

  /**
   * Hands the enquiry to WhatsApp on the visitor's own device, pre-filled. This
   * costs nothing and needs no API: their WhatsApp sends it to us. Built inside
   * the click handler so it runs on a real user gesture and the popup blocker
   * leaves it alone — an await before window.open would get it blocked.
   */
  function handleWhatsApp() {
    const form = formRef.current;
    if (!form) return;

    // Let the browser's own required-field messages do the work.
    if (!form.reportValidity()) return;

    const quote = readForm(form);
    window.open(
      whatsAppLink(quoteAsWhatsAppText(quote)),
      "_blank",
      "noopener,noreferrer",
    );
    setStatus("sent");
    resetForm(form);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const quote = readForm(form);
    const botField = new FormData(form).get("botField");

    setStatus("sending");
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...quote, botField }),
      });

      if (!response.ok) {
        // Surface what the server actually said; fall back to one generic line.
        const body = await response.json().catch(() => null);
        setErrorMessage(
          typeof body?.error === "string" ? body.error : GENERIC_ERROR,
        );
        setStatus("error");
        return;
      }

      setStatus("sent");
      resetForm(form);
    } catch {
      setErrorMessage(GENERIC_ERROR);
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="container section">
      <span className="eyebrow">Get in touch</span>
      <div className={styles.head}>
        <h2 className={styles.title}>Book your free on-site quote</h2>
        <p className={`lede ${styles.headNote}`}>
          {serviceAreaSentence}. Weekends included — we’ll confirm a time that
          suits you.
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.formCard}>
          {status === "sent" ? (
            <div className={styles.thanks}>
              <span className={`iconDot ${styles.thanksIcon}`}>
                <Check size={24} />
              </span>
              <h3 className={styles.thanksTitle}>Thanks — we’ve got it.</h3>
              <p className={styles.thanksBody}>
                We usually reply in under 10 minutes during opening hours. If you
                would rather talk it through now, give us a call.
              </p>

              {/*
                A way back to a blank form — for the second property, or the job
                they forgot to mention. Without it the only route back is a page
                reload. The fields were already cleared on success, so dropping to
                "idle" remounts the form empty.
              */}
              <div className={styles.thanksActions}>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className={styles.another}
                >
                  <Clipboard size={17} />
                  Add another enquiry
                </button>
                <a href={site.phone.href} className={styles.thanksCall}>
                  <Phone size={16} />
                  {site.phone.display}
                </a>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.formHead}>
                <span className={`iconDot ${styles.formHeadIcon}`}>
                  <Clipboard />
                </span>
                <div>
                  <h3 className={styles.formHeadTitle}>Tell us about the job</h3>
                  <p className={styles.formHeadNote}>
                    A few quick details and we’ll come out and price it. No
                    obligation.
                  </p>
                </div>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
                {/*
                  Honeypot: invisible to people, irresistible to bots that fill
                  every input. Positioned off-screen rather than display:none,
                  which the better scrapers check for.
                */}
                <input
                  type="text"
                  name="botField"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className={styles.honeypot}
                />
                <div className={styles.pair}>
                  <label className={styles.field}>
                    <span className={styles.label}>
                      Your name <span className={styles.required}>*</span>
                    </span>
                    <input
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="First and last name"
                      className={styles.input}
                    />
                  </label>
                  <label className={styles.field}>
                    <span className={styles.label}>
                      Phone <span className={styles.required}>*</span>
                    </span>
                    <input
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      required
                      autoComplete="tel"
                      placeholder="Best number to reach you"
                      className={styles.input}
                    />
                  </label>
                </div>

                <div className={styles.pair}>
                  <label className={styles.field}>
                    <span className={styles.label}>
                      Email <span className={styles.optional}>optional</span>
                    </span>
                    <input
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="you@email.com"
                      className={styles.input}
                    />
                  </label>
                  <label className={styles.field}>
                    <span className={styles.label}>
                      Suburb <span className={styles.optional}>optional</span>
                    </span>
                    <input
                      name="suburb"
                      type="text"
                      autoComplete="address-level2"
                      placeholder="Suburb or postcode"
                      className={styles.input}
                    />
                  </label>
                </div>

                <fieldset className={styles.fieldset}>
                  <legend className={styles.legend}>What needs cleaning?</legend>
                  <div className={styles.chips}>
                    {serviceChoices.map((choice) => (
                      <label key={choice} className={styles.chip}>
                        <input
                          type="radio"
                          name="service"
                          value={choice}
                          checked={service === choice}
                          onChange={() => setService(choice)}
                          className={styles.chipInput}
                        />
                        {choice}
                      </label>
                    ))}
                  </div>

                  {wantsCustom ? (
                    <label className={`${styles.field} ${styles.reveal}`}>
                      <span className={styles.label}>
                        What is it you need cleaned?{" "}
                        <span className={styles.required}>*</span>
                      </span>
                      <input
                        name="customService"
                        type="text"
                        required
                        value={customService}
                        onChange={(event) =>
                          setCustomService(event.target.value)
                        }
                        placeholder="e.g. warehouse floor line marking, roof wash, end-of-lease clean"
                        className={styles.input}
                      />
                    </label>
                  ) : null}
                </fieldset>

                <fieldset className={styles.fieldset}>
                  <legend className={styles.legend}>When suits you?</legend>
                  <div className={styles.chips}>
                    {timingChoices.map((choice) => (
                      <label key={choice} className={styles.chip}>
                        <input
                          type="radio"
                          name="timing"
                          value={choice}
                          checked={timing === choice}
                          onChange={() => setTiming(choice)}
                          className={styles.chipInput}
                        />
                        {choice}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <label className={styles.field}>
                  <span className={styles.label}>
                    Anything else we should know?{" "}
                    <span className={styles.optional}>optional</span>
                  </span>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="e.g. two bedrooms of carpet with a few pet stains, plus the driveway"
                    className={styles.textarea}
                  />
                </label>

                {/*
                  Two ways to send the same details. Email goes through our
                  server; WhatsApp opens on the visitor's phone with everything
                  already written out, so it costs nothing and cannot silently
                  fail on our side.
                */}
                <div className={styles.send}>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className={styles.submit}
                  >
                    {status === "sending" ? "Sending…" : "Request my free quote"}
                    <ArrowRight size={17} />
                  </button>
                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    className={styles.submitWhatsApp}
                  >
                    <WhatsApp size={19} />
                    Send on WhatsApp
                  </button>
                </div>

                {status === "error" ? (
                  <p role="alert" className={styles.error}>
                    {errorMessage} Please call{" "}
                    <a href={site.phone.href} className={styles.inlineLink}>
                      {site.phone.display}
                    </a>
                    , or use <strong>Send on WhatsApp</strong> above — that opens
                    on your phone with these details already filled in.
                  </p>
                ) : null}

                <div className={styles.reassurance}>
                  {[
                    "Reply under 10 minutes",
                    "Fixed price, no obligation",
                    "Your details stay with us",
                  ].map((item) => (
                    <span key={item} className={styles.reassuranceItem}>
                      <Check className={styles.reassuranceIcon} />
                      {item}
                    </span>
                  ))}
                </div>

                <p className={styles.footnote}>
                  Prefer to show us?{" "}
                  <a
                    href={waQuoteLink}
                    target="_blank"
                    rel="noopener"
                    className={styles.inlineLink}
                  >
                    Send a photo on WhatsApp
                  </a>{" "}
                  and we’ll estimate from that.
                </p>
              </form>
            </>
          )}
        </div>

        <div className={styles.aside}>
          {/*
            Dark card, so the aside reads as the "talk to us now" alternative to
            the white form rather than a second, competing panel.
          */}
          <div className={styles.contactCard}>
            <p className={styles.contactEyebrow}>Rather talk it through?</p>
            <a href={site.phone.href} className={styles.contactPhone}>
              <span className={styles.contactPhoneIcon}>
                <Phone size={18} />
              </span>
              {site.phone.display}
            </a>
            <p className={styles.contactStatus}>
              <span className={styles.dot} aria-hidden="true" />
              Replies {site.replyTime.toLowerCase()} · {site.hoursShort}
            </p>

            <div className={styles.contactRule} />

            <a href={`mailto:${site.email}`} className={styles.contactRow}>
              <span className={styles.contactRowIcon}>
                <Mail size={17} />
              </span>
              <span className={styles.contactRowBody}>
                <span className={styles.contactRowLabel}>Email</span>
                <span className={styles.contactRowValue}>{site.email}</span>
              </span>
              <ArrowRight size={16} className={styles.contactRowArrow} />
            </a>

            <div className={styles.contactRule} />

            <div className={styles.areaBlock}>
              <span className={styles.contactRowLabel}>
                <Pin size={14} /> Areas we cover
              </span>
              <div className={styles.areaTags}>
                {serviceAreas.map((area) => (
                  <span key={area.name} className={styles.areaTag}>
                    {area.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <a
            href={waQuoteLink}
            target="_blank"
            rel="noopener"
            className={styles.whatsapp}
          >
            <WhatsApp size={26} />
            <span>
              <span className={styles.whatsappTitle}>Chat on WhatsApp</span>
              <span className={styles.whatsappNote}>
                Send a photo, get an estimate
              </span>
            </span>
            <ArrowRight size={18} className={styles.whatsappArrow} />
          </a>

          <div className={styles.mapCard}>
            <iframe
              title={`Map showing ${site.name}, ${site.address.locality}, Brisbane`}
              src={site.map.embed}
              loading="lazy"
              className={styles.map}
            />
            <div className={styles.mapFoot}>
              <p className={styles.mapAddress}>
                <span className={styles.mapAddressStrong}>
                  {site.address.street}
                </span>
                <br />
                {site.address.locality} {site.address.postcode}{" "}
                {site.address.region}
              </p>
              <a
                href={site.map.directions}
                target="_blank"
                rel="noopener"
                className={styles.mapLink}
              >
                Directions
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
