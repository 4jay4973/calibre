"use client";
import { useState } from "react";

const links = [
  { href: "#capabilities", label: "Capabilities" },
  { href: "#sectors", label: "Sectors" },
  { href: "#approach", label: "Approach" },
  { href: "#cases", label: "Work" },
  { href: "#about", label: "About" },
  { href: "/insights", label: "Insights" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="wrap nav">
        <div className="brand">
          Calibre<span className="dot">.</span> <small>Coating&nbsp;Consultancy</small>
        </div>
        <nav className={`nav-links ${open ? "open" : ""}`}>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav-cta">
          <a href="#contact" className="btn btn-primary">Discuss a project</a>
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
