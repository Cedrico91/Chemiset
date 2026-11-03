/**
 * ============================================================================
 *  CATALOGUE DE LA BOUTIQUE
 * ============================================================================
 *  Deux types de contenus cohabitent tant que le site est en mise en place :
 *   - MODÈLES DE LA BOUTIQUE : les pièces dont le client a transmis les photos
 *     (créateur `la-chemise-africaine`). Prix et tailles restent « à confirmer »
 *     tant que la boutique ne les a pas communiqués : ne rien inventer.
 *   - DONNÉES DE DÉMONSTRATION : créateurs, pièces, descriptions et prix FICTIFS,
 *     photos d'illustration (Unsplash / Pexels). À supprimer au fur et à mesure
 *     que le vrai catalogue arrive.
 *
 *  Comment éditer :
 *   - Ajouter un créateur : copier un bloc dans `designers`, choisir un slug unique.
 *   - Ajouter une pièce   : copier un bloc dans `products`, renseigner `designerSlug`
 *                           (doit exister), `category` (femme | homme | accessoires),
 *                           et déposer les images dans public/images/products/.
 *   - Prix : `price` en FCFA (valeurs de DÉMONSTRATION, à remplacer par les vrais tarifs) ;
 *           retirer `price` → « Prix sur demande ». `oldPrice` = prix barré d'une offre spéciale.
 *  Le build échoue si un slug est en double ou si une référence est orpheline.
 * ============================================================================
 */
import type { Catalogue, ImageRef } from './types';
import { withBase } from '../lib/url';

const img = (src: string, alt: string, width: number, height: number, credit?: string): ImageRef => ({
  src: withBase(src),
  alt,
  width,
  height,
  credit,
});

const product = (name: string, alt: string, credit?: string) =>
  img(`/images/products/${name}.webp`, alt, 1200, 1600, credit);
const portrait = (name: string, alt: string, credit?: string) =>
  img(`/images/designers/${name}.webp`, alt, 800, 1000, credit);
const cover = (name: string, alt: string, credit?: string) =>
  img(`/images/collections/${name}.webp`, alt, 1600, 1000, credit);

