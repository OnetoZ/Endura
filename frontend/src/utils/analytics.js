// Google Analytics 4 loader — env-driven.
// Set VITE_GA_MEASUREMENT_ID (e.g. "G-XXXXXXXXXX") in the Vercel/env config.
// If unset, nothing loads (no broken placeholder pageviews).

let initialized = false;

export function initAnalytics() {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
  if (!id || initialized || typeof window === 'undefined') return;
  initialized = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', id);
}

// SPA route-change pageview. Call on pathname change.
export function trackPageview(path) {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
  if (!id || typeof window === 'undefined' || !window.gtag) return;
  window.gtag('config', id, { page_path: path });
}
