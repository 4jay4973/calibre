import type { Metadata } from "next";
import { getInsights } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { InteriorHero } from "@/components/detail/interior-hero";
import { Breadcrumbs } from "@/components/detail/breadcrumbs";

export function generateMetadata(): Metadata {
  return {
    title: "Insights — Calibre",
    description:
      "Notes from the lab bench — practical technical writing on formulation, resin selection, compliance and troubleshooting for coating manufacturers.",
    openGraph: {
      title: "Insights — Calibre",
      description:
        "Practical technical writing on formulation, resin selection, compliance and troubleshooting for coating manufacturers.",
      type: "website",
    },
  };
}

export default async function InsightsIndex() {
  const insights = await getInsights();
  return (
    <>
      <SiteHeader />
      <main>
        <InteriorHero
          eyebrow="Insights"
          title="Notes from the lab bench."
          lead="Practical technical writing — the kind that shows expertise directly and needs no client's permission to publish."
          breadcrumbs={
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Insights" }]} />
          }
        />
        <section className="insights">
          <div className="wrap">
            <div className="ins-grid">
              {insights.map((n) => {
                const date = formatDate(n.publishedAt);
                return (
                  <a className="ins" href={n.href} key={n.slug ?? n.title}>
                    <div className="topic">{n.topic}</div>
                    <h3>{n.title}</h3>
                    <p>{n.excerpt}</p>
                    {date || n.readMinutes ? (
                      <div className="ins-meta">
                        {date ? <span>{date}</span> : null}
                        {date && n.readMinutes ? <span className="dot">·</span> : null}
                        {n.readMinutes ? <span>{n.readMinutes} min read</span> : null}
                      </div>
                    ) : null}
                    <span className="read">Read the note</span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
