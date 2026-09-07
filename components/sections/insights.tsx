import { getInsights } from "@/lib/content";
import { Reveal } from "@/components/ui/reveal";

export async function Insights() {
  const insights = await getInsights();
  return (
    <section id="insights" className="insights">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="kicker">Insights</div>
          <h2 className="big">Notes from the lab bench.</h2>
          <p>Practical technical writing — the kind that shows expertise directly and needs no client&apos;s permission to publish.</p>
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
