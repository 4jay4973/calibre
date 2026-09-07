"use client";
import { useState } from "react";

// Items with their own page point at the real route; homepage-only sections use
// "/#section" so they work from any page (navigate home, then scroll). Sectors
// has no index page, so it stays a homepage anchor.
const links = [
  { href: "/services", label: "Capabilities" },
  { href: "/#sectors", label: "Sectors" },
  { href: "/#approach", label: "Approach" },
  { href: "/work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/insights", label: "Insights" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="wrap nav">
        <a className="brand" href="/" aria-label="Calibre — home">
          Calibre<span className="dot">.</span> <small>Coating&nbsp;Consultancy</small>
        </a>
        <nav className={`nav-links ${open ? "open" : ""}`}>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav-cta">
          <a href="/#contact" className="btn btn-primary">Discuss a project</a>
          <button
            className="menu-btn"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
