import { getInsights, getSiteCopy } from "@/lib/content";
import { Reveal } from "@/components/ui/reveal";

export async function Insights() {
  const [insights, { insights: copy }] = await Promise.all([getInsights(), getSiteCopy()]);
  return (
    <section id="insights" className="insights">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="kicker">{copy.kicker}</div>
          <h2 className="big">{copy.heading}</h2>
          <p>{copy.intro}</p>
        </Reveal>
        <Reveal className="ins-grid">
          {insights.map((n, i) => (
            <a className="ins" href={n.href} key={i}>
              <div className="topic">{n.topic}</div>
              <h3>{n.title}</h3>
              <p>{n.excerpt}</p>
              <span className="read">Read the note</span>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
