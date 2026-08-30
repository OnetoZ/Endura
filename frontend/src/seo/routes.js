// ─────────────────────────────────────────────────────────────────────────────
// ENDURA — Single source of truth for per-route SEO metadata.
//
// Used by BOTH:
//   • the runtime <SEO> component (react-helmet-async) for JS-capable crawlers
//   • scripts/prerender.mjs, which bakes this into static per-route HTML so
//     non-JS crawlers (many AI answer-engine bots) see real <title>/meta/H1/body.
//
// Titles here are the FULL <title> (no runtime prefixing). Descriptions are
// kept < 160 chars per the client SEO checklist.
// ─────────────────────────────────────────────────────────────────────────────

export const SITE = {
  name: 'ENDURA',
  origin: 'https://wearendura.com',
  defaultImage: 'https://wearendura.com/image.png',
  locality: 'Bengaluru',
  region: 'Karnataka',
};

// path -> metadata. `indexable: false` => excluded from prerender + sitemap.
export const ROUTES = {
  '/': {
    title: 'ENDURA — Premium Streetwear, Physical & Digital',
    description:
      'Premium streetwear from Bangalore, India. Every ENDURA piece exists twice — physical garment, digital artifact. Shop the Genesis drop.',
    keywords:
      'premium streetwear brand India, luxury streetwear India, physical and digital streetwear, mythology streetwear brand, Bangalore streetwear brand',
    h1: 'ENDURA — Premium Streetwear, Physical & Digital',
    body: [
      'ENDURA is a premium streetwear brand from Bangalore, India, built on one idea: every piece exists twice — once as a physical garment, once as a digital artifact bound to it.',
      'Each drop pairs a Rare-tier tee with a redeemable digital collectible in The Vault. Founded for the few who build identity through resistance and substance, not the masses. Explore the Genesis collection — three tees, three factions, capped access.',
    ],
    indexable: true,
    priority: 1.0,
    changefreq: 'weekly',
  },
  '/shop': {
    title: 'Shop Premium Streetwear Drops | ENDURA India',
    description:
      "Shop ENDURA's Genesis collection — Rare-tier tees paired with redeemable digital artifacts. Founding cohort pricing, capped units.",
    keywords:
      'buy premium streetwear India online, oversized t-shirts India, graphic tees India, exclusive streetwear drops',
    h1: 'Shop the Genesis Collection',
    body: [
      "Browse ENDURA's current inventory — the Genesis collection of three Rare-tier tees, each bound to a digital artifact redeemable in The Vault.",
      'This is founding-cohort access to India\u2019s first physical-and-digital streetwear brand: premium fabric, mythology-driven design, and a limited window on entry.',
    ],
    indexable: true,
    priority: 0.9,
    changefreq: 'weekly',
  },
  '/collections': {
    title: 'Genesis Collection | Rare Tees + Digital Artifacts | ENDURA',
    description:
      'Explore the ENDURA Genesis collection — Rare-tier streetwear tees, each bound to a digital artifact. Premium physical assets crafted in India.',
    keywords:
      'Genesis bundle streetwear, Rare-tier streetwear tees, mythology streetwear India, physical assets',
    h1: 'The Genesis Collection',
    body: [
      'The Genesis collection is ENDURA\u2019s first drop — Rare-tier tees, each paired with a digital artifact that unlocks progress toward the Epic Genesis Artifact.',
      'Every garment carries its faction\u2019s mythology: origin, symbolism, and a closing mantra. Owned as a physical piece, mirrored as a permanent digital collectible.',
    ],
    indexable: true,
    priority: 0.8,
    changefreq: 'weekly',
  },
  '/cult': {
    title: 'The Factions of ENDURA | Mythology Behind the Brand',
    description:
      'Meet the factions of ENDURA — The Crownless Era, The Forged, and The Hollow. The mythology and First Vessels behind every drop.',
    keywords:
      'mythology streetwear brand, ENDURA factions, The Crownless Era, The Forged, The Hollow',
    h1: 'The Factions',
    body: [
      'ENDURA is built on a living mythology — THE ORDER, the mirror-shard throne, and the First Vessels who lead each faction.',
      'The Crownless Era, The Forged, and The Hollow each bind a tee to a digital artifact and a story. Discover the world behind every drop.',
    ],
    indexable: true,
    priority: 0.7,
    changefreq: 'monthly',
  },
  // Protected / private — never indexed or prerendered.
  '/vault': { title: 'The Vault | ENDURA', description: '', indexable: false },
};

export function seoFor(pathname) {
  return ROUTES[pathname] || null;
}
