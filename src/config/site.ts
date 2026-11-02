/**
 * Configuration du site — LE SEUL fichier à modifier pour les informations de la boutique.
 *
 * Ne rien inventer : un champ vide s'affiche comme « à confirmer » sur le site.
 * Dès que La Chemise Africaine transmet une information, la renseigner ici.
 */
export const site = {
  name: 'La Chemise Africaine',
  shortName: 'LCA',
  /** Sous-titre du logo. */
  tagline: 'Prêt-à-Porter',
  /** Ligne de positionnement (en-tête, pied de page). */
  claim: 'Prêt-à-porter de créateurs africains, à Cotonou',
  /** Phrase d'accroche de la page d'accueil. */
  positioning: 'La chemise, et tout ce qui va avec.',
  description:
    'La Chemise Africaine est une boutique de prêt-à-porter à Cotonou : chemises, robes, ensembles et accessoires signés par des créateurs africains, à commander simplement sur WhatsApp.',

  /**
   * true tant que le catalogue est provisoire (pièces, prix et photos de démonstration) :
   * bandeau « Aperçu », note en pied de page et noindex. Passer à false au lancement.
   */
  demo: true,

  /**
   * Numéro WhatsApp officiel, chiffres uniquement avec l'indicatif, sans « + » ni espaces.
   * Exemple Bénin : '22901970000000'. Laisser vide tant qu'il n'est pas confirmé :
   * les boutons « Commander » affichent alors un aperçu du message.
   */
  whatsapp: '',

  /** Coordonnées : laisser vide si non confirmé (affiché « à confirmer »). */
  email: '',
  address: '',
  city: 'Cotonou, Bénin',
  hours: '',

  /** Conditions de service : laisser vide tant que la boutique ne les a pas confirmées. */
  delivery: {
    /** Ex. « Livraison à Cotonou sous 24 h, 1 000 FCFA ; reste du Bénin sous 72 h. » */
    text: '',
    /** Ex. « Échange possible sous 7 jours, pièce non portée, sur présentation du message de commande. » */
    returns: '',
    /** Ex. « Espèces à la livraison, MTN MoMo, Moov Money. » */
    payment: '',
    /** Ex. « Retouches simples offertes (ourlet, cintrage) sous 48 h. » */
    alterations: '',
  },

  social: {
    instagram: '',
    facebook: '',
    tiktok: '',
  },

  /** Mentions légales : à compléter avec les informations officielles de la boutique. */
  legal: {
    companyName: '',
    registration: '', // RCCM
    taxId: '', // IFU
    manager: '',
    host: '',
  },

  /** Origine publique (canonical / Open Graph) : vient de `site` dans astro.config.mjs (variable SITE_URL). */
  url: import.meta.env.SITE ?? 'https://la-chemise-africaine.demo',
};

export type SiteConfig = typeof site;
