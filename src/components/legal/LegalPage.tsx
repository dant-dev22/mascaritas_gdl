import { getTranslations } from 'next-intl/server';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import type { Locale } from '@/i18n/routing';
import type { LocalizedLegalDocument } from '@/__types__';

interface LegalPageProps {
  readonly locale: Locale;
  /** Documento con el contenido en cada idioma soportado. */
  readonly document: LocalizedLegalDocument;
  /** Clave del namespace `nav` con el nombre de esta página (migaja actual). */
  readonly breadcrumbKey: string;
}

/** Plantilla compartida por las páginas legales (privacidad, cookies y términos). */
export async function LegalPage({ locale, document, breadcrumbKey }: LegalPageProps) {
  const doc = document[locale];
  const t = await getTranslations({ locale, namespace: 'Legal' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const formattedDate = new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(`${doc.updatedAt}T00:00:00`));

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="contenido-principal" className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <Breadcrumbs
            items={[
              { label: t('breadcrumbHome'), href: '/' },
              { label: tNav(breadcrumbKey) },
            ]}
          />

          <h1 className="mt-4 font-display text-display-lg text-balance text-white">
            {doc.title}
          </h1>
          <p className="mt-3 text-sm text-text-faint">
            {t('updatedAt', { date: formattedDate })}
          </p>

          {doc.intro ? (
            <p className="mt-6 text-lg leading-relaxed text-text-muted">{doc.intro}</p>
          ) : null}

          <article className="mt-10 space-y-10">
            {doc.sections.map((section, index) => (
              <section
                key={section.heading}
                aria-labelledby={`legal-section-${index}`}
                className="scroll-mt-24"
              >
                <h2
                  id={`legal-section-${index}`}
                  className="font-display text-2xl text-white sm:text-3xl"
                >
                  {section.heading}
                </h2>

                {section.paragraphs?.map((paragraph, pIndex) => (
                  <p
                    key={`${section.heading}-p-${pIndex}`}
                    className="mt-3 leading-relaxed text-text-muted"
                  >
                    {paragraph}
                  </p>
                ))}

                {section.bullets ? (
                  <ul className="mt-3 space-y-2">
                    {section.bullets.map((bullet, bIndex) => (
                      <li
                        key={`${section.heading}-b-${bIndex}`}
                        className="flex gap-3 leading-relaxed text-text-muted"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-green"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
