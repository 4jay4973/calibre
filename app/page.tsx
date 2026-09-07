import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/sections/hero";
import { Metrics } from "@/components/sections/metrics";
import { Capabilities } from "@/components/sections/capabilities";
import { SectorShowcase } from "@/components/sections/sector-showcase";
import { Approach } from "@/components/sections/approach";
import { Cases } from "@/components/sections/cases";
import { Confidentiality } from "@/components/sections/confidentiality";
import { About } from "@/components/sections/about";
import { Insights } from "@/components/sections/insights";
import { Contact } from "@/components/sections/contact";
import { getSectors } from "@/lib/content";

export default async function Home() {
  const sectors = await getSectors();
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Metrics />
        <Capabilities />
        <SectorShowcase sectors={sectors} />
        <Approach />
        <Cases />
        <Confidentiality />
        <About />
        <Insights />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
