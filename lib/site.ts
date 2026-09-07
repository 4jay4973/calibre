// Site-wide constants. The canonical origin comes from env so sitemap/robots and
// JSON-LD emit absolute URLs; the fallback is a placeholder for local builds.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://calibre.example"
).replace(/\/$/, "");

// "Calibre" is the placeholder brand (see CLAUDE.md).
export const SITE_NAME = "Calibre";
