// FAQ content — single source for the /faq page AND its FAQPage JSON-LD schema.
// Plain answers (no hype) so answer-engines can quote them directly.

export const FAQS = [
  {
    q: 'What is ENDURA?',
    a: 'ENDURA is a premium physical-and-digital streetwear brand from Bangalore, India. Every piece "exists twice": a physical Rare-tier garment paired with a redeemable digital artifact stored in The Vault.',
  },
  {
    q: 'How do ENDURA Digital Artifacts work?',
    a: 'Each garment is bound to a Digital Artifact. After purchase you redeem the artifact into The Vault. Artifacts have rarity tiers — Common, Rare, Epic, Legendary — and buying across categories unlocks fragments that assemble into higher-tier artifacts.',
  },
  {
    q: 'What is The Vault?',
    a: 'The Vault is your personal archive of ENDURA Digital Artifacts. It stores the collectibles bound to the garments you own and tracks the fragments you unlock toward Epic and Legendary artifacts.',
  },
  {
    q: 'What is the Genesis collection?',
    a: 'Genesis is ENDURA\u2019s first drop: three Rare-tier tees — Icarus Ascension (The Crownless Era), Cosmic Bull (The Forged) and Liminal Touch (The Hollow) — each bound to its own digital artifact.',
  },
  {
    q: 'How much do ENDURA tees cost?',
    a: 'Genesis Rare-tier tees are priced under \u20B93,000 as founding-cohort access. Current pricing is shown on each product page.',
  },
  {
    q: 'Does ENDURA ship across India?',
    a: 'Yes. ENDURA ships pan-India from Bangalore. Delivery timelines and charges are shown at checkout.',
  },
  {
    q: 'What sizes are available?',
    a: 'ENDURA tees are offered in standard unisex sizes with an oversized fit. Check the size guide on each product page before ordering.',
  },
  {
    q: 'How do I redeem my Digital Artifact after buying a tee?',
    a: 'Once your order is confirmed, the bound Digital Artifact becomes available to redeem into your Vault from your ENDURA account.',
  },
];

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};
