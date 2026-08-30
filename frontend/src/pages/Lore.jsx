import React from 'react';
import ContentPage, { H2, H3 } from '../components/ContentPage';
import { Link } from 'react-router-dom';

const Lore = () => (
  <ContentPage path="/lore">
    <p>
      The mythology behind ENDURA is free to read — no login, no ownership required. Every drop,
      every garment and every Digital Artifact is drawn from this world. This is the origin of THE
      ORDER, the mirror-shard throne, the First Vessels and the factions behind each ENDURA piece.
    </p>

    <H2>THE ORDER and the Mirror-Shard Throne</H2>
    <p>
      In the beginning there was THE ORDER — the system that decided who rose and who was forgotten.
      Its power sat on the mirror-shard throne: a seat made of broken reflections, because every
      person who approached it saw a second version of themselves staring back. The throne was proof
      of the oldest law of this world — that everyone exists twice, and only those who face both
      selves are allowed to endure.
    </p>

    <H2>The First Vessels</H2>
    <p>
      When the old hierarchy shattered, its power did not vanish — it split into fragments and passed
      into the First Vessels: the first people to carry a shard of the throne and survive it. Each
      Vessel became the heart of a faction, and each faction was bound to a garment and a Digital
      Artifact. To wear the piece is to stand with the Vessel who carries it.
    </p>

    <H3>Kael Vestan — The Crownless Era</H3>
    <p>
      Kael Vestan carries the Crownless Shard, born from the myth of Icarus — golden wings, the climb
      toward the sun, and the collapse of every hierarchy that said some are above and some below.
      <Link to="/factions/crownless-era" className="text-primary underline">The Crownless Era</Link>{' '}
      stands for the fall of the crown and the freedom after it. Its garment is the{' '}
      <strong>Icarus Ascension</strong> tee, and its mantra is: <em>Nothing above. Nothing beneath.</em>
    </p>

    <H3>Draven Osk — The Forged</H3>
    <p>
      Draven Osk carries the Celestial Core, shaped by cosmic collision — impact, pressure, and the
      bull as the symbol of endurance that is made, not given. The Forged believe strength is the
      residue of what you survive.{' '}
      <Link to="/factions/the-forged" className="text-primary underline">The Forged</Link> is bound to the{' '}
      <strong>Cosmic Bull</strong> tee, and its mantra is: <em>Built through impact. Forged through pressure.</em>
    </p>

    <H3>Lyra Voss — The Hollow</H3>
    <p>
      Lyra Voss carries the Silence Codex, written for those who feel too deeply — the reaching
      hands, the space between connection and emptiness. The Hollow is the faction of the liminal,
      the in-between, the quiet.{' '}
      <Link to="/factions/the-hollow" className="text-primary underline">The Hollow</Link> is bound to the{' '}
      <strong>Liminal Touch</strong> tee, and its mantra is: <em>Between everything. And nothing.</em>
    </p>

    <H2>How the mythology becomes a garment</H2>
    <p>
      Every ENDURA piece follows the same structure: an origin drawn from myth, the symbolism it
      carries, the faction it belongs to, and a closing mantra. The physical garment is the visible
      half; the Digital Artifact bound to it is the second half, kept in{' '}
      <Link to="/vault" className="text-primary underline">The Vault</Link>. Buying across factions
      unlocks fragments that assemble into higher-tier artifacts — Epic and, eventually, Legendary —
      the same way the throne once fractured into shards.
    </p>

    <H2>Where to begin</H2>
    <p>
      Start with the{' '}
      <Link to="/collections" className="text-primary underline">Genesis collection</Link> — three
      Rare-tier tees, one for each of the first three factions — or read more about the factions on
      the <Link to="/cult" className="text-primary underline">factions page</Link>. Whichever piece
      you choose, you are choosing which Vessel you stand with, and which version of yourself you
      intend to endure as.
    </p>
  </ContentPage>
);

export default Lore;
