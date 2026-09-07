import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSectorBySlug, getAllSectorSlugs } from "@/lib/content";
import { breadcrumbLd } from "@/lib/seo";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { InteriorHero } from "@/components/detail/interior-hero";
import { Breadcrumbs } from "@/components/detail/breadcrumbs";
import { RelatedGrid, type RelatedItem } from "@/components/detail/related-grid";
import { CtaBand } from "@/components/detail/cta-band";
import { FinishSwatch } from "@/components/detail/finish-swatch";
import { JsonLd } from "@/components/detail/json-ld";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getAllSectorSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sector = await getSectorBySlug(slug);
  if (!sector) return { title: "Sector not found — Calibre" };
  const title = `${sector.name} — Sectors — Calibre`;
  return {
    title,
    description: sector.description,
    openGraph: { title, description: sector.description, type: "website" },
  };
}

export default async function SectorPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const sector = await getSectorBySlug(slug);
  if (!sector) notFound();

  const services: RelatedItem[] = sector.relatedServices.map((s) => ({
    href: `/services/${s.slug}`,
    eyebrow: "Capability",
    title: s.title,
    note: s.description,
  }));
  const work: RelatedItem[] = sector.relatedWork.map((c) => ({
    href: `/work/${c.slug}`,
    eyebrow: c.tag,
    title: c.title,
    note: `${c.resultValue} — ${c.resultNote}`,
  }));

  return (
    <>
      <SiteHeader />
      <main>
        <InteriorHero
          eyebrow="Sector"
          title={sector.name}
          right={<FinishSwatch kind={sector.swatch} label={sector.finishLabel} />}
          breadcrumbs={
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Sectors", href: "/#sectors" },
                { label: sector.name },
              ]}
            />
          }
        />

        <section className="detail">
          <div className="wrap">
            <div className="detail-col">
              <p className="detail-lead">{sector.description}</p>

              {sector.products?.length ? (
                <div className="detail-block">
                  <div className="prod-label">Products we help build</div>
                  <div className="prod-chips">
                    {sector.products.map((p) => (
                      <span key={p}>{p}</span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {services.length || work.length ? (
          <section className="detail-more">
            <div className="wrap detail-stack">
              {services.length ? (
                <RelatedGrid title="Services for this sector" items={services} />
              ) : null}
              {work.length ? (
                <RelatedGrid title="Related work" items={work} />
              ) : null}
            </div>
          </section>
        ) : null}

        <CtaBand />
      </main>
      <SiteFooter />

      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Sectors", path: "/#sectors" },
          { name: sector.name },
        ])}
      />
    </>
  );
}
