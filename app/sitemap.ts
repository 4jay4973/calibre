import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import {
  getAllServiceSlugs,
  getAllCaseStudySlugs,
  getAllSectorSlugs,
  getAllInsightSlugs,
} from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, work, sectors, insights] = await Promise.all([
    getAllServiceSlugs(),
    getAllCaseStudySlugs(),
    getAllSectorSlugs(),
    getAllInsightSlugs(),
  ]);

  const paths = [
    "/",
    "/services",
    "/work",
    "/insights",
    ...services.map((s) => `/services/${s}`),
    ...work.map((s) => `/work/${s}`),
    ...sectors.map((s) => `/sectors/${s}`),
    ...insights.map((s) => `/insights/${s}`),
  ];

  const lastModified = new Date();
  return paths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
  }));
}
