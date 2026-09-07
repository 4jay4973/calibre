import { Fragment } from "react";

export interface Crumb {
  label: string;
  /** Omit on the current (last) item; it renders as plain text. */
  href?: string;
}

/**
 * Breadcrumb trail. Presentational only. Inherits a light-on-dark variant when
 * placed inside `.interior-hero` / `.on-dark` (see app/globals.css).
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (!items?.length) return null;
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={i}>
              <li>
                {item.href && !last ? (
                  <a href={item.href}>{item.label}</a>
                ) : (
                  <span aria-current={last ? "page" : undefined}>{item.label}</span>
                )}
              </li>
              {last ? null : (
                <li className="sep" aria-hidden="true">
                  /
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
