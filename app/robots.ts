import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/studio", // the embedded CMS admin — not for indexing
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
