import type { SwatchKind } from "@/lib/content";

// The finish-swatch visual, keyed by coating market. Mirrors the swatch in
// components/sections/sector-showcase.tsx; that copy isn't exported and the
// section file is off-limits, so the sector detail page carries its own shared
// copy. Uses the same global classes (.swatch / .sw-* / .tex-* / .swatch-tag).
function SwatchTexture({ kind }: { kind: SwatchKind }) {
  switch (kind) {
    case "arch":
      return (
        <svg className="tex tex-matte" preserveAspectRatio="none" viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg">
          <filter id="fsnm"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
          <rect width="400" height="280" filter="url(#fsnm)" opacity="0.5" />
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
            <filter id="fsnc"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
            <rect width="400" height="280" filter="url(#fsnc)" opacity="0.55" />
          </svg>
          <div className="tex tex-trowel" />
        </>
      );
  }
}

const swatchClass: Record<SwatchKind, string> = {
  arch: "sw-arch", ind: "sw-ind", wood: "sw-wood", auto: "sw-auto", const: "sw-const",
};

/** Presentational finish swatch with an optional corner label. */
export function FinishSwatch({ kind, label }: { kind: SwatchKind; label?: string }) {
  return (
    <div className={`swatch ${swatchClass[kind]}`}>
      <SwatchTexture kind={kind} />
      {label ? <span className="swatch-tag">{label}</span> : null}
    </div>
  );
}
