import React from 'react';
import SEO from './SEO';
import { ROUTES } from '../seo/routes';

/**
 * Minimal, on-brand layout for text/content SEO pages (About, FAQ, Lore).
 * Uses the existing dark theme + fonts. Does not touch any existing page/UI.
 */
const ContentPage = ({ path, schema, children }) => {
  const meta = ROUTES[path] || {};
  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-24 px-6">
      <SEO
        fullTitle={meta.title}
        description={meta.description}
        canonical={path}
        schema={schema}
      />
      <article className="max-w-3xl mx-auto">
        <h1 className="font-[Oswald] text-3xl md:text-5xl font-bold tracking-tight text-white mb-8">
          {meta.h1}
        </h1>
        <div className="prose-endura space-y-6 text-white/70 leading-relaxed text-[15px] md:text-base">
          {children}
        </div>
      </article>
    </div>
  );
};

export const H2 = ({ children }) => (
  <h2 className="font-[Oswald] text-xl md:text-2xl font-semibold text-white/90 mt-10 mb-3 tracking-wide">
    {children}
  </h2>
);

export const H3 = ({ children }) => (
  <h3 className="text-base md:text-lg font-semibold text-primary mt-6 mb-2">{children}</h3>
);

export default ContentPage;
