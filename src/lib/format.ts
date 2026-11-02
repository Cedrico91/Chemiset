export const PRICE_ON_REQUEST = 'Prix sur demande';

/** 12000 -> "12 000 FCFA" ; undefined -> "Prix sur demande". */
export function formatPrice(price?: number): string {
  if (price === undefined || price === null || Number.isNaN(price)) return PRICE_ON_REQUEST;
  const n = new Intl.NumberFormat('fr-FR').format(price).replace(/[   ]/g, ' ');
  return `${n} FCFA`;
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
