export interface RelatedItem {
  href: string;
  eyebrow?: string;
  title: string;
  note?: string;
}

/**
 * Small grid of cards linking to related work or services. Presentational only
 * — callers map their ServiceRef / CaseStudyRef / SectorRef into RelatedItem[].
 * Styled with `.related-grid` (see app/globals.css).
 */
export function RelatedGrid({
  title,
  items,
}: {
  title?: string;
  items: RelatedItem[];
}) {
  if (!items?.length) return null;
  return (
    <div>
      {title ? <div className="related-title">{title}</div> : null}
      <div className="related-grid">
        {items.map((item, i) => (
          <a className="related-card" href={item.href} key={i}>
            {item.eyebrow ? <div className="rc-eyebrow">{item.eyebrow}</div> : null}
            <h3>{item.title}</h3>
            {item.note ? <p className="rc-note">{item.note}</p> : null}
          </a>
        ))}
      </div>
    </div>
  );
}
