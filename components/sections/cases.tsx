import { getCaseStudies, getSiteCopy } from "@/lib/content";
import { Reveal } from "@/components/ui/reveal";

export async function Cases() {
  const [cases, { cases: copy }] = await Promise.all([getCaseStudies(), getSiteCopy()]);
  return (
    <section id="cases" className="cases">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="kicker">{copy.kicker}</div>
          <h2 className="big">{copy.heading}</h2>
          <p>{copy.intro}</p>
        </Reveal>
        <Reveal className="case-grid">
          {cases.map((c, i) => (
            <div className="case" key={i}>
              <div className="case-tag">{c.tag}</div>
              <h3>{c.title}</h3>
              <dl>
                <dt>Challenge</dt><dd>{c.challenge}</dd>
                <dt>Approach</dt><dd>{c.approach}</dd>
              </dl>
              <div className="case-result">
                <div className="big tnum">{c.resultValue}</div>
                <div className="cap-note">{c.resultNote}</div>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
