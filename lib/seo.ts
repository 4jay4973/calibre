// JSON-LD builders. Kept minimal and valid; absolute URLs via SITE_URL.
import { SITE_URL, SITE_NAME } from "./site";

export interface Crumb {
  name: string;
  /** Absolute-from-root path, e.g. "/work". Omit for the current page. */
  path?: string;
}

export function breadcrumbLd(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      ...(it.path ? { item: `${SITE_URL}${it.path}` } : {}),
    })),
  };
}

export function serviceLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: name,
    url: `${SITE_URL}${path}`,
    provider: { "@type": "Organization", name: SITE_NAME },
  };
}
