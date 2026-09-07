import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug, getAllServiceSlugs } from "@/lib/content";
import { breadcrumbLd, serviceLd } from "@/lib/seo";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { InteriorHero } from "@/components/detail/interior-hero";
import { Breadcrumbs } from "@/components/detail/breadcrumbs";
import { RelatedGrid, type RelatedItem } from "@/components/detail/related-grid";
import { CtaBand } from "@/components/detail/cta-band";
import { ServiceIcon } from "@/components/detail/service-icon";
import { JsonLd } from "@/components/detail/json-ld";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getAllServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service not found — Calibre" };
  const title = `${service.title} — Services — Calibre`;
  const description = service.overview ?? service.description;
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const relatedWork: RelatedItem[] = service.relatedCaseStudies.map((c) => ({
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
          eyebrow="Capability"
          title={service.title}
          lead={service.overview ?? service.description}
          right={
            <div className="ih-icon">
              <ServiceIcon icon={service.icon} size={84} />
            </div>
          }
          breadcrumbs={
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Services", href: "/services" },
                { label: service.title },
              ]}
            />
          }
        />

        <section className="detail">
          <div className="wrap">
            <div className="detail-col">
              {service.whatItCovers?.length ? (
                <div className="detail-block">
                  <h2>What it covers</h2>
                  <ul className="covers">
                    {service.whatItCovers.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {service.whoItsFor ? (
                <div className="detail-block">
                  <h2>Who it&apos;s for</h2>
                  <p className="detail-lead">{service.whoItsFor}</p>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {relatedWork.length ? (
          <section className="detail-more">
            <div className="wrap">
              <RelatedGrid title="Related work" items={relatedWork} />
            </div>
          </section>
        ) : null}

        <CtaBand />
      </main>
      <SiteFooter />

      <JsonLd
        data={serviceLd({
          name: service.title,
          description: service.overview ?? service.description,
          path: `/services/${service.slug}`,
        })}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.title },
        ])}
      />
    </>
  );
}
