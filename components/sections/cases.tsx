import { getCaseStudies } from "@/lib/content";
import { Reveal } from "@/components/ui/reveal";

export async function Cases() {
  const cases = await getCaseStudies();
  return (
    <section id="cases" className="cases">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="kicker">Selected work</div>
          <h2 className="big">Real engagements, client details withheld.</h2>
          <p>We work under confidentiality, so these are described without naming the manufacturer. The numbers are not.</p>
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
