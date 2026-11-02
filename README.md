# La Chemise Africaine — site de la boutique

Site de la boutique de prêt-à-porter **La Chemise Africaine** (Cotonou) : catalogue, panier, favoris,
recherche, offres, guide des tailles, FAQ, et commande sur WhatsApp. Pas de backend, pas de paiement en ligne.

> Tant que `demo: true` dans `src/config/site.ts`, le site affiche un bandeau « Aperçu », une note en pied de
> page et un `noindex` : le catalogue est provisoire (pièces, prix et visuels d'illustration Unsplash / Pexels)
> en attendant les vraies pièces, photos et informations de la boutique.

## Direction artistique

- **Identité** tirée du logo transmis par le client (`src/assets/brand/logo-original.jpeg`) : orange `#FB7307`,
  noir, blanc ; lettrage script (police Kaushan Script, auto-hébergée) réservé au nom de la marque et à quelques
  accents ; Inter pour tout le reste.
- **Structure** inspirée de Suitsupply : barre haute de services, tuiles d'entrée par rayon, bloc services
  (conseil, guide des tailles, sur commande, retrait, livraison), pages d'aide complètes.
- **Grille** inspirée de COS : fond blanc, photos 3:4, cartes sobres (créateur, nom, prix), beaucoup d'air.
- Dérivés du logo prêts à l'emploi dans `public/brand/` : `logo-full.webp`, `emblem.webp`, `emblem-square.png`
  (avatar / apple-touch-icon), `favicon-64.png`.

## Lancer le site

```bash
cd C:\Users\HP\la-chemise-africaine-site
npm install            # une seule fois
npm run dev            # http://localhost:4321
```

Version de production (fichiers statiques dans `dist/`) :

```bash
npm run build          # astro check + astro build
npm run preview        # http://localhost:4321
npm run links          # vérifie que tous les liens et images internes existent
```

Pour montrer le site sur un téléphone du même Wi-Fi : `npx astro dev --host`.

## Ce que la boutique doit transmettre (checklist)

| Information | Où la mettre |
|---|---|
| Numéro WhatsApp (chiffres avec indicatif, ex. `22901970000000`) | `site.whatsapp` dans `src/config/site.ts` |
| Adresse, horaires, e-mail, Instagram / Facebook / TikTok | `site.address`, `site.hours`, `site.email`, `site.social` |
| Conditions de livraison, règlement, échanges, retouches | `site.delivery.*` (affichées sur Livraison & retours, FAQ, services) |
| Raison sociale, RCCM, IFU, responsable, hébergeur | `site.legal.*` (page Mentions légales) |
| Pièces : nom, créateur, catégorie, prix, tailles, matières, 2 photos 3:4 | `src/data/catalogue.ts` + `public/images/products/` |
| Créateurs : nom, pays, ville, portrait 4:5, courte bio | `src/data/catalogue.ts` + `public/images/designers/` |
| Photos de campagne (hero 1920×1080 et 1080×1350, rayons, boutique) | `public/images/hero/`, tuiles de l'accueil (`src/pages/index.astro`) |

Tant qu'un champ est vide, le site affiche « à confirmer » plutôt qu'une information inventée.
Au lancement : renseigner tout ce qui précède, passer `demo: false`, et mettre `public/robots.txt` en `Allow`.

## Fonctions boutique (sans backend)

| Fonction | Comment ça marche |
|---|---|
| **Panier** (`/panier/`) | Ajout depuis la fiche (taille + quantité) ou en un clic depuis une carte. Conservé dans le navigateur. Tailles et quantités modifiables, total indicatif. |
| **Commande** | « Commander sur WhatsApp » envoie un message récapitulatif (lignes, tailles, total) vers `wa.me`. |
| **Favoris** (`/favoris/`) | Cœur sur chaque carte et fiche, sans compte. |
| **Recherche** (`/recherche/?q=`) | Loupe dans l'en-tête, champ dans le menu mobile ; filtrage côté client sans accents. |
| **Nouveautés** (`/nouveautes/`) | Pièces avec le statut `nouveaute`, puis les pièces mises en avant. |
| **Offres** (`/offres/`) | Pièces dont `oldPrice` est renseigné : prix barré, étiquette « -X % ». |
| **Guide des tailles, Livraison & retours, FAQ, Mentions légales** | Pages d'aide ; les conditions viennent de `site.delivery` et `site.legal`. |
| **Newsletter** | Formulaire en pied de page ; à brancher sur Brevo / Mailchimp au lancement. |

## Structure

```
src/
  config/site.ts        informations de la boutique (contact, livraison, mentions légales, demo)
  data/catalogue.ts     catégories, collections, créateurs, pièces (provisoires)
  lib/catalogue.ts      accesseurs, chemins (shopPaths), validation d'intégrité au build
  scripts/store.ts      panier, favoris, notifications (localStorage)
  styles/global.css     tokens (couleurs du logo, typo, espacements)
  components/           Brand, Header (barre haute + navigation), Footer, Hero, CategoryTile, Services,
                        ProductCard, ProductGrid, ProductGallery, CatalogueFilter, CollectionCard, DesignerCard,
                        WhatsAppButton, Newsletter, Toast, DemoRibbon, DemoModal, MapPlaceholder, …
  pages/
    index.astro                 accueil : hero, tuiles, nouveautés, services, La Chemise, collections, créateurs, boutique
    nouveautes.astro            /nouveautes/
    catalogue/                  /catalogue/, /catalogue/femme|homme|accessoires/
    collections/                /collections/, /collections/<slug>/ (dont la-chemise = rayon Chemises)
    produits/[slug].astro       fiche produit (taille, quantité, panier, favoris, WhatsApp, services)
    createurs/                  /createurs/, /createurs/<slug>/
    panier, favoris, recherche, offres
    guide-des-tailles, livraison-retours, faq, mentions-legales
    a-propos.astro              la boutique : histoire, comment commander, services, contact
public/brand/           dérivés du logo
scripts/check-links.mjs contrôle des liens internes dans dist/
```

## Déploiement

Le site est statique : il se déploie sur GitHub Pages (workflow `.github/workflows/deploy.yml`, variables
`SITE_URL` et `BASE_PATH`), Netlify, Vercel ou tout hébergeur de fichiers. Au lancement sur le domaine de la
boutique, définir `SITE_URL=https://<domaine>` et ne pas définir `BASE_PATH`.
