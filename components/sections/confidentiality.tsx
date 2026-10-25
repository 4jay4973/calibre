import { getSiteCopy } from "@/lib/content";
import { Reveal } from "@/components/ui/reveal";

export async function Confidentiality() {
  const { confidentiality: copy } = await getSiteCopy();
  return (
    <section className="confid on-dark">
      <div className="wrap">
        <Reveal className="confid-inner">
          <div className="seal">CONFIDENTIAL<br />WORK<br />NDA&nbsp;FIRST</div>
          <div>
            <div className="kicker">{copy.kicker}</div>
            <h2>{copy.heading}</h2>
            <p>{copy.intro}</p>
            <p>{copy.secondParagraph}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
