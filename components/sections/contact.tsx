"use client";
import { useRef, useState } from "react";
import Script from "next/script";
import { Reveal } from "@/components/ui/reveal";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  MAILTO,
  TEL,
} from "@/lib/contact";

// Turnstile is optional: with no site key we simply don't render the widget and
// the server skips verification (dev). The secret key is server-only.
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Status = "idle" | "submitting" | "success" | "error";

// Minimal shape of the Cloudflare Turnstile global.
interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
}
function turnstile(): TurnstileApi | undefined {
  return (window as unknown as { turnstile?: TurnstileApi }).turnstile;
}

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [token, setToken] = useState("");
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  function renderTurnstile() {
    const t = turnstile();
    if (!TURNSTILE_SITE_KEY || !t || !widgetRef.current || widgetId.current) return;
    widgetId.current = t.render(widgetRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      theme: "dark",
      callback: (tok: string) => setToken(tok),
      "error-callback": () => setToken(""),
      "expired-callback": () => setToken(""),
    });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: fd.get("name"),
      company: fd.get("company"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      projectType: fd.get("projectType"),
      message: fd.get("message"),
      companyWebsite: fd.get("companyWebsite"), // honeypot
      turnstileToken: token,
    };

    setStatus("submitting");
    setErrorMsg("");
    setFieldErrors({});
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        errors?: Record<string, string>;
      };
      if (res.ok && data.ok) {
        setStatus("success");
        form.reset();
        const t = turnstile();
        if (t && widgetId.current) {
          t.reset(widgetId.current);
          setToken("");
        }
      } else {
        setStatus("error");
        setFieldErrors(data.errors ?? {});
        setErrorMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  const submitting = status === "submitting";

  // Inline, per-field error from the API's `errors` map.
  const invalid = (key: string) => (fieldErrors[key] ? true : undefined);
  const fieldError = (key: string) =>
    fieldErrors[key] ? (
      <span className="field-error" id={`${key}-error`} role="alert">
        {fieldErrors[key]}
      </span>
    ) : null;
  const describedBy = (key: string, extra?: string) =>
    [extra, fieldErrors[key] ? `${key}-error` : ""].filter(Boolean).join(" ") ||
    undefined;

  return (
    <section id="contact" className="contact on-dark">
      {TURNSTILE_SITE_KEY ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={renderTurnstile}
        />
      ) : null}
      <div className="wrap contact-grid">
        <Reveal>
          <div className="kicker">Start a conversation</div>
          <h2 className="big">Tell us what&apos;s not working.</h2>
          <p className="lead">Describe the problem or the plant you have in mind. You&apos;ll hear back from the consultant directly — not a sales desk.</p>
          <div className="cinfo"><div className="l">Email</div><a className="v link" href={MAILTO}>{CONTACT_EMAIL}</a></div>
          <div className="cinfo"><div className="l">Phone &amp; WhatsApp</div><a className="v link" href={TEL}>{CONTACT_PHONE_DISPLAY}</a></div>
          <div className="cinfo"><div className="l">Based in</div><div className="v">India · working nationwide</div></div>
        </Reveal>
        <Reveal as="div">
          <form onSubmit={onSubmit} noValidate>
            <p className="form-legend">
              Fields marked <span className="req" aria-hidden="true">*</span> are required.
            </p>
            <div className="field">
              <label htmlFor="n">Name <span className="req" aria-hidden="true">*</span></label>
              <input id="n" name="name" type="text" placeholder="Your name" aria-required="true" aria-invalid={invalid("name")} aria-describedby={describedBy("name")} />
              {fieldError("name")}
            </div>
            <div className="field">
              <label htmlFor="c">Company</label>
              <input id="c" name="company" type="text" placeholder="Company name" aria-invalid={invalid("company")} aria-describedby={describedBy("company")} />
              {fieldError("company")}
            </div>
            <div className="field">
              <label htmlFor="e">Email <span className="req" aria-hidden="true">*</span></label>
              <input id="e" name="email" type="email" placeholder="you@company.com" aria-required="true" aria-invalid={invalid("email")} aria-describedby={describedBy("email")} />
              {fieldError("email")}
            </div>
            <div className="field">
              <label htmlFor="p">Phone</label>
              <input id="p" name="phone" type="tel" placeholder="+91" aria-invalid={invalid("phone")} aria-describedby={describedBy("phone")} />
              {fieldError("phone")}
            </div>
            <div className="field full">
              <label htmlFor="t">What do you need help with? <span className="req" aria-hidden="true">*</span></label>
              <select id="t" name="projectType" defaultValue="Developing a new formulation" aria-required="true" aria-invalid={invalid("projectType")} aria-describedby={describedBy("projectType")}>
                <option>Developing a new formulation</option>
                <option>Fixing a failing product</option>
                <option>Setting up a new plant</option>
                <option>Optimising an existing line</option>
                <option>Something else</option>
              </select>
              {fieldError("projectType")}
            </div>
            <div className="field full">
              <label htmlFor="m">Project details <span className="req" aria-hidden="true">*</span></label>
              <textarea id="m" name="message" placeholder="A few lines about the product, line or problem." aria-required="true" aria-invalid={invalid("message")} aria-describedby={describedBy("message", "m-hint")} />
              {fieldError("message")}
              <span className="field-hint" id="m-hint">A few lines — at least 10 characters.</span>
            </div>

            {/* Honeypot: hidden from humans, tempting to bots. Leave empty. */}
            <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
              <label htmlFor="company-website">Company website</label>
              <input id="company-website" name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            {TURNSTILE_SITE_KEY ? (
              <div className="form-turnstile" ref={widgetRef} />
            ) : null}

            <button className="btn btn-primary full" type="submit" disabled={submitting}>
              {submitting ? "Sending…" : "Send enquiry"}
            </button>

            {status === "success" ? (
              <div className="form-note is-success" role="status">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Thanks — your enquiry is on its way. You&apos;ll hear back from the consultant directly.
              </div>
            ) : status === "error" ? (
              <div className="form-note is-error" role="alert">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
                </svg>
                {errorMsg}
              </div>
            ) : (
              <div className="form-note">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8FA0A5" strokeWidth="1.8">
                  <path d="M12 2 4 6v6c0 5 3.4 8 8 10 4.6-2 8-5 8-10V6l-8-4Z" />
                </svg>
                Sent straight to the consultant, in confidence — never a sales list.
              </div>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
