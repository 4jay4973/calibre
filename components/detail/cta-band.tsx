/**
 * "Discuss a project" call-to-action strip. Presentational only, with sensible
 * defaults that point at the homepage contact section. Styled with `.cta-band`.
 */
export function CtaBand({
  title = "Discuss a project under NDA.",
  text = "Tell us the finish, the failure or the target — we'll tell you whether we can help, and how.",
  actionLabel = "Start a conversation",
  actionHref = "/#contact",
}: {
  title?: string;
  text?: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <section className="cta-band">
      <div className="wrap cta-inner">
        <div>
          <h2>{title}</h2>
          {text ? <p>{text}</p> : null}
        </div>
        <a className="btn btn-primary" href={actionHref}>
          {actionLabel}
        </a>
      </div>
    </section>
  );
}
