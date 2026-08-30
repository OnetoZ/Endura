// SEO-friendly product slugs derived from the product name — no backend change.
// e.g. "Icarus Ascension" -> "icarus-ascension"
export function slugify(str = '') {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Canonical PDP path for a product (prefers slug, falls back to id).
export function productPath(product) {
  if (!product) return '/shop';
  const slug = slugify(product.name);
  return slug ? `/product/${slug}` : `/product/${product._id || product.id}`;
}

// Match a product from a list by slug OR raw id (keeps old /product/<id> links working).
export function findProduct(products = [], idOrSlug) {
  if (!idOrSlug) return null;
  return (
    products.find((p) => p._id === idOrSlug || p.id === idOrSlug) ||
    products.find((p) => slugify(p.name) === idOrSlug) ||
    null
  );
}
