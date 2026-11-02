#!/usr/bin/env node
/**
 * Télécharge les visuels d'illustration (Unsplash / Pexels, licences libres)
 * et les redimensionne en WebP dans public/images/.
 *
 * Usage : npm run images            (ne retélécharge pas les fichiers déjà présents)
 *         npm run images -- --force (écrase)
 *
 * Pour remplacer une photo par une vraie photo de la boutique : déposez simplement
 * votre fichier au même chemin dans public/images/ (même nom), puis ajustez
 * width/height dans src/data/catalogue.ts si le ratio change.
 */
import { mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'public', 'images');
const force = process.argv.includes('--force');

const U = (id) => `https://images.unsplash.com/photo-${id}?w=1800&q=82&fm=jpg&fit=max`;
const P = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1800`;

/** Tailles cibles par dossier : [largeur, hauteur]. */
const SIZES = {
  hero: null, // défini par entrée
  products: [1200, 1600],
  designers: [800, 1000],
  collections: [1600, 1000],
  misc: [1600, 1200],
};

/** dest (relatif à public/images), url, [w,h] optionnel, position de cadrage */
export const MANIFEST = [
  // ---- Hero
  { dest: 'hero/hero-desktop.webp', url: P('37786275'), size: [1920, 1080], credit: 'Pexels' },
  { dest: 'hero/hero-mobile.webp', url: U('1696962678565-bee84e6b9cb6'), size: [1080, 1350], credit: 'Eduardo Espinoza / Unsplash' },

  // ---- Divers (à propos, bandeau concept)
  { dest: 'misc/atelier-tissus.webp', url: P('8655018'), credit: 'Pexels' },
  { dest: 'misc/batik.webp', url: P('28855659'), credit: 'Pexels' },
  { dest: 'misc/duo-createurs.webp', url: P('39929278'), size: [1200, 1500], credit: 'Pexels' },

  // ---- Collections
  { dest: 'collections/la-chemise.webp', url: U('1663044022557-7d5d4c1d5318'), credit: 'Delight Dzansi / Unsplash' },
  { dest: 'collections/ceremonies.webp', url: P('35069469'), credit: 'Pexels' },
  { dest: 'collections/lumiere-de-cotonou.webp', url: P('39853986'), credit: 'Pexels' },
  { dest: 'collections/atelier-tissus.webp', url: U('1768212565426-58b089b6386d'), credit: 'WyteShot / Unsplash' },

  // ---- Créateurs (portraits 4:5)
  { dest: 'designers/ayaba-hounkpe.webp', url: U('1531123414780-f74242c2b052'), credit: 'Prince Akachi / Unsplash' },
  { dest: 'designers/kofi-mensah.webp', url: P('17451347'), credit: 'Pexels' },
  { dest: 'designers/adaeze-okafor.webp', url: P('9509321'), credit: 'Pexels' },
  { dest: 'designers/sekou-diallo.webp', url: U('1628375385883-6e086364f66d'), credit: 'DCL 650 / Unsplash' },
  { dest: 'designers/nadege-kouassi.webp', url: P('20145326'), credit: 'Pexels' },
  { dest: 'designers/elom-agbeko.webp', url: U('1630494693052-5bef2683bcaa'), credit: 'Bismark Owusu-Yeboah / Unsplash' },

  // ---- Produits (3:4) — FEMME
  { dest: 'products/robe-ganvie-1.webp', url: P('11912146'), credit: 'Pexels' },
  { dest: 'products/robe-ganvie-2.webp', url: P('30088728'), credit: 'Pexels' },
  { dest: 'products/ensemble-ouidah-1.webp', url: P('35364050'), credit: 'Pexels' },
  { dest: 'products/ensemble-ouidah-2.webp', url: P('8985982'), credit: 'Pexels' },
  { dest: 'products/chemise-porto-novo-1.webp', url: U('1709809081557-78f803ce93a0'), credit: 'Lola Azizada / Unsplash' },
  { dest: 'products/chemise-porto-novo-2.webp', url: U('1784160053635-424cf07f567c'), credit: 'McFollis / Unsplash' },
  { dest: 'products/robe-abomey-1.webp', url: U('1663044023437-6b3f9be28a90'), credit: 'Delight Dzansi / Unsplash' },
  { dest: 'products/robe-abomey-2.webp', url: U('1663044022968-baba8bb04e23'), credit: 'Delight Dzansi / Unsplash' },
  { dest: 'products/tunique-seme-1.webp', url: P('31739120'), credit: 'Pexels' },
  { dest: 'products/tunique-seme-2.webp', url: P('36467264'), credit: 'Pexels' },
  { dest: 'products/jupe-possotome-1.webp', url: P('20419138'), credit: 'Pexels' },
  { dest: 'products/jupe-possotome-2.webp', url: P('31871810'), credit: 'Pexels' },
  { dest: 'products/robe-grand-popo-1.webp', url: U('1625646741211-711bdd65c570'), credit: 'Rohan Odhiambo / Unsplash' },
  { dest: 'products/robe-grand-popo-2.webp', url: U('1611853904829-6d0f4034ce2f'), credit: 'Jan Canty / Unsplash' },
  { dest: 'products/ensemble-dassa-1.webp', url: P('10698019'), credit: 'Pexels' },
  { dest: 'products/ensemble-dassa-2.webp', url: P('34584329'), credit: 'Pexels' },

  // ---- Produits — HOMME
  { dest: 'products/chemise-cotonou-1.webp', url: P('19410933'), credit: 'Pexels' },
  { dest: 'products/chemise-cotonou-2.webp', url: P('6568253'), credit: 'Pexels' },
  { dest: 'products/chemise-dahomey-1.webp', url: U('1556452576-3e2d58536f62'), credit: 'Tânia Mousinho / Unsplash' },
  { dest: 'products/chemise-dahomey-2.webp', url: U('1602699121555-2640db5a4639'), credit: "De'Andre Bush / Unsplash" },
  { dest: 'products/tunique-natitingou-1.webp', url: P('16136336'), credit: 'Pexels' },
  { dest: 'products/tunique-natitingou-2.webp', url: P('36029405'), credit: 'Pexels' },
  { dest: 'products/ensemble-kandi-1.webp', url: P('29824679'), credit: 'Pexels' },
  { dest: 'products/ensemble-kandi-2.webp', url: P('30729642'), credit: 'Pexels' },
  { dest: 'products/boubou-parakou-1.webp', url: P('34821105'), credit: 'Pexels' },
  { dest: 'products/boubou-parakou-2.webp', url: P('35193995'), credit: 'Pexels' },
  { dest: 'products/veste-savalou-1.webp', url: U('1530884698386-d42ad3199b1f'), credit: 'Prince Akachi / Unsplash' },
  { dest: 'products/veste-savalou-2.webp', url: U('1764593008195-87ca871d72bd'), credit: 'Dion Martins / Unsplash' },
  { dest: 'products/chemise-lokossa-1.webp', url: P('32562829'), credit: 'Pexels' },
  { dest: 'products/chemise-lokossa-2.webp', url: P('31485660'), credit: 'Pexels' },

  // ---- Produits — ACCESSOIRES
  { dest: 'products/collier-perles-1.webp', url: P('30589142'), credit: 'Pexels' },
  { dest: 'products/collier-perles-2.webp', url: P('14484954'), credit: 'Pexels' },
  { dest: 'products/boucles-spirale-1.webp', url: P('35837476'), credit: 'Pexels' },
  { dest: 'products/boucles-spirale-2.webp', url: P('5499688'), credit: 'Pexels' },
  { dest: 'products/bracelets-perles-1.webp', url: U('1757140448469-b89958de834d'), credit: 'Divaris Shirichena / Unsplash' },
  { dest: 'products/bracelets-perles-2.webp', url: U('1757140448528-332c4fa2a8a6'), credit: 'Divaris Shirichena / Unsplash' },
  { dest: 'products/foulard-bohicon-1.webp', url: U('1614291129226-41dae34c2128'), credit: 'fame of God studios / Unsplash' },
  { dest: 'products/foulard-bohicon-2.webp', url: P('38528495'), credit: 'Pexels' },
  { dest: 'products/sac-pagne-1.webp', url: P('29625970'), credit: 'Pexels' },
  { dest: 'products/sac-pagne-2.webp', url: U('1758633854855-3059c5b48674'), credit: 'Nhi Ly / Unsplash' },
];

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function fetchOne(entry) {
  const target = join(out, entry.dest);
  if (!force && (await exists(target))) return 'skip';
  const res = await fetch(entry.url, { headers: { 'user-agent': 'Mozilla/5.0 (demo-site-builder)' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const folder = entry.dest.split('/')[0];
  const [w, h] = entry.size ?? SIZES[folder] ?? [1600, 1200];
  await mkdir(dirname(target), { recursive: true });
  const webp = await sharp(buf)
    .rotate()
    .resize(w, h, { fit: 'cover', position: entry.position ?? 'attention' })
    .webp({ quality: 78, effort: 5 })
    .toBuffer();
  await writeFile(target, webp);
  return `${(webp.length / 1024).toFixed(0)} Ko`;
}

let failed = 0;
for (const entry of MANIFEST) {
  try {
    const r = await fetchOne(entry);
    console.log(`${r === 'skip' ? '·' : '✓'} ${entry.dest} ${r === 'skip' ? '(déjà présent)' : r}`);
  } catch (e) {
    failed++;
    console.error(`✗ ${entry.dest} — ${e.message}`);
  }
}
console.log(failed ? `\n${failed} image(s) en échec : le site utilisera placeholder.svg pour celles-ci.` : '\nToutes les images sont prêtes.');
process.exit(failed ? 1 : 0);
