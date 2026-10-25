import Link from "next/link";
import { getSiteCopy } from "@/lib/content";
import { contactLinks } from "@/lib/contact";

export async function SiteFooter() {
  const { contact } = await getSiteCopy();
  const links = contactLinks(contact);
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
            <Link href="/services">Capabilities</Link>
            <Link href="/#sectors">Sectors</Link>
            <Link href="/#approach">Approach</Link>
            <Link href="/work">Selected work</Link>
            <Link href="/insights">Insights</Link>
          </div>
          <div className="foot-col">
            <h4>Contact</h4>
            <Link href="/#contact">Start a project</Link>
            <a href={links.mailto}>{links.email}</a>
            <a href={links.tel}>{links.phoneDisplay}</a>
            <a href={links.whatsappUrl} target="_blank" rel="noreferrer">WhatsApp</a>
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
