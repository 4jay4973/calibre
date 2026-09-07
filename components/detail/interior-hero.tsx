import type { ReactNode } from "react";

/**
 * Compact page hero for interior/detail templates. Dark band with an eyebrow,
 * title and optional lead, plus an optional metric OR a free-form right slot.
 * Presentational only — pass data in as props. Styled with `.interior-hero`
 * (see app/globals.css).
 */
export function InteriorHero({
  eyebrow,
  title,
  lead,
  metric,
  right,
  breadcrumbs,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  metric?: { value: string; suffix?: string; label: string };
  /** Overrides `metric` when provided — arbitrary content for the right column. */
  right?: ReactNode;
  /** Optional slot, typically a <Breadcrumbs /> rendered above the title. */
  breadcrumbs?: ReactNode;
}) {
  return (
    <section className="interior-hero">
      <div className="wrap">
        {breadcrumbs}
        <div className="ih-grid">
          <div>
            {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
            <h1>{title}</h1>
            {lead ? <p className="ih-lead">{lead}</p> : null}
          </div>
          {right ? (
            <div className="ih-right">{right}</div>
          ) : metric ? (
            <div className="ih-metric">
              <div className="v tnum">
                {metric.value}
                {metric.suffix ? <span className="u">{metric.suffix}</span> : null}
              </div>
              <div className="l">{metric.label}</div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
