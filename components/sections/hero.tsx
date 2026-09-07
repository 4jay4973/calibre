export function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div>
          <span className="eyebrow">Paint · Coating · Resin technical consultancy</span>
          <h1>
            The formulation problems that quietly cost you <span className="q">margin</span> — measured and solved.
          </h1>
          <p className="hero-lead">
            We help paint and coating manufacturers develop better formulations, fix failing
            ones, and turn lab work into production your team can repeat.
          </p>
          <div className="hero-actions">
            <a href="#contact" className="btn btn-primary">Discuss a project</a>
            <a href="#approach" className="btn btn-ghost">See how we work</a>
          </div>
          <p className="hero-note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
              <path d="M12 2 4 6v6c0 5 3.4 8 8 10 4.6-2 8-5 8-10V6l-8-4Z" />
            </svg>
            Every engagement runs under NDA. Your formulations and process data stay yours.
          </p>
        </div>
        <div className="hero-fig-wrap">
          <svg className="section-fig" viewBox="0 0 480 360" fill="none" xmlns="http://www.w3.org/2000/svg"
            role="img" aria-label="Cross-section of a coating film with thickness measurement">
            <rect className="film f1" x="70" y="250" width="330" height="46" fill="#1E3138" />
            <text className="tick t1" x="82" y="278" fill="#8FA0A5" fontSize="12" fontFamily="var(--font-archivo)">Substrate</text>
            <rect className="film f2" x="70" y="220" width="330" height="30" fill="#2A4652" />
            <text className="tick t2" x="82" y="240" fill="#B9C6CA" fontSize="11" fontFamily="var(--font-archivo)">Primer</text>
            <rect className="film f3" x="70" y="188" width="330" height="32" fill="#35636F" />
            <text className="tick t3" x="82" y="209" fill="#DCE8EB" fontSize="11" fontFamily="var(--font-archivo)">Basecoat</text>
            <rect className="film f4" x="70" y="150" width="330" height="38" fill="#4E63FF" />
            <text className="tick t4" x="82" y="174" fill="#fff" fontSize="11" fontFamily="var(--font-archivo)">Topcoat</text>
            <line className="gauge-line" x1="400" y1="150" x2="400" y2="296" stroke="#4E63FF" strokeWidth="1.5" strokeDasharray="150" strokeDashoffset="150" />
            <line className="tick t1" x1="393" y1="150" x2="407" y2="150" stroke="#4E63FF" strokeWidth="1.5" />
            <line className="tick t4" x1="393" y1="296" x2="407" y2="296" stroke="#4E63FF" strokeWidth="1.5" />
            <g className="readout">
              <rect x="416" y="196" width="60" height="54" rx="1" fill="#4E63FF" />
              <text x="446" y="220" fill="#fff" fontSize="19" fontWeight="800" fontFamily="var(--font-archivo)" textAnchor="middle">146</text>
              <text x="446" y="238" fill="#D5DEDF" fontSize="10" fontFamily="var(--font-archivo)" textAnchor="middle">microns DFT</text>
            </g>
            <text className="tick t4" x="70" y="130" fill="#6A757B" fontSize="10.5" fontFamily="var(--font-archivo)">Measured film build · 4-layer system</text>
          </svg>
        </div>
      </div>
    </section>
  );
}
