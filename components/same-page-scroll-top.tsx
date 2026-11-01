"use client";
import { useEffect } from "react";

// Next 16 keeps the scroll position when a link points at the page you are
// already on (Next 15 jumped to the top). This restores the old behaviour
// site-wide with one delegated listener, without touching individual links:
// a plain left-click on an internal link to the current path (no #hash)
// scrolls to the top instantly. Hash links (/#about) are left to the browser.
export function SamePageScrollTop() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement)) return;
      if (a.target && a.target !== "_self") return;
      if (a.origin !== location.origin || a.hash) return;
      if (a.pathname !== location.pathname || a.search !== location.search) return;
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
