"use client";
import { Reveal } from "@/components/ui/reveal";

export function Contact() {
  // Placeholder handler. To wire this up: POST to an /app/api/contact route
  // handler and send via Resend (or your provider). Add a honeypot + Turnstile
  // for spam protection before launch.
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <section id="contact" className="contact on-dark">
      <div className="wrap contact-grid">
        <Reveal>
          <div className="kicker">Start a conversation</div>
          <h2 className="big">Tell us what&apos;s not working.</h2>
          <p className="lead">Describe the problem or the plant you have in mind. You&apos;ll hear back from the consultant directly — not a sales desk.</p>
          <div className="cinfo"><div className="l">Email</div><a className="v link" href="#">hello@calibre-consulting.example</a></div>
          <div className="cinfo"><div className="l">Phone &amp; WhatsApp</div><a className="v link" href="#">+91 00000 00000</a></div>
          <div className="cinfo"><div className="l">Based in</div><div className="v">India · working nationwide</div></div>
        </Reveal>
        <Reveal as="div">
          <form onSubmit={onSubmit}>
            <div className="field"><label htmlFor="n">Name</label><input id="n" type="text" placeholder="Your name" /></div>
            <div className="field"><label htmlFor="c">Company</label><input id="c" type="text" placeholder="Company name" /></div>
            <div className="field"><label htmlFor="e">Email</label><input id="e" type="email" placeholder="you@company.com" /></div>
            <div className="field"><label htmlFor="p">Phone</label><input id="p" type="tel" placeholder="+91" /></div>
            <div className="field full">
              <label htmlFor="t">What do you need help with?</label>
              <select id="t" defaultValue="Developing a new formulation">
                <option>Developing a new formulation</option>
                <option>Fixing a failing product</option>
                <option>Setting up a new plant</option>
                <option>Optimising an existing line</option>
                <option>Something else</option>
              </select>
            </div>
            <div className="field full"><label htmlFor="m">Project details</label><textarea id="m" placeholder="A few lines about the product, line or problem." /></div>
            <button className="btn btn-primary full" type="submit">Send enquiry</button>
            <div className="form-note">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8FA0A5" strokeWidth="1.8">
                <path d="M12 2 4 6v6c0 5 3.4 8 8 10 4.6-2 8-5 8-10V6l-8-4Z" />
              </svg>
              Not yet wired to a backend — see the note in contact.tsx.
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
