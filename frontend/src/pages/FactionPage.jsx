import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import ContentPage, { H2 } from '../components/ContentPage';
import { factionBySlug } from '../seo/factions';

const FactionPage = () => {
  const { slug } = useParams();
  const faction = factionBySlug(slug);

  if (!faction) return <Navigate to="/cult" replace />;

  return (
    <ContentPage path={`/factions/${faction.slug}`}>
      <p>{faction.intro}</p>

      <H2>Symbolism</H2>
      <p>{faction.symbolism}</p>

      <H2>First Vessel — {faction.vessel}</H2>
      <p>
        {faction.name} is led by First Vessel <strong>{faction.vessel}</strong>, who carries the{' '}
        <strong>{faction.artifact}</strong> — the digital artifact bound to this faction.
      </p>

      <H2>The garment</H2>
      <p>
        The {faction.name} is bound to the{' '}
        <Link to={`/product/${faction.teeSlug}`} className="text-primary underline">
          {faction.tee}
        </Link>{' '}
        tee — a Rare-tier piece paired with the {faction.artifact} artifact, redeemable in{' '}
        <Link to="/vault" className="text-primary underline">The Vault</Link>.
      </p>

      <p className="text-white/90 italic pt-2">&ldquo;{faction.mantra}&rdquo;</p>

      <H2>Explore more</H2>
      <p>
        Read the full{' '}
        <Link to="/lore" className="text-primary underline">ENDURA mythology</Link>, browse the{' '}
        <Link to="/collections" className="text-primary underline">Genesis collection</Link>, or see
        all <Link to="/cult" className="text-primary underline">factions</Link>.
      </p>
    </ContentPage>
  );
};

export default FactionPage;
