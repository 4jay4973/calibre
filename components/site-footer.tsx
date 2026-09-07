import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  MAILTO,
  TEL,
  WHATSAPP_URL,
} from "@/lib/contact";

export function SiteFooter() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-top">
          <div>
            <div className="foot-brand">Calibre<span className="dot">.</span></div>
            <p>
              Paint, coating and resin technical consultancy. We help manufacturers
              formulate better, fix what&apos;s failing, and build production that lasts.
            </p>
          </div>
          <div className="foot-col">
            <h4>Explore</h4>
            <a href="/services">Capabilities</a>
            <a href="/#sectors">Sectors</a>
            <a href="/#approach">Approach</a>
            <a href="/work">Selected work</a>
            <a href="/insights">Insights</a>
          </div>
          <div className="foot-col">
            <h4>Contact</h4>
            <a href="/#contact">Start a project</a>
            <a href={MAILTO}>{CONTACT_EMAIL}</a>
            <a href={TEL}>{CONTACT_PHONE_DISPLAY}</a>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
        </div>
        <div className="foot-bot">
          <span>© {new Date().getFullYear()} Calibre Coating Consultancy — placeholder brand.</span>
          <span>Built with Next.js</span>
        </div>
      </div>
    </footer>
  );
}
