import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getInsightBySlug,
  getAllInsightSlugs,
  getInsights,
} from "@/lib/content";
import { formatDate } from "@/lib/format";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Breadcrumbs } from "@/components/detail/breadcrumbs";
import { PortableTextBody } from "@/components/detail/portable-text-body";
import { RelatedGrid, type RelatedItem } from "@/components/detail/related-grid";
import { CtaBand } from "@/components/detail/cta-band";

type Params = { slug: string };

// Prerender every insight that has a slug as a static page.
export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getAllInsightSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const insight = await getInsightBySlug(slug);
  if (!insight) return { title: "Insight not found — Calibre" };

  const title = `${insight.title} — Calibre`;
  return {
    title,
    description: insight.excerpt,
    openGraph: {
      title,
      description: insight.excerpt,
      type: "article",
      ...(insight.publishedAt ? { publishedTime: insight.publishedAt } : {}),
    },
  };
}

export default async function InsightArticle({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const insight = await getInsightBySlug(slug);
  if (!insight) notFound();

  const date = formatDate(insight.publishedAt);

  // "More insights" — every other article, mapped into RelatedGrid cards.
  const others: RelatedItem[] = (await getInsights())
    .filter((n) => n.slug && n.slug !== slug)
    .map((n) => ({
      href: n.href,
      eyebrow: n.topic,
      title: n.title,
      note: n.excerpt,
    }));

  // --- JSON-LD (Article + BreadcrumbList), kept minimal and valid. ---
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: insight.title,
    description: insight.excerpt,
    ...(insight.publishedAt ? { datePublished: insight.publishedAt } : {}),
    author: { "@type": "Organization", name: "Calibre" },
    publisher: { "@type": "Organization", name: "Calibre" },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Insights", item: "/insights" },
      { "@type": "ListItem", position: 3, name: insight.title },
    ],
  };

  return (
    <>
      <SiteHeader />
      <main>
        <article className="article">
          <div className="wrap">
            <div className="article-col">
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Insights", href: "/insights" },
                  { label: insight.title },
                ]}
              />
              <header className="article-head">
                <div className="article-topic">{insight.topic}</div>
                <h1>{insight.title}</h1>
                {date || insight.readMinutes ? (
                  <div className="article-meta">
                    {date ? (
                      <time dateTime={insight.publishedAt}>{date}</time>
                    ) : null}
                    {date && insight.readMinutes ? (
                      <span className="dot">·</span>
                    ) : null}
                    {insight.readMinutes ? (
                      <span>{insight.readMinutes} min read</span>
                    ) : null}
                  </div>
                ) : null}
              </header>
              <PortableTextBody value={insight.body} />
            </div>
          </div>
        </article>

        {others.length > 0 ? (
          <section className="article-more">
            <div className="wrap">
              <RelatedGrid title="More insights" items={others} />
            </div>
          </section>
        ) : null}

        <CtaBand />
      </main>
      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
    </>
  );
}
