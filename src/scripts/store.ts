/**
 * Panier, favoris et notifications côté navigateur.
 *
 * Tout est conservé dans le localStorage du visiteur : aucun backend, aucun compte,
 * aucun paiement. La commande est finalisée sur WhatsApp depuis la page Panier,
 * avec un message récapitulatif déjà rédigé.
 */
import { withBase } from '../lib/url';

export interface ProductData {
  slug: string;
  name: string;
  designer: string;
  price: number | null;
  /** Fourchette affichée quand le prix exact n'est pas fixé (confirmé sur WhatsApp). */
  priceRange: [number, number] | null;
  oldPrice: number | null;
  image: string;
  url: string;
  sizes: string[];
}

export interface CartLine extends ProductData {
  size: string | null;
  qty: number;
}

const CART_KEY = 'lca:cart';
const WISH_KEY = 'lca:wishlist';
const MAX_QTY = 99;

/** Émis après chaque modification du panier ou des favoris. */
export const STORE_EVENT = 'lca:store';
/** Émis pour afficher une notification (composant Toast). */
export const TOAST_EVENT = 'lca:toast';

export const paths = {
  cart: withBase('/panier/'),
  wishlist: withBase('/favoris/'),
  search: withBase('/recherche/'),
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Stockage indisponible (navigation privée) : l'état reste en mémoire le temps de la page. */
  }
  window.dispatchEvent(new CustomEvent(STORE_EVENT));
}

/** 12000 -> "12 000 FCFA" ; null -> "Prix sur demande" (même règle que src/lib/format.ts). */
export function formatPrice(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return 'Prix sur demande';
  // Espaces insécables (U+00A0) : un prix ne se coupe jamais en fin de ligne, comme côté build.
  return `${new Intl.NumberFormat('fr-FR').format(n).replace(/[   ]/g, ' ')} FCFA`;
}

/** [5000, 10000] -> "5 000 à 10 000 FCFA". */
export function formatPriceRange(range: [number, number]): string {
  return `${formatPrice(range[0]).replace(/\s*FCFA$/u, '')} à ${formatPrice(range[1])}`;
}

/** Prix exact, sinon fourchette, sinon « Prix sur demande ». */
export function priceLabel(p: { price: number | null; priceRange: [number, number] | null }): string {
  if (p.price !== null) return formatPrice(p.price);
  if (p.priceRange) return formatPriceRange(p.priceRange);
  return formatPrice(null);
}

export function toast(message: string, link?: { href: string; label: string }): void {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { message, link } }));
}

