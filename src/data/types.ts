export type CategoryId = 'femme' | 'homme' | 'accessoires';
export type ProductStatus = 'nouveaute' | 'sur-commande' | 'piece-unique';

export interface ImageRef {
  /** Chemin public, ex. /images/products/chemise-cotonou-1.webp */
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Crédit photo (visuel d'illustration). */
  credit?: string;
}

export interface Category {
  id: CategoryId;
  label: string;
  intro: string;
}

export interface Designer {
  slug: string;
  name: string;
  country: string;
  city?: string;
  /** Une ligne, affichée sous le nom dans l'index. */
  tagline: string;
  /** Paragraphes séparés par une ligne vide. */
  bio: string;
  portrait: ImageRef;
  specialties: string[];
  instagram?: string;
}

export interface Collection {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  cover: ImageRef;
  season?: string;
  featured: boolean;
  order: number;
}

export interface Product {
  slug: string;
  name: string;
  designerSlug: string;
  category: CategoryId;
  collectionSlug?: string;
  description: string;
  /** Prix en FCFA. Absent = « Prix sur demande ». */
  price?: number;
  /** Ancien prix barré (offre spéciale). Doit être supérieur à `price`. */
  oldPrice?: number;
  /** [0] = image principale. */
  images: ImageRef[];
  sizes?: string[];
  colors?: string[];
  materials?: string;
  status?: ProductStatus[];
  featured: boolean;
  order: number;
}

export interface Catalogue {
  categories: Category[];
  designers: Designer[];
  collections: Collection[];
  products: Product[];
}
