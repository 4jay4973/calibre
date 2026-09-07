import type { Metadata } from "next";
import { getCaseStudies } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { InteriorHero } from "@/components/detail/interior-hero";
import { Breadcrumbs } from "@/components/detail/breadcrumbs";

export function generateMetadata(): Metadata {
  const title = "Selected work — Calibre";
  const description =
    "Real engagements, described without naming the manufacturer — the numbers are not. Formulation fixes, failure recovery and new plants.";
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
  };
}

export default async function WorkIndex() {
  const cases = await getCaseStudies();
  return (
    <>
      <SiteHeader />
      <main>
        <InteriorHero
          eyebrow="Selected work"
          title="Real engagements, client details withheld."
          lead="We work under confidentiality, so these are described without naming the manufacturer. The numbers are not."
          breadcrumbs={
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Work" }]} />
          }
        />
        <section className="cases">
          <div className="wrap">
            <div className="case-grid">
              {cases.map((c) => (
                <a className="case" href={c.href} key={c.slug ?? c.title}>
                  <div className="case-tag">{c.tag}</div>
                  <h3>{c.title}</h3>
                  <dl>
                    <dt>Challenge</dt>
                    <dd>{c.challenge}</dd>
                    <dt>Approach</dt>
                    <dd>{c.approach}</dd>
                  </dl>
                  <div className="case-result">
                    <div className="big tnum">{c.resultValue}</div>
                    <div className="cap-note">{c.resultNote}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
