import { getCapabilities } from "@/lib/content";
import type { IconKey } from "@/lib/content";
import { Reveal } from "@/components/ui/reveal";
import type { ReactNode } from "react";

const icons: Record<IconKey, ReactNode> = {
  flask: (<><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3" /><path d="M7.5 15h9" /></>),
  resin: (<><circle cx="7" cy="8" r="3" /><circle cx="17" cy="16" r="3" /><path d="M7 11v5a2 2 0 0 0 2 2h5M17 13V8a2 2 0 0 0-2-2h-5" /></>),
  plant: (<><path d="M3 21h18M5 21V9l7-5 7 5v12" /><path d="M9 21v-6h6v6" /></>),
  optimise: (<><path d="M3 17l6-6 4 4 8-8" /><path d="M14 7h7v7" /></>),
  diagnose: (<><circle cx="11" cy="11" r="7" /><path d="m16 16 5 5" /><path d="M11 8v6M8 11h6" /></>),
  qc: (<><path d="M9 3v6l-5 8a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-8V3" /><circle cx="12" cy="16" r="1.4" /></>),
  sourcing: (<><path d="M4 7h16M4 12h16M4 17h10" /><circle cx="18" cy="17" r="2" /></>),
  compliance: (<><path d="M12 3a9 9 0 1 0 9 9" /><path d="M12 7v5l3 2" /><path d="M16 4h5v5" /></>),
};

export async function Capabilities() {
  const caps = await getCapabilities();
  return (
    <section id="capabilities">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="kicker">What we do</div>
          <h2 className="big">Deep technical help across the whole production line.</h2>
          <p>From a single failing batch to a new plant built from nothing — we work at the level of chemistry, process and quality control, not slogans.</p>
        </Reveal>
        <Reveal className="cap-grid">
          {caps.map((c, i) => (
            <div className="cap" key={i}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                {icons[c.icon]}
              </svg>
              <h3>{c.title}</h3>
              <p>{c.description}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
