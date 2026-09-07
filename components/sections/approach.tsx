import { getApproach } from "@/lib/content";
import { Reveal } from "@/components/ui/reveal";

export async function Approach() {
  const steps = await getApproach();
  return (
    <section id="approach">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="kicker">How we work</div>
          <h2 className="big">A measured path from problem to repeatable production.</h2>
          <p>Nothing scales until it has been proven on the bench. Every stage produces documentation your team keeps.</p>
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
