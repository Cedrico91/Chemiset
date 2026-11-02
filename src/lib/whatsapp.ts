import type { Designer, Product } from '../data/types';
import { site } from '../config/site';

export const normalizeNumber = (n: string): string => n.replace(/\D/g, '');

/** Vrai si un numéro WhatsApp exploitable est configuré dans src/config/site.ts. */
export const hasWhatsApp = (): boolean => normalizeNumber(site.whatsapp).length >= 8;

export function buildOrderMessage(product?: Product, designer?: Designer, url?: string): string {
  if (!product) {
    return `Bonjour ${site.name}, je souhaite des informations sur vos créations.`;
  }
  const who = designer ? ` de ${designer.name}` : '';
  const link = url ? `\n${url}` : '';
  return `Bonjour ${site.name}, je souhaite commander « ${product.name} »${who}.${link}`;
}

export function buildWaLink(number: string, message: string): string {
  return `https://wa.me/${normalizeNumber(number)}?text=${encodeURIComponent(message)}`;
}
