/** Minuscules sans accents, espaces normalisés : base commune de la recherche (build et navigateur). */
export const normalize = (s: string): string =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/** Vrai si chaque mot de la requête apparaît dans le texte normalisé. */
export const matches = (haystack: string, query: string): boolean => {
  const words = normalize(query).split(' ').filter(Boolean);
  return words.every((w) => haystack.includes(w));
};
