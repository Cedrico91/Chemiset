// @ts-check
import { defineConfig } from 'astro/config';

/**
 * SITE_URL  : origine publique (ex. https://cedrico91.github.io). Défaut : URL de démo.
 * BASE_PATH : sous-chemin de déploiement (ex. /la-chemise-africaine sur GitHub Pages). Défaut : racine.
 */
const site = process.env.SITE_URL ?? 'https://la-chemise-africaine.demo';
const base = (process.env.BASE_PATH ?? '/').replace(/\/+$/, '') || '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  build: { format: 'directory', inlineStylesheets: 'auto' },
});
