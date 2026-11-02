/**
 * Préfixe de base du site (vide à la racine, « /la-chemise-africaine » sur GitHub Pages).
 * Tout lien ou chemin d'image interne passe par withBase() pour fonctionner dans les deux cas.
 */
const base = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '');

export const withBase = (path: string): string => `${base}${path.startsWith('/') ? path : `/${path}`}`;

export const PLACEHOLDER = withBase('/images/placeholder.svg');
