export const PRICE_ON_REQUEST = 'Prix sur demande';

/** 12000 -> "12 000 FCFA" ; undefined -> "Prix sur demande". */
export function formatPrice(price?: number): string {
  if (price === undefined || price === null || Number.isNaN(price)) return PRICE_ON_REQUEST;
  const n = new Intl.NumberFormat('fr-FR').format(price).replace(/[   ]/g, ' ');
  return `${n} FCFA`;
}

/** [5000, 10000] -> "5 000 à 10 000 FCFA". */
export function formatPriceRange(range: [number, number]): string {
  const [min, max] = range;
  return `${formatPrice(min).replace(/\s*FCFA$/u, '')} à ${formatPrice(max)}`;
}

/** Libellé de prix d'une pièce : prix exact, sinon fourchette, sinon « Prix sur demande ». */
export function priceLabel(p: { price?: number | null; priceRange?: [number, number] | null }): string {
  if (p.price !== undefined && p.price !== null) return formatPrice(p.price);
  if (p.priceRange) return formatPriceRange(p.priceRange);
  return PRICE_ON_REQUEST;
}

/** Découpe un texte en paragraphes (séparés par une ligne vide). */
export function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function orLabel(value: string | undefined, fallback = 'À confirmer'): string {
  return value && value.trim() ? value : fallback;
}
