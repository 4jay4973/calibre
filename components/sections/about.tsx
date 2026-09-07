import { Reveal } from "@/components/ui/reveal";

const standards = ["IS / BIS standards", "ASTM methods", "ISO 9001 QC systems", "VOC & eco-compliance", "Plant commissioning"];

export function About() {
  return (
    <section id="about" className="about">
      <div className="wrap about-grid">
        <Reveal className="portrait">
          <svg width="90" height="90" viewBox="0 0 24 24" fill="none" stroke="#4E63FF" strokeWidth="1">
            <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
          </svg>
          <span className="ph-label">Placeholder — lead consultant portrait</span>
        </Reveal>
        <Reveal className="about">
          <div className="kicker">The consultant</div>
          <h2 className="big">Led by a working paint technologist.</h2>
          <div className="role">Principal Consultant · Paint, Coating &amp; Resin Technology</div>
          <p className="serif">Placeholder bio: three decades formulating and troubleshooting coatings across decorative, industrial and construction-chemical lines, and commissioning manufacturing plants from an empty floor to running production.</p>
          <p>The practice stays deliberately small and senior. When you engage Calibre, you work directly with the person doing the chemistry — not an account layer. Real names, credentials and history go here once the client is ready to share them.</p>
          <div className="standards">
            {standards.map((s) => (<span className="chip" key={s}>{s}</span>))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
