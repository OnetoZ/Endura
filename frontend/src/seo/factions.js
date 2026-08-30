// Faction data — drives /factions/<slug> pages, their SEO metadata and prerender.
// Grounded in the ENDURA lore (THE ORDER, First Vessels, tees + artifacts).

export const FACTIONS = [
  {
    slug: 'crownless-era',
    name: 'The Crownless Era',
    vessel: 'Kael Vestan',
    artifact: 'Crownless Shard',
    tee: 'Icarus Ascension',
    teeSlug: 'icarus-ascension',
    mantra: 'Nothing above. Nothing beneath.',
    intro:
      'The Crownless Era is led by First Vessel Kael Vestan, who carries the Crownless Shard. Born from the myth of Icarus — golden wings, the climb toward the sun, and the collapse of every hierarchy that said some are above and some below.',
    symbolism:
      'Its symbolism is the fall of the crown and the freedom after it: no throne, no rank, no one above or beneath. To wear the Crownless Era is to reject the hierarchy entirely.',
  },
  {
    slug: 'the-forged',
    name: 'The Forged',
    vessel: 'Draven Osk',
    artifact: 'Celestial Core',
    tee: 'Cosmic Bull',
    teeSlug: 'cosmic-bull',
    mantra: 'Built through impact. Forged through pressure.',
    intro:
      'The Forged is led by First Vessel Draven Osk, who carries the Celestial Core. Shaped by cosmic collision — impact, pressure, and the bull as the symbol of endurance that is made, not given.',
    symbolism:
      'Its symbolism is strength as residue: the belief that you are forged by what you survive. The Forged stands for pressure turned into power.',
  },
  {
    slug: 'the-hollow',
    name: 'The Hollow',
    vessel: 'Lyra Voss',
    artifact: 'Silence Codex',
    tee: 'Liminal Touch',
    teeSlug: 'liminal-touch',
    mantra: 'Between everything. And nothing.',
    intro:
      'The Hollow is led by First Vessel Lyra Voss, who carries the Silence Codex. Written for those who feel too deeply — the reaching hands, the space between connection and emptiness.',
    symbolism:
      'Its symbolism is the liminal and the in-between: the quiet space between everything and nothing. The Hollow stands for the ones who live in that gap.',
  },
];

export function factionBySlug(slug) {
  return FACTIONS.find((f) => f.slug === slug) || null;
}

// Route metadata for each faction, spread into ROUTES for prerender + sitemap.
export function factionRoutes() {
  const out = {};
  for (const f of FACTIONS) {
    out[`/factions/${f.slug}`] = {
      title: `${f.name} | ENDURA Factions`,
      description: `${f.name}, led by First Vessel ${f.vessel}. The faction bound to the ${f.tee} tee and the ${f.artifact} artifact.`,
      keywords: `${f.name} ENDURA, ${f.vessel}, ${f.artifact}, ${f.tee} tee`,
      h1: f.name,
      body: [f.intro, `${f.symbolism} Bound to the ${f.tee} tee and the ${f.artifact} digital artifact. Mantra: "${f.mantra}"`],
      indexable: true,
      priority: 0.6,
      changefreq: 'monthly',
    };
  }
  return out;
}
