import type { MetadataRoute } from 'next';
import { absoluteUrl, buildLanguageAlternates } from '@/__lib__/seo';
import { listAllSlugs } from '@/server/catalogRepository';

type SitemapEntry = MetadataRoute.Sitemap[number];

/** Arma una entrada del sitemap a partir de la ruta sin prefijo de idioma. */
function buildEntry(
  pathnameWithoutLocale: string,
  changeFrequency: SitemapEntry['changeFrequency'],
  priority: number,
): SitemapEntry {
  return {
    // La versión en español (idioma por defecto) actúa como URL canónica principal.
    url: absoluteUrl(`/es${pathnameWithoutLocale}`),
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: buildLanguageAlternates(pathnameWithoutLocale),
    },
  };
}

/**
 * Sitemap XML con home, catálogo y una entrada por producto. Si el backend no
 * responde, se publican solo las rutas estáticas para no romper el build.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    buildEntry('', 'weekly', 1),
    buildEntry('/catalogo', 'daily', 0.9),
  ];

  // Los slugs salen siempre del backend; ante un fallo no interrumpimos el build.
  let slugs: ReadonlyArray<string> = [];

  try {
    slugs = await listAllSlugs();
  } catch {
    slugs = [];
  }

  const productEntries: MetadataRoute.Sitemap = slugs.map((slug) =>
    buildEntry(`/producto/${slug}`, 'daily', 0.8),
  );

  return [...staticEntries, ...productEntries];
}
