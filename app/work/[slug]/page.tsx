import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCaseStudyBySlug,
  getAllCaseStudySlugs,
  getCaseStudies,
} from "@/lib/content";
import { breadcrumbLd } from "@/lib/seo";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { InteriorHero } from "@/components/detail/interior-hero";
import { Breadcrumbs } from "@/components/detail/breadcrumbs";
import { PortableTextBody } from "@/components/detail/portable-text-body";
import { RelatedGrid, type RelatedItem } from "@/components/detail/related-grid";
import { CtaBand } from "@/components/detail/cta-band";
import { JsonLd } from "@/components/detail/json-ld";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getAllCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug);
  if (!cs) return { title: "Case study not found — Calibre" };
  // Blinded: title/tag/challenge carry no client-identifying detail.
  const title = `${cs.title} — Work — Calibre`;
  return {
    title,
    description: cs.challenge,
    openGraph: { title, description: cs.challenge, type: "website" },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug);
  if (!cs) notFound();

  // "More work" — other case studies, still blinded.
  const more: RelatedItem[] = (await getCaseStudies())
    .filter((c) => c.slug && c.slug !== slug)
    .map((c) => ({
      href: c.href ?? `/work/${c.slug}`,
      eyebrow: c.tag,
      title: c.title,
      note: `${c.resultValue} — ${c.resultNote}`,
    }));

  return (
    <>
      <SiteHeader />
      <main>
        <InteriorHero
          eyebrow={cs.tag}
          title={cs.title}
          metric={{ value: cs.resultValue, label: cs.resultNote }}
          breadcrumbs={
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Work", href: "/work" },
                { label: cs.title },
              ]}
            />
          }
        />

        <section className="detail">
          <div className="wrap">
            <div className="detail-col">
              <dl className="detail-dl">
                <dt>Challenge</dt>
                <dd>{cs.challenge}</dd>
                <dt>Approach</dt>
                <dd>{cs.approach}</dd>
                <dt>Result</dt>
                <dd>
                  {cs.resultValue} — {cs.resultNote}
                </dd>
              </dl>

              {cs.bodyDetail?.length ? (
                <div className="detail-block">
                  <PortableTextBody value={cs.bodyDetail} />
                </div>
              ) : null}

              {cs.relatedServices.length ? (
                <div className="detail-block">
                  <div className="detail-label">Capabilities applied</div>
                  <div className="chip-links">
                    {cs.relatedServices.map((s) => (
                      <a href={`/services/${s.slug}`} key={s.slug}>
                        <span>{s.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}

              {cs.sector ? (
                <div className="detail-block">
                  <div className="detail-label">Sector</div>
                  <div className="chip-links">
                    <a href={`/sectors/${cs.sector.slug}`}>
                      <span>{cs.sector.name}</span>
                    </a>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {more.length ? (
          <section className="detail-more">
            <div className="wrap">
              <RelatedGrid title="More work" items={more} />
            </div>
          </section>
        ) : null}

        <CtaBand />
      </main>
      <SiteFooter />

      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
          { name: cs.title },
        ])}
      />
    </>
  );
}