export const catalogue: Catalogue = {
  categories: [
    {
      id: 'femme',
      label: 'Femme',
      intro: 'Robes, ensembles, chemises et tuniques signés par nos créatrices et créateurs.',
    },
    {
      id: 'homme',
      label: 'Homme',
      intro: 'La chemise avant tout, puis tuniques, boubous et ensembles taillés pour durer.',
    },
    {
      id: 'accessoires',
      label: 'Accessoires',
      intro: 'Bijoux de perles, foulards et sacs en pagne pour finir une silhouette.',
    },
  ],

  designers: [
    // -------------------------------------------------------------------------
    // LA BOUTIQUE ELLE-MÊME : les modèles de la maison (photos transmises par le client)
    // -------------------------------------------------------------------------
    {
      slug: 'la-chemise-africaine',
      name: 'La Chemise Africaine',
      country: 'Bénin',
      city: 'Cotonou',
      tagline: 'Les modèles de la maison.',
      bio: `Les chemises et tuniques dessinées pour la boutique : cols mao et cols ronds, boutonnières courtes, empiècements de tissus teints ou tissés sur des cotons unis.

Les informations de taille, de matière et de prix de chaque modèle sont communiquées par la boutique sur WhatsApp.`,
      portrait: img('/brand/emblem-square.png', 'Emblème de La Chemise Africaine', 512, 512),
      specialties: ['Chemises', 'Tuniques', 'Col mao'],
    },

    // -------------------------------------------------------------------------
    // CRÉATEURS DE DÉMONSTRATION — noms FICTIFS
    // -------------------------------------------------------------------------
    {
      slug: 'ayaba-hounkpe',
      name: 'Ayaba Hounkpè', // FICTIF
      country: 'Bénin',
      city: 'Cotonou',
      tagline: 'Le wax tenu comme une étoffe de couture.',
      bio: `Formée à Cotonou puis à Dakar, Ayaba travaille le wax et le bogolan avec les codes de la couture : coupes nettes, finitions à la main, motifs placés un à un.

Chaque pièce est produite en petite série dans son atelier de Fidjrossè. Elle dessine pour des femmes qui veulent être élégantes sans effort, le matin au bureau comme le soir en ville.`,
      portrait: portrait('ayaba-hounkpe', 'Portrait de créatrice, visuel d’illustration', 'Prince Akachi / Unsplash'),
      specialties: ['Robes', 'Ensembles', 'Wax placé'],
    },
    {
      slug: 'kofi-mensah',
      name: 'Kofi Mensah', // FICTIF
      country: 'Ghana',
      city: 'Accra',
      tagline: 'La chemise, réinventée dans le kente et le coton.',
      bio: `Kofi a grandi entre l’atelier de tissage de son grand-père à Bonwire et les tailleurs d’Accra. Il en garde une obsession : la chemise parfaite, celle qu’on porte dix ans.

Ses chemises mêlent cotons unis et empiècements de kente tissé main. Les cols, les poignets et les boutons en corne sont choisis pour vieillir avec la pièce.`,
      portrait: portrait('kofi-mensah', 'Portrait de créateur, visuel d’illustration', 'Pexels'),
      specialties: ['Chemises', 'Vestes', 'Kente'],
    },
    {
      slug: 'adaeze-okafor',
      name: 'Adaeze Okafor', // FICTIF
      country: 'Nigeria',
      city: 'Lagos',
      tagline: 'Des pièces de cérémonie, légères et lumineuses.',
      bio: `Adaeze crée pour les grands jours : mariages, baptêmes, fêtes de famille. Ses robes et ses ensembles jouent sur les volumes, les drapés et des tissus qui prennent la lumière.

Son atelier de Lagos travaille l’aso-oke, la soie et l’organza. Chaque pièce de cérémonie est réalisée sur mesure, sur commande.`,
      portrait: portrait('adaeze-okafor', 'Portrait de créatrice, visuel d’illustration', 'Pexels'),
      specialties: ['Cérémonie', 'Robes longues', 'Sur mesure'],
    },
    {
      slug: 'sekou-diallo',
      name: 'Sékou Diallo', // FICTIF
      country: 'Sénégal',
      city: 'Dakar',
      tagline: 'Le boubou et la tunique, dans une ligne contemporaine.',
      bio: `Sékou revisite le vestiaire masculin ouest-africain : boubous épurés, tuniques à col officier, pantalons droits. Les broderies, discrètes, sont réalisées par des artisans de la Médina de Dakar.

Il aime les tissus lourds et mats, le bazin riche, le coton épais, et les palettes sobres relevées d’un seul motif.`,
      portrait: portrait('sekou-diallo', 'Portrait de créateur, visuel d’illustration', 'DCL 650 / Unsplash'),
      specialties: ['Boubous', 'Tuniques', 'Broderie'],
    },
    {
      slug: 'nadege-kouassi',
      name: 'Nadège Kouassi', // FICTIF
      country: 'Côte d’Ivoire',
      city: 'Abidjan',
      tagline: 'Bijoux de perles et foulards, faits main à Abidjan.',
      bio: `Nadège compose des colliers, des bracelets et des boucles à partir de perles de verre, de laiton et de bois. Chaque pièce est montée à la main dans son atelier de Cocody.

Ses foulards en pagne ourlés à la main complètent les silhouettes des autres créateurs de la boutique.`,
      portrait: portrait('nadege-kouassi', 'Portrait de créatrice, visuel d’illustration', 'Pexels'),
      specialties: ['Bijoux', 'Foulards', 'Perles'],
    },
    {
      slug: 'elom-agbeko',
      name: 'Elom Agbeko', // FICTIF
      country: 'Togo',
      city: 'Lomé',
      tagline: 'Tailleur de formation, créateur de vestes et de sacs.',
      bio: `Tailleur depuis quinze ans à Lomé, Elom coupe des vestes et des sahariennes dans le pagne tissé et le lin. Ses sacs en pagne doublés de cuir sont devenus la signature de son atelier.

Il privilégie les coupes structurées et les détails utiles : poches plaquées, doublures contrastées, boutons recouverts.`,
      portrait: portrait('elom-agbeko', 'Portrait de créateur, visuel d’illustration', 'Bismark Owusu-Yeboah / Unsplash'),
      specialties: ['Vestes', 'Sacs', 'Tailleur'],
    },
  ],

  // ---------------------------------------------------------------------------
  // COLLECTIONS
  // ---------------------------------------------------------------------------
  collections: [
    {
      slug: 'la-chemise',
      title: 'La Chemise',
      subtitle: 'La pièce qui donne son nom à la boutique',
      description:
        'Chemises pour elle et pour lui, en wax, kente et coton. Coupes droites ou cintrées, cols souples ou officier : la sélection permanente de la boutique.',
      cover: cover('la-chemise', 'Duo en tenues de créateurs, visuel d’illustration', 'Delight Dzansi / Unsplash'),
      featured: true,
      order: 1,
    },
    {
      slug: 'ceremonies',
      title: 'Cérémonies',
      subtitle: 'Mariages, baptêmes, grands jours',
      description:
        'Ensembles assortis, robes longues et boubous brodés, réalisés sur commande pour les fêtes de famille.',
      cover: cover('ceremonies', 'Tenues de cérémonie, visuel d’illustration', 'Pexels'),
      season: 'Toute l’année',
      featured: true,
      order: 2,
    },
    {
      slug: 'lumiere-de-cotonou',
      title: 'Lumière de Cotonou',
      subtitle: 'Les pièces légères de la saison',
      description:
        'Robes fluides, tuniques et chemises à manches courtes dans des cotons respirants, pensées pour la chaleur de la côte.',
      cover: cover('lumiere-de-cotonou', 'Silhouettes légères en pagne, visuel d’illustration', 'Pexels'),
      season: 'Saison sèche',
      featured: true,
      order: 3,
    },
    {
      slug: 'atelier-tissus',
      title: 'Atelier & Tissus',
      subtitle: 'Accessoires et petites pièces d’atelier',
      description:
        'Foulards, sacs en pagne et bijoux de perles : les pièces qui finissent une tenue, montées à la main.',
      cover: cover('atelier-tissus', 'Tissus wax colorés, visuel d’illustration', 'WyteShot / Unsplash'),
      featured: false,
      order: 4,
    },
  ],

  // ---------------------------------------------------------------------------
  // PIÈCES — noms et descriptions FICTIFS, prix volontairement absents
  // ---------------------------------------------------------------------------
  products: [
    // =========================================================================
    // MODÈLES DE LA BOUTIQUE — photos transmises par le client le 2 novembre 2026.
    // Prix absent → « Prix sur demande » ; tailles absentes → « taille à préciser »
    // dans le panier. Compléter `price`, `sizes`, `materials` dès confirmation.
    // =========================================================================
    {
      slug: 'chemise-col-mao-plastron-indigo',
      priceRange: [5000, 10000], // fourchette communiquée par la boutique ; prix exact à saisir dans `price`
      name: 'Chemise col mao, plastron indigo',
      designerSlug: 'la-chemise-africaine',
      category: 'homme',
      collectionSlug: 'la-chemise',
      description:
        'Chemise bleu ciel à manches longues et col mao. Plastron et empiècements d’épaules en tissu indigo à motifs géométriques, patte de boutonnage à deux boutons, poignets boutonnés.',
      images: [product('chemise-bleue-plastron-indigo-1', 'Chemise bleu ciel à col mao et plastron indigo à motifs géométriques')],
      colors: ['Bleu ciel / indigo'],
      featured: true,
      order: -4,
    },
    {
      slug: 'chemise-batik-ocre',
      priceRange: [5000, 10000], // fourchette communiquée par la boutique ; prix exact à saisir dans `price`
      name: 'Chemise batik ocre',
      designerSlug: 'la-chemise-africaine',
      category: 'homme',
      collectionSlug: 'la-chemise',
      description:
        'Chemise à manches courtes en coton batik, teinte ocre et brun à motifs circulaires. Col rond, patte à deux boutons, poche poitrine, fentes latérales.',
      images: [product('chemise-batik-ocre-1', 'Chemise à manches courtes en batik ocre et brun à motifs circulaires')],
      colors: ['Ocre / brun'],
      featured: true,
      order: -3,
    },
    {
      slug: 'tunique-verte-rayures',
      priceRange: [5000, 10000], // fourchette communiquée par la boutique ; prix exact à saisir dans `price`
      name: 'Tunique verte à rayures',
      designerSlug: 'la-chemise-africaine',
      category: 'homme',
      collectionSlug: 'la-chemise',
      description:
        'Tunique verte à manches courtes et col rond, deux boutons en bois. Bandes rayées jaune et blanc sur les manches et en diagonale sur le devant, fentes latérales.',
      images: [product('tunique-verte-rayures-1', 'Tunique verte à manches courtes avec bandes rayées jaune et blanc')],
      colors: ['Vert / jaune'],
      featured: true,
      order: -2,
    },
    {
      slug: 'chemise-bordeaux-bandes-ikat',
      priceRange: [5000, 10000], // fourchette communiquée par la boutique ; prix exact à saisir dans `price`
      name: 'Chemise bordeaux à bandes ikat',
      designerSlug: 'la-chemise-africaine',
      category: 'homme',
      collectionSlug: 'la-chemise',
      description:
        'Chemise bordeaux à manches courtes et col rond, deux boutons. Bandes de tissu ikat bleu et noir sur le devant, les épaules, les manches et le bas du vêtement, poche poitrine passepoilée.',
      images: [product('chemise-bordeaux-ikat-1', 'Chemise bordeaux à manches courtes avec bandes ikat bleu et noir')],
      colors: ['Bordeaux / bleu'],
      featured: true,
      order: -1,
    },

    // =========================================================================
    // DONNÉES DE DÉMONSTRATION — pièces FICTIVES, visuels d'illustration
    // =========================================================================
    // ---- HOMME
    {
      slug: 'chemise-cotonou',
      price: 8500, // PRIX DE DÉMONSTRATION
      name: 'Chemise Cotonou',
      designerSlug: 'kofi-mensah',
      category: 'homme',
      collectionSlug: 'la-chemise',
      description:
        'La chemise signature de la boutique. Coupe droite, col souple, empiècement de kente sur la patte de boutonnage. Coton peigné, boutons en corne.',
      images: [
        product('chemise-cotonou-1', 'Chemise en pagne portée, visuel d’illustration', 'Pexels'),
        product('chemise-cotonou-2', 'Chemise à motifs africains, visuel d’illustration', 'Pexels'),
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      materials: 'Coton peigné, kente tissé main',
      status: ['nouveaute'],
      featured: true,
      order: 1,
    },
    {
      slug: 'chemise-dahomey',
      price: 7000, // PRIX DE DÉMONSTRATION
      oldPrice: 8500, // prix barré fictif (offre spéciale)
      name: 'Chemise Dahomey',
      designerSlug: 'kofi-mensah',
      category: 'homme',
      collectionSlug: 'la-chemise',
      description:
        'Chemise à manches courtes en wax, coupe décontractée, col cubain. Le motif est placé pour se raccorder sur le devant.',
      images: [
        product('chemise-dahomey-1', 'Chemise wax à manches courtes, visuel d’illustration', 'Tânia Mousinho / Unsplash'),
        product('chemise-dahomey-2', 'Chemise à motifs portée en ville, visuel d’illustration', 'De’Andre Bush / Unsplash'),
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      materials: 'Wax 100 % coton',
      featured: true,
      order: 2,
    },
    {
      slug: 'tunique-natitingou',
      price: 9500, // PRIX DE DÉMONSTRATION
      name: 'Tunique Natitingou',
      designerSlug: 'sekou-diallo',
      category: 'homme',
      collectionSlug: 'lumiere-de-cotonou',
      description:
        'Tunique à col officier, fentes latérales et poche poitrine. Coton épais uni, broderie ton sur ton au col.',
      images: [
        product('tunique-natitingou-1', 'Tunique verte portée en studio, visuel d’illustration', 'Pexels'),
        product('tunique-natitingou-2', 'Tunique traditionnelle portée en extérieur, visuel d’illustration', 'Pexels'),
      ],
      sizes: ['M', 'L', 'XL'],
      colors: ['Vert bouteille', 'Sable', 'Indigo'],
      materials: 'Coton épais, broderie main',
      featured: true,
      order: 3,
    },
    {
      slug: 'ensemble-kandi',
      price: 15000, // PRIX DE DÉMONSTRATION
      name: 'Ensemble Kandi',
      designerSlug: 'sekou-diallo',
      category: 'homme',
      collectionSlug: 'ceremonies',
      description:
        'Ensemble deux pièces : tunique longue et pantalon droit assorti. Bazin riche, broderies discrètes aux poignets.',
      images: [
        product('ensemble-kandi-1', 'Ensemble deux pièces, visuel d’illustration', 'Pexels'),
        product('ensemble-kandi-2', 'Tenue traditionnelle élégante, visuel d’illustration', 'Pexels'),
      ],
      materials: 'Bazin riche',
      status: ['sur-commande'],
      featured: false,
      order: 4,
    },
    {
      slug: 'boubou-parakou',
      price: 18000, // PRIX DE DÉMONSTRATION
      name: 'Boubou Parakou',
      designerSlug: 'sekou-diallo',
      category: 'homme',
      collectionSlug: 'ceremonies',
      description:
        'Grand boubou de cérémonie à broderies, avec tunique et pantalon. Réalisé sur mesure à partir de vos mensurations.',
      images: [
        product('boubou-parakou-1', 'Grand boubou brodé, visuel d’illustration', 'Pexels'),
        product('boubou-parakou-2', 'Portrait en tenue de cérémonie, visuel d’illustration', 'Pexels'),
      ],
      materials: 'Bazin riche, broderie main',
      status: ['sur-commande'],
      featured: false,
      order: 5,
    },
    {
      slug: 'veste-savalou',
      price: 16000, // PRIX DE DÉMONSTRATION
      name: 'Veste Savalou',
      designerSlug: 'elom-agbeko',
      category: 'homme',
      collectionSlug: 'la-chemise',
      description:
        'Veste légère non doublée en pagne tissé, deux boutons, poches plaquées. Se porte sur une chemise unie ou un t-shirt.',
      images: [
        product('veste-savalou-1', 'Veste à motifs portée, visuel d’illustration', 'Prince Akachi / Unsplash'),
        product('veste-savalou-2', 'Silhouette masculine stylée, visuel d’illustration', 'Dion Martins / Unsplash'),
      ],
      sizes: ['48', '50', '52', '54'],
      materials: 'Pagne tissé, doublure coton',
      status: ['piece-unique'],
      featured: true,
      order: 6,
    },
    {
      slug: 'chemise-lokossa',
      price: 7500, // PRIX DE DÉMONSTRATION
      name: 'Chemise Lokossa',
      designerSlug: 'kofi-mensah',
      category: 'homme',
      collectionSlug: 'lumiere-de-cotonou',
      description:
        'Chemise à manches longues en coton léger, col mao, poignets simples. La version la plus sobre de la gamme.',
      images: [
        product('chemise-lokossa-1', 'Chemise à col mao portée avec un bonnet, visuel d’illustration', 'Pexels'),
        product('chemise-lokossa-2', 'Portrait en tenue traditionnelle, visuel d’illustration', 'Pexels'),
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      materials: 'Coton léger',
      featured: false,
      order: 7,
    },

    // ---- FEMME
    {
      slug: 'robe-ganvie',
      price: 12000, // PRIX DE DÉMONSTRATION
      name: 'Robe Ganvié',
      designerSlug: 'ayaba-hounkpe',
      category: 'femme',
      collectionSlug: 'lumiere-de-cotonou',
      description:
        'Robe mi-longue en wax, encolure bateau, taille marquée par une ceinture nouée. Le motif est centré sur le devant.',
      images: [
        product('robe-ganvie-1', 'Robe en wax portée dans la verdure, visuel d’illustration', 'Pexels'),
        product('robe-ganvie-2', 'Robe africaine colorée, visuel d’illustration', 'Pexels'),
      ],
      sizes: ['36', '38', '40', '42', '44'],
      materials: 'Wax 100 % coton',
      status: ['nouveaute'],
      featured: true,
      order: 1,
    },
    {
      slug: 'ensemble-ouidah',
      price: 14000, // PRIX DE DÉMONSTRATION
      name: 'Ensemble Ouidah',
      designerSlug: 'ayaba-hounkpe',
      category: 'femme',
      collectionSlug: 'ceremonies',
      description:
        'Ensemble haut et jupe longue dans un wax rouge profond. Haut à manches ballon, jupe portefeuille.',
      images: [
        product('ensemble-ouidah-1', 'Ensemble rouge en wax, visuel d’illustration', 'Pexels'),
        product('ensemble-ouidah-2', 'Portrait en robe à motifs, visuel d’illustration', 'Pexels'),
      ],
      sizes: ['36', '38', '40', '42'],
      materials: 'Wax 100 % coton',
      featured: true,
      order: 2,
    },
    {
      slug: 'chemise-porto-novo',
      price: 7000, // PRIX DE DÉMONSTRATION
      name: 'Chemise Porto-Novo',
      designerSlug: 'ayaba-hounkpe',
      category: 'femme',
      collectionSlug: 'la-chemise',
      description:
        'Chemise féminine oversize en wax, manches à retrousser, pans arrondis. À porter ouverte sur une robe ou nouée à la taille.',
      images: [
        product('chemise-porto-novo-1', 'Chemise colorée portée assise, visuel d’illustration', 'Lola Azizada / Unsplash'),
        product('chemise-porto-novo-2', 'Pièce à motifs vifs portée sur une chaise, visuel d’illustration', 'McFollis / Unsplash'),
      ],
      sizes: ['S', 'M', 'L'],
      materials: 'Wax 100 % coton',
      featured: true,
      order: 3,
    },
    {
      slug: 'robe-abomey',
      price: 18000, // PRIX DE DÉMONSTRATION
      name: 'Robe Abomey',
      designerSlug: 'adaeze-okafor',
      category: 'femme',
      collectionSlug: 'ceremonies',
      description:
        'Robe longue de cérémonie, jupe ample et corsage ajusté. Tissu choisi avec vous ; réalisée sur mesure.',
      images: [
        product('robe-abomey-1', 'Robe longue jaune portée, visuel d’illustration', 'Delight Dzansi / Unsplash'),
        product('robe-abomey-2', 'Robe de cérémonie colorée, visuel d’illustration', 'Delight Dzansi / Unsplash'),
      ],
      materials: 'Aso-oke ou organza, selon le tissu choisi',
      status: ['sur-commande'],
      featured: true,
      order: 4,
    },
    {
      slug: 'tunique-seme',
      price: 8000, // PRIX DE DÉMONSTRATION
      oldPrice: 10000, // prix barré fictif (offre spéciale)
      name: 'Tunique Sèmè',
      designerSlug: 'ayaba-hounkpe',
      category: 'femme',
      collectionSlug: 'lumiere-de-cotonou',
      description:
        'Tunique légère à col V et manches trois-quarts, fendue sur les côtés. Se porte sur un pantalon uni.',
      images: [
        product('tunique-seme-1', 'Tunique en pagne portée, visuel d’illustration', 'Pexels'),
        product('tunique-seme-2', 'Portrait souriant en tenue colorée, visuel d’illustration', 'Pexels'),
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      materials: 'Coton léger',
      featured: false,
      order: 5,
    },
    {
      slug: 'jupe-possotome',
      price: 9000, // PRIX DE DÉMONSTRATION
      name: 'Jupe Possotomè',
      designerSlug: 'ayaba-hounkpe',
      category: 'femme',
      collectionSlug: 'la-chemise',
      description:
        'Jupe midi évasée à taille haute, poches dans les coutures. Pensée pour aller avec les chemises de la boutique.',
      images: [
        product('jupe-possotome-1', 'Tenue en pagne avec foulard bleu, visuel d’illustration', 'Pexels'),
        product('jupe-possotome-2', 'Portrait en tenue traditionnelle, visuel d’illustration', 'Pexels'),
      ],
      sizes: ['36', '38', '40', '42', '44'],
      materials: 'Wax 100 % coton',
      featured: false,
      order: 6,
    },
    {
      slug: 'robe-grand-popo',
      price: 11000, // PRIX DE DÉMONSTRATION
      oldPrice: 13500, // prix barré fictif (offre spéciale)
      name: 'Robe Grand-Popo',
      designerSlug: 'adaeze-okafor',
      category: 'femme',
      collectionSlug: 'lumiere-de-cotonou',
      description:
        'Robe chemise à motifs floraux, boutonnée devant, ceinture amovible. Coupe fluide, longueur sous le genou.',
      images: [
        product('robe-grand-popo-1', 'Robe fleurie rouge et blanche, visuel d’illustration', 'Rohan Odhiambo / Unsplash'),
        product('robe-grand-popo-2', 'Robe à fleurs portée en extérieur, visuel d’illustration', 'Jan Canty / Unsplash'),
      ],
      sizes: ['36', '38', '40', '42'],
      materials: 'Coton imprimé',
      status: ['nouveaute'],
      featured: false,
      order: 7,
    },
    {
      slug: 'ensemble-dassa',
      price: 13500, // PRIX DE DÉMONSTRATION
      name: 'Ensemble Dassa',
      designerSlug: 'adaeze-okafor',
      category: 'femme',
      collectionSlug: 'ceremonies',
      description:
        'Ensemble haut et pantalon large en wax assorti, foulard de tête coordonné inclus.',
      images: [
        product('ensemble-dassa-1', 'Ensemble coloré avec foulard, visuel d’illustration', 'Pexels'),
        product('ensemble-dassa-2', 'Portrait en tenue de fête, visuel d’illustration', 'Pexels'),
      ],
      sizes: ['38', '40', '42', '44'],
      materials: 'Wax 100 % coton',
      featured: false,
      order: 8,
    },

    // ---- ACCESSOIRES
    {
      slug: 'collier-perles',
      price: 4500, // PRIX DE DÉMONSTRATION
      name: 'Collier Cocody',
      designerSlug: 'nadege-kouassi',
      category: 'accessoires',
      collectionSlug: 'atelier-tissus',
      description:
        'Collier plastron en perles de verre et laiton, monté à la main. Fermoir à crochet.',
      images: [
        product('collier-perles-1', 'Collier de perles porté, visuel d’illustration', 'Pexels'),
        product('collier-perles-2', 'Parure de perles colorées, visuel d’illustration', 'Pexels'),
      ],
      materials: 'Perles de verre, laiton',
      status: ['piece-unique'],
      featured: true,
      order: 1,
    },
    {
      slug: 'boucles-spirale',
      price: 2500, // PRIX DE DÉMONSTRATION
      name: 'Boucles Spirale',
      designerSlug: 'nadege-kouassi',
      category: 'accessoires',
      collectionSlug: 'atelier-tissus',
      description: 'Grandes boucles d’oreilles en laiton martelé, forme spirale, légères à porter.',
      images: [
        product('boucles-spirale-1', 'Boucles d’oreilles spirale portées, visuel d’illustration', 'Pexels'),
        product('boucles-spirale-2', 'Accessoires colorés en studio, visuel d’illustration', 'Pexels'),
      ],
      materials: 'Laiton martelé',
      featured: false,
      order: 2,
    },
    {
      slug: 'bracelets-perles',
      price: 3000, // PRIX DE DÉMONSTRATION
      oldPrice: 4000, // prix barré fictif (offre spéciale)
      name: 'Bracelets Lagune',
      designerSlug: 'nadege-kouassi',
      category: 'accessoires',
      collectionSlug: 'atelier-tissus',
      description: 'Lot de cinq bracelets en perles de verre, couleurs assorties, élastiques.',
      images: [
        product('bracelets-perles-1', 'Bracelets en perles colorées, visuel d’illustration', 'Divaris Shirichena / Unsplash'),
        product('bracelets-perles-2', 'Bandeau et bijoux en perles, visuel d’illustration', 'Divaris Shirichena / Unsplash'),
      ],
      materials: 'Perles de verre',
      featured: false,
      order: 3,
    },
    {
      slug: 'foulard-bohicon',
      price: 2500, // PRIX DE DÉMONSTRATION
      name: 'Foulard Bohicon',
      designerSlug: 'nadege-kouassi',
      category: 'accessoires',
      collectionSlug: 'atelier-tissus',
      description: 'Grand carré de pagne ourlé à la main, à porter en turban, en foulard ou noué au sac.',
      images: [
        product('foulard-bohicon-1', 'Foulard à motifs porté, visuel d’illustration', 'fame of God studios / Unsplash'),
        product('foulard-bohicon-2', 'Turban en pagne, visuel d’illustration', 'Pexels'),
      ],
      materials: 'Wax 100 % coton',
      featured: true,
      order: 4,
    },
    {
      slug: 'sac-pagne',
      price: 6500, // PRIX DE DÉMONSTRATION
      name: 'Sac Lomé',
      designerSlug: 'elom-agbeko',
      category: 'accessoires',
      collectionSlug: 'atelier-tissus',
      description: 'Sac cabas en pagne tissé doublé de cuir, anses en cuir naturel, poche intérieure zippée.',
      images: [
        product('sac-pagne-1', 'Sac à motifs porté en bandoulière, visuel d’illustration', 'Pexels'),
        product('sac-pagne-2', 'Tissu à motifs sur mannequin, visuel d’illustration', 'Nhi Ly / Unsplash'),
      ],
      materials: 'Pagne tissé, cuir',
      status: ['piece-unique'],
      featured: true,
      order: 5,
    },
  ],
};

/** Visuels hors catalogue (hero, à propos). */
export const visuals = {
  // Photos de la boutique (façade retravaillée à partir de la photo du client) : pas de crédit, pas de mention « illustration ».
  heroDesktop: img('/images/hero/hero-desktop.webp', 'La façade orange de La Chemise Africaine : enseigne, auvent en paille, vitrine et porte en bois', 1672, 941),
  heroMobile: img('/images/hero/hero-mobile.webp', 'La façade orange de La Chemise Africaine, enseigne et vitrine', 1080, 1382),
  boutiqueSoir: img('/images/misc/boutique-soir.webp', 'La boutique à la tombée du jour, vitrine et porte éclairées', 1122, 842),
  boutiqueFacade: img('/images/misc/boutique-facade.webp', 'La façade de la boutique en journée, vue de la rue', 1122, 842),
  atelier: img('/images/misc/atelier-tissus.webp', 'Tissus wax au marché, visuel d’illustration', 1600, 1200, 'Pexels'),
  batik: img('/images/misc/batik.webp', 'Main traçant un motif au batik, visuel d’illustration', 1600, 1200, 'Pexels'),
  duo: img('/images/misc/duo-createurs.webp', 'Deux silhouettes en pagne et coiffes devant des tissus suspendus, visuel d’illustration', 1200, 1500, 'Pexels'),
};
