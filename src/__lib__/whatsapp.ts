import { CONTACT } from '@/__data__/contact';

export function buildWhatsAppHref(
  message: string,
  number: string = CONTACT.whatsappNumber,
): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
