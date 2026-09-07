"use client";
import { useRef, useState } from "react";
import type { Sector, SwatchKind } from "@/lib/content";

/** The finish texture rendered inside each swatch, keyed by coating market. */
function SwatchTexture({ kind }: { kind: SwatchKind }) {
  switch (kind) {
    case "arch":
      return (
        <svg className="tex tex-matte" preserveAspectRatio="none" viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg">
          <filter id="nm"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
          <rect width="400" height="280" filter="url(#nm)" opacity="0.5" />
        </svg>
      );
    case "ind":
      return <div className="tex tex-steel" />;
    case "wood":
      return (
        <>
          <svg className="tex" preserveAspectRatio="none" viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#5c3a19" strokeWidth="1.4" opacity="0.28">
            <path d="M46 0c14 60-10 120 6 280" /><path d="M104 0c10 70-12 130 4 280" /><path d="M170 0c16 55-8 125 8 280" />
            <path d="M238 0c8 66-14 128 2 280" /><path d="M306 0c14 60-10 122 6 280" /><path d="M360 0c9 64-12 130 5 280" />
          </svg>
          <div className="tex tex-woodgloss" />
        </>
      );
    case "auto":
      return <div className="tex tex-gloss" />;
    case "const":
      return (
        <>
          <svg className="tex tex-matte" preserveAspectRatio="none" viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg">
            <filter id="nc"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
            <rect width="400" height="280" filter="url(#nc)" opacity="0.55" />
          </svg>
          <div className="tex tex-trowel" />
        </>
      );
  }
}

const swatchClass: Record<SwatchKind, string> = {
  arch: "sw-arch", ind: "sw-ind", wood: "sw-wood", auto: "sw-auto", const: "sw-const",
};

export function SectorShowcase({ sectors }: { sectors: Sector[] }) {
  const [active, setActive] = useState(0);
  const rowsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const fine =
    typeof window !== "undefined" &&
    window.matchMedia("(hover:hover) and (pointer:fine)").matches;

  function onKey(e: React.KeyboardEvent, i: number) {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      const n = (i + 1) % sectors.length;
      setActive(n);
      rowsRef.current[n]?.focus();
    }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      const n = (i - 1 + sectors.length) % sectors.length;
      setActive(n);
      rowsRef.current[n]?.focus();
    }
  }

  return (
    <section id="sectors" className="sectors">
      <div className="wrap">
        <div className="sec-head">
          <div className="kicker">Who we work with</div>
          <h2 className="big">Manufacturers across five coating markets.</h2>
          <p>Each market carries its own chemistry, finish and failure modes. Choose the one that&apos;s yours.</p>
        </div>

        <div className="showcase">
          <div className="sector-list" role="tablist" aria-label="Coating markets">
            {sectors.map((s, i) => (
              <button
                key={s.slug}
                ref={(el) => { rowsRef.current[i] = el; }}
                className={`srow ${i === active ? "is-active" : ""}`}
                role="tab"
                aria-selected={i === active}
                aria-controls={`sp-${s.slug}`}
                onClick={() => setActive(i)}
                onMouseEnter={() => fine && setActive(i)}
                onKeyDown={(e) => onKey(e, i)}
              >
                <span className="srow-name">{s.name}</span>
                <svg className="srow-arrow" width="26" height="14" viewBox="0 0 26 14" fill="none" strokeWidth="2">
                  <path d="M1 7h22M18 2l5 5-5 5" />
                </svg>
              </button>
            ))}
          </div>

          <div className="sector-preview">
            {sectors.map((s, i) => (
              <div
                key={s.slug}
                id={`sp-${s.slug}`}
                role="tabpanel"
                className={`sector-panel ${i === active ? "is-active" : ""}`}
              >
                <div className={`swatch ${swatchClass[s.swatch]}`}>
                  <SwatchTexture kind={s.swatch} />
                  <span className="swatch-tag">{s.finishLabel}</span>
                </div>
                <div className="panel-body">
                  <p>{s.description}</p>
                  <div className="prod-label">Products we help build</div>
                  <div className="prod-chips">
                    {s.products.map((p) => (<span key={p}>{p}</span>))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
