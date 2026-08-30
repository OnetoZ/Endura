// ─────────────────────────────────────────────────────────────────────────────
// Build-time prerenderer.
//
// Runs AFTER `vite build`. For every indexable route in src/seo/routes.js it
// writes dist/<route>/index.html with that route's own <title>, meta, canonical,
// OG/Twitter tags and a real static <body> (H1 + copy) — so crawlers that don't
// execute JavaScript (many AI answer-engine bots) still get unique, per-route
// HTML. React hydrates over it for real users.
//
// No framework migration, no native deps, no changes to the runtime app.
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROUTES, SITE } from '../src/seo/routes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = resolve(__dirname, '../dist');

const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function headFor(path, m) {
  const url = SITE.origin + (path === '/' ? '/' : path);
  const img = m.image || SITE.defaultImage;
  const t = esc(m.title);
  const d = esc(m.description);
  return [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" />`,
    m.keywords ? `<meta name="keywords" content="${esc(m.keywords)}" />` : '',
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    `<meta property="og:image" content="${img}" />`,
    `<meta property="twitter:card" content="summary_large_image" />`,
    `<meta property="twitter:url" content="${url}" />`,
    `<meta property="twitter:title" content="${t}" />`,
    `<meta property="twitter:description" content="${d}" />`,
    `<meta property="twitter:image" content="${img}" />`,
  ]
    .filter(Boolean)
    .join('\n  ');
}

function bodyFor(m) {
  const paras = (m.body || [])
    .map((p) => `        <p class="seo-text">${esc(p)}</p>`)
    .join('\n');
  return `      <header id="root-static-header">
        <h1>${esc(m.h1 || m.title)}</h1>
${paras}
        <nav class="static-nav">
          <a href="/">Home</a>
          <a href="/shop">Shop</a>
          <a href="/collections">Genesis Collection</a>
          <a href="/cult">Factions</a>
        </nav>
      </header>`;
}

const HEAD_RE = /<!-- SEO:HEAD:START[\s\S]*?SEO:HEAD:END -->/;
const BODY_RE = /<!-- SEO:BODY:START -->[\s\S]*?<!-- SEO:BODY:END -->/;

let template;
try {
  template = readFileSync(join(dist, 'index.html'), 'utf8');
} catch {
  console.error('[prerender] dist/index.html not found — run `vite build` first.');
  process.exit(1);
}

if (!HEAD_RE.test(template) || !BODY_RE.test(template)) {
  console.error('[prerender] SEO markers missing in built index.html. Aborting.');
  process.exit(1);
}

let count = 0;
for (const [path, meta] of Object.entries(ROUTES)) {
  if (!meta.indexable) continue;

  const html = template
    .replace(HEAD_RE, `<!-- SEO:HEAD (prerendered ${path}) -->\n  ${headFor(path, meta)}\n  <!-- /SEO:HEAD -->`)
    .replace(BODY_RE, `<!-- SEO:BODY (prerendered ${path}) -->\n${bodyFor(meta)}\n      <!-- /SEO:BODY -->`);

  const outFile = path === '/' ? join(dist, 'index.html') : join(dist, path, 'index.html');
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, html);
  count += 1;
  console.log(`[prerender] ${path.padEnd(14)} -> ${outFile.replace(dist, 'dist')}`);
}

console.log(`[prerender] done — ${count} route(s) prerendered.`);
