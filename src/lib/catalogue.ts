import { catalogue } from '../data/catalogue';
import type { Category, CategoryId, Collection, Designer, Product } from '../data/types';
import { withBase } from './url';
import { normalize } from './text';

/** Vérifie la cohérence du catalogue ; fait échouer le build sur toute erreur. */
export function assertCatalogueIntegrity(): void {
  const errors: string[] = [];
  const dup = (label: string, slugs: string[]) => {
    const seen = new Set<string>();
    for (const s of slugs) {
      if (seen.has(s)) errors.push(`${label} en double : "${s}"`);
      seen.add(s);
    }
  };
  dup('Créateur', catalogue.designers.map((d) => d.slug));
  dup('Collection', catalogue.collections.map((c) => c.slug));
  dup('Produit', catalogue.products.map((p) => p.slug));

  const designers = new Set(catalogue.designers.map((d) => d.slug));
  const collections = new Set(catalogue.collections.map((c) => c.slug));
  const categories = new Set(catalogue.categories.map((c) => c.id));

  for (const p of catalogue.products) {
    if (!designers.has(p.designerSlug)) errors.push(`Produit "${p.slug}" : créateur inconnu "${p.designerSlug}"`);
    if (p.collectionSlug && !collections.has(p.collectionSlug))
      errors.push(`Produit "${p.slug}" : collection inconnue "${p.collectionSlug}"`);
    if (!categories.has(p.category)) errors.push(`Produit "${p.slug}" : catégorie inconnue "${p.category}"`);
    if (!p.images.length) errors.push(`Produit "${p.slug}" : aucune image`);
    if (p.oldPrice !== undefined && (p.price === undefined || p.oldPrice <= p.price))
      errors.push(`Produit "${p.slug}" : oldPrice doit être supérieur à price`);
    if (p.priceRange) {
      if (p.price !== undefined) errors.push(`Produit "${p.slug}" : price et priceRange sont exclusifs`);
      if (!(p.priceRange[0] > 0 && p.priceRange[1] > p.priceRange[0]))
        errors.push(`Produit "${p.slug}" : priceRange doit être [min, max] avec min < max`);
    }
  }
  if (errors.length) {
    throw new Error(`Catalogue invalide :\n - ${errors.join('\n - ')}`);
  }
}
assertCatalogueIntegrity();

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

export const categories: Category[] = catalogue.categories;
export const designers: Designer[] = catalogue.designers;
export const collections: Collection[] = [...catalogue.collections].sort(byOrder);
export const products: Product[] = [...catalogue.products].sort(byOrder);

export const getCategory = (id: string) => categories.find((c) => c.id === id);
export const getDesigner = (slug: string) => designers.find((d) => d.slug === slug);
export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

/** Créateur d'un produit (garanti par assertCatalogueIntegrity). */
export const designerOf = (p: Product): Designer => getDesigner(p.designerSlug)!;

export const productsByCategory = (id: CategoryId) => products.filter((p) => p.category === id);
export const productsByDesigner = (slug: string) => products.filter((p) => p.designerSlug === slug);
export const productsByCollection = (slug: string) => products.filter((p) => p.collectionSlug === slug);

export const featuredProducts = (n = 8) => {
  const featured = products.filter((p) => p.featured);
  const rest = products.filter((p) => !p.featured);
  return [...featured, ...rest].slice(0, n);
};

export const featuredCollections = () => collections.filter((c) => c.featured);

/** Pièces en offre spéciale (prix barré renseigné). */
export const promoProducts = () => products.filter((p) => p.oldPrice !== undefined && p.price !== undefined);

/** Remise en pourcentage entier (0 si pas d'offre). */
export const discountPercent = (p: Product): number =>
  p.oldPrice && p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;

/** Même créateur d'abord, puis même catégorie, sans le produit courant. */
export function relatedProducts(product: Product, n = 4): Product[] {
  const others = products.filter((p) => p.slug !== product.slug);
  const sameDesigner = others.filter((p) => p.designerSlug === product.designerSlug);
  const sameCategory = others.filter(
    (p) => p.designerSlug !== product.designerSlug && p.category === product.category,
  );
  const remaining = others.filter((p) => !sameDesigner.includes(p) && !sameCategory.includes(p));
  return [...sameDesigner, ...sameCategory, ...remaining].slice(0, n);
}

export const countByCategory = (id: CategoryId) => productsByCategory(id).length;
export const countByCollection = (slug: string) => productsByCollection(slug).length;
export const countByDesigner = (slug: string) => productsByDesigner(slug).length;

export const categoryPath = (id: CategoryId | 'tous') => withBase(id === 'tous' ? '/catalogue/' : `/catalogue/${id}/`);
export const productPath = (p: Product) => withBase(`/produits/${p.slug}/`);
export const designerPath = (d: Designer) => withBase(`/createurs/${d.slug}/`);
export const collectionPath = (c: Collection) => withBase(`/collections/${c.slug}/`);

/** Nouveautés d'abord, puis les pièces mises en avant. */
export const newProducts = (n = 8) => {
  const fresh = products.filter((p) => p.status?.includes('nouveaute'));
  const rest = products.filter((p) => !fresh.includes(p) && p.featured);
  return [...fresh, ...rest].slice(0, n);
};

/** Pages de la boutique et d'aide. */
export const shopPaths = {
  cart: withBase('/panier/'),
  wishlist: withBase('/favoris/'),
  search: withBase('/recherche/'),
  offers: withBase('/offres/'),
  newArrivals: withBase('/nouveautes/'),
  shirts: withBase('/collections/la-chemise/'),
  sizeGuide: withBase('/guide-des-tailles/'),
  delivery: withBase('/livraison-retours/'),
  faq: withBase('/faq/'),
  legal: withBase('/mentions-legales/'),
  about: withBase('/a-propos/'),
  contact: withBase('/a-propos/#contact'),
  howToOrder: withBase('/a-propos/#commander'),
};

/**
 * Données minimales d'une pièce, sérialisées dans `data-product` pour le panier et les favoris
 * (voir src/scripts/store.ts). Doit rester cohérent avec l'interface ProductData.
 */
export const productClientData = (p: Product): string =>
  JSON.stringify({
    slug: p.slug,
    name: p.name,
    designer: designerOf(p).name,
    price: p.price ?? null,
    priceRange: p.priceRange ?? null,
    oldPrice: p.oldPrice ?? null,
    image: p.images[0].src,
    url: productPath(p),
    sizes: p.sizes ?? [],
  });

/** Texte normalisé (sans accents) dans lequel la recherche cherche chaque mot de la requête. */
export const searchText = (p: Product): string => {
  const d = designerOf(p);
  const cat = getCategory(p.category)?.label ?? '';
  const col = p.collectionSlug ? getCollection(p.collectionSlug)?.title ?? '' : '';
  return normalize(
    [p.name, d.name, d.country, cat, col, p.description, p.materials ?? '', ...(p.colors ?? []), ...(p.status ?? [])].join(' '),
  );
};
