#!/usr/bin/env node
/**
 * Vérifie que chaque lien et chaque image internes de dist/ pointent vers un fichier existant.
 * Usage : npm run build && npm run links
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
/** Sous-chemin de déploiement (même valeur que BASE_PATH au build), retiré des références avant contrôle. */
const base = (process.env.BASE_PATH ?? '/').replace(/\/+$/, '');
const stripBase = (ref) => (base && ref.startsWith(base + '/') ? ref.slice(base.length) : ref);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.name.endsWith('.html')) yield full;
  }
}

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

const broken = [];
let pages = 0;
let links = 0;
const checked = new Map();

for await (const file of walk(dist)) {
  pages++;
  const html = await readFile(file, 'utf8');
  const refs = [...html.matchAll(/(?:href|src|srcset)="(\/[^"#?]*)/g)].map((m) => m[1]);
  for (const ref of refs) {
    links++;
    if (checked.has(ref)) { if (!checked.get(ref)) broken.push({ file, ref }); continue; }
    const clean = stripBase(ref.split(' ')[0]);
    const candidates = clean.endsWith('/')
      ? [join(dist, clean, 'index.html')]
      : [join(dist, clean), join(dist, clean, 'index.html')];
    let ok = false;
    for (const c of candidates) if (await exists(c)) { ok = true; break; }
    checked.set(ref, ok);
    if (!ok) broken.push({ file, ref });
  }
}

console.log(`${pages} pages, ${links} références internes, ${checked.size} cibles distinctes.`);
if (broken.length) {
  console.error(`\n${broken.length} lien(s) cassé(s) :`);
  for (const b of broken) console.error(` - ${b.ref}  (dans ${b.file.replace(dist, 'dist')})`);
  process.exit(1);
}
console.log('Aucun lien cassé.');
