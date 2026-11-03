import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/__data__/site';
import { absoluteUrl } from '@/__lib__/seo';

/** Reglas de rastreo: permitimos todo salvo la API interna y publicamos el sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE_URL,
  };
}
