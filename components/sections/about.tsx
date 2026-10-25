import { getSiteCopy } from "@/lib/content";
import { Reveal } from "@/components/ui/reveal";

export async function About() {
  const { about: copy } = await getSiteCopy();
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
          <div className="kicker">{copy.kicker}</div>
          <h2 className="big">{copy.heading}</h2>
          <div className="role">{copy.role}</div>
          <p className="serif">{copy.leadBio}</p>
          <p>{copy.secondBio}</p>
          <div className="standards">
            {copy.standards.map((s, i) => (<span className="chip" key={`${i}-${s}`}>{s}</span>))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
