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

import { faqSchema } from './faq.js';

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
  '/about': {
    title: 'About ENDURA | Founders & the “We Exist Twice” Story',
    description:
      'ENDURA was founded on one idea: every person exists twice. Meet the Bangalore founders behind India’s physical-and-digital streetwear brand.',
    keywords:
      'ENDURA founders streetwear Bangalore, about ENDURA, We Exist Twice, streetwear brand story India',
    h1: 'We Exist Twice',
    body: [
      'ENDURA was founded on one idea: every person exists twice — once in the physical world, once as a digital identity. We build premium streetwear for that truth, from Bangalore, India.',
      'Founded by a small in-house team (Sheldon, Ajay, Franklin and Aditya), ENDURA pairs every Rare-tier garment with a redeemable digital artifact, so what you wear also exists as something you own permanently in The Vault.',
    ],
    indexable: true,
    priority: 0.6,
    changefreq: 'monthly',
  },
  '/faq': {
    title: 'FAQ | Sizing, Shipping & Digital Artifacts | ENDURA',
    description:
      'Answers on ENDURA sizing, shipping across India, and how to redeem your Digital Artifact. Everything you need before you order.',
    keywords:
      'ENDURA FAQ, digital artifact redemption, ENDURA sizing, shipping India',
    h1: 'Frequently Asked Questions',
    jsonld: faqSchema,
    body: [
      'Common questions about ENDURA — our physical-and-digital streetwear, the Digital Artifact system, The Vault, sizing and shipping across India.',
      'ENDURA is a premium streetwear brand from Bangalore. Every garment is bound to a redeemable digital artifact; Genesis Rare-tier tees are priced under ₹3,000 as founding-cohort access.',
    ],
    indexable: true,
    priority: 0.6,
    changefreq: 'monthly',
  },
  '/lore': {
    title: 'The Lore of ENDURA | Mythology Behind the Brand',
    description:
      'The full mythology behind ENDURA — THE ORDER, the mirror-shard throne, the First Vessels, and the factions behind every drop. Free to read.',
    keywords:
      'mythology streetwear brand, ENDURA lore, THE ORDER origin story, First Vessels, faction mythology',
    h1: 'The Lore',
    body: [
      'The mythology behind ENDURA is free to read — no login required. THE ORDER, the mirror-shard throne, the First Vessels and the factions behind every drop.',
      'Kael Vestan leads The Crownless Era (Icarus Ascension tee, Crownless Shard). Draven Osk leads The Forged (Cosmic Bull tee, Celestial Core). Lyra Voss leads The Hollow (Liminal Touch tee, Silence Codex).',
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
