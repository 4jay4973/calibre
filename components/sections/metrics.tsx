import { getMetrics } from "@/lib/content";
import { CountUp } from "@/components/ui/count-up";

export async function Metrics() {
  const metrics = await getMetrics();
  return (
    <section className="metrics">
      <div className="wrap">
        <div className="metrics-inner">
          {metrics.map((m, i) => (
            <div className="metric" key={i}>
              <div className="num tnum">
                <CountUp value={m.value} />
                {m.suffix ? <span className="u">{m.suffix}</span> : null}
              </div>
              <div className="lbl">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
