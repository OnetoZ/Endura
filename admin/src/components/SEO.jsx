import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO Component for managing page metadata.
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Meta description
 * @param {string} props.canonical - Canonical URL (optional)
 * @param {string} props.type - OpenGraph type (default: 'website')
 * @param {string} props.image - OpenGraph image URL (optional)
 * @param {Object} props.schema - JSON-LD schema object (optional)
 */
const SEO = ({ title, description, canonical, type = 'website', image, schema }) => {
  const siteName = 'ENDURA';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const url = canonical ? `https://wearendura.com${canonical}` : 'https://wearendura.com';

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* OpenGraph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* JSON-LD Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
