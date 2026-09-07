import { Reveal } from "@/components/ui/reveal";

export function Confidentiality() {
  return (
    <section className="confid on-dark">
      <div className="wrap">
        <Reveal className="confid-inner">
          <div className="seal">CONFIDENTIAL<br />WORK<br />NDA&nbsp;FIRST</div>
          <div>
            <div className="kicker">Discretion by default</div>
            <h2>Your formulations never leave the room.</h2>
            <p>In this industry, your formulation is the business. We start every engagement with an NDA, and any recipe, process or supplier relationship we touch remains entirely yours.</p>
            <p>It is also why we do not publish client names or logos. You are judging us on the depth of the work — not on whose badge we can display.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
