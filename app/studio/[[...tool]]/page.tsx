// Embedded Sanity Studio, served at /studio (and /studio/<tool>).
// The Studio is a client-side app; this route hands the whole subtree to it.
import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

// Studio manages its own metadata + viewport.
export { metadata, viewport } from "next-sanity/studio";

// The Studio is fully interactive and must not be statically pre-rendered.
export const dynamic = "force-static";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
