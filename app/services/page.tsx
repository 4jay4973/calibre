import type { Metadata } from "next";
import { getCapabilities } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { InteriorHero } from "@/components/detail/interior-hero";
import { Breadcrumbs } from "@/components/detail/breadcrumbs";
import { ServiceIcon } from "@/components/detail/service-icon";

export function generateMetadata(): Metadata {
  const title = "Services — Calibre";
  const description =
    "Deep technical help across the whole production line — formulation, resin technology, plant setup, process optimisation, failure analysis, QC, sourcing and compliance.";
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
  };
}

export default async function ServicesIndex() {
  const caps = await getCapabilities();
  return (
    <>
      <SiteHeader />
      <main>
        <InteriorHero
          eyebrow="What we do"
          title="Deep technical help across the whole production line."
          lead="From a single failing batch to a new plant built from nothing — we work at the level of chemistry, process and quality control, not slogans."
          breadcrumbs={
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services" }]} />
          }
        />
        <section id="capabilities">
          <div className="wrap">
            <div className="cap-grid">
              {caps.map((c) => (
                <a className="cap" href={c.href} key={c.slug ?? c.title}>
                  <ServiceIcon icon={c.icon} />
                  <h3>{c.title}</h3>
                  <p>{c.description}</p>
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
