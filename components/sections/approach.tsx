import { getApproach, getSiteCopy } from "@/lib/content";
import { Reveal } from "@/components/ui/reveal";

export async function Approach() {
  const [steps, { approach: copy }] = await Promise.all([getApproach(), getSiteCopy()]);
  return (
    <section id="approach">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="kicker">{copy.kicker}</div>
          <h2 className="big">{copy.heading}</h2>
          <p>{copy.intro}</p>
        </Reveal>
        <Reveal className="steps">
          {steps.map((s, i) => (
            <div className="step" key={i}>
              <span className="idx">{s.index}</span>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <div className="step-bar"><i /></div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