/** Lit le JSON `data-product` porté par l'élément ou par son ancêtre le plus proche. */
export function readProduct(el: Element | null): ProductData | null {
  const host = el?.closest<HTMLElement>('[data-product]');
  if (!host?.dataset.product) return null;
  try {
    return JSON.parse(host.dataset.product) as ProductData;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Panier
// ---------------------------------------------------------------------------
export const lineKey = (l: { slug: string; size: string | null }): string => `${l.slug}::${l.size ?? ''}`;

export const getCart = (): CartLine[] => read<CartLine[]>(CART_KEY, []);

export const cartCount = (): number => getCart().reduce((n, l) => n + l.qty, 0);

/** Total des lignes dont le prix est connu ; `complete` est faux si une pièce est « sur demande ». */
export function cartTotal(): { total: number; complete: boolean } {
  let total = 0;
  let complete = true;
  for (const l of getCart()) {
    if (l.price === null) complete = false;
    else total += l.price * l.qty;
  }
  return { total, complete };
}

export function addToCart(p: ProductData, size: string | null, qty = 1): void {
  const cart = getCart();
  const key = lineKey({ slug: p.slug, size });
  const existing = cart.find((l) => lineKey(l) === key);
  if (existing) existing.qty = Math.min(MAX_QTY, existing.qty + qty);
  else cart.push({ ...p, size, qty: Math.min(MAX_QTY, Math.max(1, qty)) });
  write(CART_KEY, cart);
}

/** Modifie quantité et/ou taille d'une ligne, puis fusionne les lignes devenues identiques. */
export function updateLine(key: string, patch: { qty?: number; size?: string | null }): void {
  const cart = getCart();
  const line = cart.find((l) => lineKey(l) === key);
  if (!line) return;
  if (patch.qty !== undefined) line.qty = patch.qty;
  if (patch.size !== undefined) line.size = patch.size;
  const merged: CartLine[] = [];
  for (const l of cart) {
    if (l.qty <= 0) continue;
    const same = merged.find((m) => lineKey(m) === lineKey(l));
    if (same) same.qty = Math.min(MAX_QTY, same.qty + l.qty);
    else merged.push({ ...l, qty: Math.min(MAX_QTY, l.qty) });
  }
  write(CART_KEY, merged);
}

export function removeLine(key: string): void {
  write(
    CART_KEY,
    getCart().filter((l) => lineKey(l) !== key),
  );
}

export function clearCart(): void {
  write(CART_KEY, []);
}

/** Message WhatsApp récapitulant le panier (même ton que src/lib/whatsapp.ts). */
export function buildCartMessage(shopName: string, cart: CartLine[]): string {
  if (!cart.length) return `Bonjour ${shopName}, je souhaite des informations sur vos créations.`;
  const lines = cart.map((l) => {
    const size = l.sizes.length ? ` · taille ${l.size ?? 'à préciser'}` : '';
    const price =
      l.price !== null ? formatPrice(l.price * l.qty) : l.priceRange ? `${formatPriceRange(l.priceRange)} l'unité, à confirmer` : 'prix sur demande';
    return `• ${l.qty} × ${l.name} (${l.designer})${size} — ${price}`;
  });
  const { total, complete } = cartTotal();
  const totalLine = complete
    ? `Total indicatif : ${formatPrice(total)}`
    : total > 0
      ? `Sous-total des pièces à prix connu : ${formatPrice(total)} (le reste à confirmer)`
      : 'Total à confirmer avec la boutique.';
  return `Bonjour ${shopName}, je souhaite commander :\n${lines.join('\n')}\n${totalLine}\nMerci de me confirmer la disponibilité et la livraison.`;
}

// ---------------------------------------------------------------------------
// Favoris
// ---------------------------------------------------------------------------
export const getWishlist = (): ProductData[] => read<ProductData[]>(WISH_KEY, []);

export const isWished = (slug: string): boolean => getWishlist().some((p) => p.slug === slug);

/** Ajoute ou retire la pièce ; renvoie vrai si elle est désormais en favoris. */
export function toggleWish(p: ProductData): boolean {
  const list = getWishlist();
  const i = list.findIndex((w) => w.slug === p.slug);
  if (i >= 0) {
    list.splice(i, 1);
    write(WISH_KEY, list);
    return false;
  }
  list.push(p);
  write(WISH_KEY, list);
  return true;
}

export function removeWish(slug: string): void {
  write(
    WISH_KEY,
    getWishlist().filter((p) => p.slug !== slug),
  );
}

// ---------------------------------------------------------------------------
// Boutons génériques (cartes produit, fiche produit)
// ---------------------------------------------------------------------------

/** Met à jour l'état visuel de tous les boutons favoris de la page. */
export function syncWishButtons(root: ParentNode = document): void {
  const wished = new Set(getWishlist().map((p) => p.slug));
  root.querySelectorAll<HTMLElement>('[data-wish]').forEach((btn) => {
    const slug = readProduct(btn)?.slug;
    const on = !!slug && wished.has(slug);
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-pressed', String(on));
    const label = btn.querySelector<HTMLElement>('[data-wish-label]');
    if (label) label.textContent = on ? 'Retirer des favoris' : 'Ajouter aux favoris';
  });
}

let delegated = false;
/** Délégation globale : `[data-wish]` bascule les favoris, `[data-quick-add]` ajoute au panier. */
export function initStoreButtons(): void {
  if (delegated) return;
  delegated = true;
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const wish = target.closest<HTMLElement>('[data-wish]');
    if (wish) {
      e.preventDefault();
      const p = readProduct(wish);
      if (!p) return;
      const on = toggleWish(p);
      toast(on ? `« ${p.name} » ajouté aux favoris` : `« ${p.name} » retiré des favoris`, on ? { href: paths.wishlist, label: 'Voir mes favoris' } : undefined);
      return;
    }
    const quick = target.closest<HTMLElement>('[data-quick-add]');
    if (quick) {
      e.preventDefault();
      const p = readProduct(quick);
      if (!p) return;
      addToCart(p, null, 1);
      const note = p.sizes.length ? ' (taille à choisir dans le panier)' : '';
      toast(`« ${p.name} » ajouté au panier${note}`, { href: paths.cart, label: 'Voir le panier' });
    }
  });
  window.addEventListener(STORE_EVENT, () => syncWishButtons());
  syncWishButtons();
}
