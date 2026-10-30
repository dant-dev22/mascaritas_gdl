import { CONTACT } from '@/__data__/contact';

export function buildWhatsAppHref(message: string): string {
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
