import type { LocalizedLegalDocument } from '@/__types__';

/**
 * Política de Cookies de Mascaritas GDL, en español de México e inglés.
 * Documento bilingüe consumido por la ruta de cookies del sitio.
 */
export const COOKIES_DOCUMENT: LocalizedLegalDocument = {
  es: {
    title: 'Política de Cookies',
    intro:
      'Esta política explica qué cookies y tecnologías similares usamos en mascaritasgdl.com, para qué sirven y cómo puedes gestionar tu consentimiento. En Mascaritas GDL somos una tienda en línea de máscaras de lucha libre hechas a mano en Guadalajara, Jalisco, México.',
    updatedAt: '2026-11-18',
    sections: [
      {
        heading: '1. Qué son las cookies y tecnologías similares',
        paragraphs: [
          'Las cookies son pequeños archivos de texto que un sitio web guarda en tu navegador cuando lo visitas. Nos permiten recordar información sobre tu visita, como tu idioma preferido, para que no tengas que elegirla de nuevo cada vez que regresas.',
          'Además de cookies, un sitio web puede usar tecnologías similares como el almacenamiento local (localStorage) o el almacenamiento de sesión (sessionStorage), que guardan datos en tu dispositivo sin enviarlos al servidor en cada petición. En esta política nos referimos a todas ellas como cookies para simplificar.',
        ],
      },
      {
        heading: '2. Tipos de cookies según su finalidad',
        paragraphs: ['Clasificamos las cookies según para qué sirven:'],
        bullets: [
          'Necesarias (estrictamente necesarias): son imprescindibles para que el sitio funcione y para guardar tus preferencias básicas. No requieren consentimiento porque sin ellas el sitio no puede operar correctamente.',
          'De preferencias: recuerdan tus elecciones, como el idioma, para ofrecerte una experiencia más cómoda y consistente.',
          'Analíticas: nos ayudan a medir y entender cómo se usa el sitio, por ejemplo qué páginas se visitan más o cuánto tiempo se permanece en ellas. Nos permiten mejorar el contenido y el rendimiento.',
          'De marketing: se usan para mostrarte publicidad relevante y medir la eficacia de nuestras campañas en otros sitios y redes sociales.',
        ],
      },
      {
        heading: '3. Cookies que utilizamos actualmente',
        paragraphs: [
          'El sitio utiliza cookies necesarias, de preferencias y, cuando lo autorizas, de marketing. Estas son las cookies que usamos:',
        ],
        bullets: [
          'mascaritas_lang. Finalidad: guardar tu idioma preferido (español o inglés) para mostrarte el sitio en el idioma que elegiste. Duración: 1 año. Categoría: Necesaria / de preferencias.',
          'mascaritas_consent. Finalidad: guardar el registro de tu consentimiento, es decir la decisión que tomaste, las categorías aceptadas, la versión del aviso y la fecha. Duración: aproximadamente 6 meses. Categoría: Necesaria.',
          '_fbp. Finalidad: identificar tu navegador para medir la eficacia de nuestras campañas en Meta (Facebook e Instagram) y construir audiencias. La crea el píxel de Meta y solo se genera si aceptas la categoría de marketing. Duración: aproximadamente 90 días. Categoría: Marketing.',
          'La categoría Analítica aparece en el panel de preferencias, pero hoy permanece reservada y desactivada. La categoría de Marketing corresponde al píxel de Meta descrito arriba y se activa solo si la aceptas de forma expresa.',
        ],
      },
      {
        heading: '4. Cómo gestionar y retirar tu consentimiento',
        paragraphs: [
          'Cuando visitas el sitio por primera vez te mostramos un banner de consentimiento con tres opciones: Aceptar todas, Rechazar todas y Personalizar.',
          'Con Aceptar todas se activan las categorías disponibles y se permite que, si existen, se usen la analítica y el marketing. Con Rechazar todas se mantienen activas solo las cookies necesarias y no se usa analítica ni marketing. Con Personalizar puedes elegir categoría por categoría; las cookies necesarias siempre están activas y no pueden desactivarse.',
          'Puedes cambiar tu decisión en cualquier momento desde el enlace Preferencias de cookies que encontrarás en el pie de página. Al abrirlo se vuelve a mostrar el panel de preferencias.',
          'También puedes borrar o bloquear las cookies desde la configuración de tu navegador (Chrome, Safari, Firefox, Edge, entre otros). Ten en cuenta que si borras la cookie mascaritas_lang el sitio podría no recordar tu idioma, y si borras mascaritas_consent te volveremos a pedir tu decisión.',
          'Tu consentimiento tiene una vigencia aproximada de 6 meses. Al caducar, volveremos a solicitártelo.',
        ],
      },
      {
        heading: '5. Cookies de terceros',
        paragraphs: [
          'El sitio utiliza el píxel de Meta (Meta Platforms, Inc.) para medir visitas y conversiones de nuestras campañas en Facebook e Instagram. Es el único servicio de terceros con fines de medición que usamos hoy.',
          'El píxel solo se activa cuando aceptas la categoría de marketing en el banner de consentimiento. Mientras no la aceptes, su código permanece desactivado y no envía datos ni escribe la cookie _fbp. Puedes retirar tu consentimiento cuando quieras desde el enlace Preferencias de cookies.',
          'Si en el futuro incorporamos otras herramientas de analítica o de marketing, solo se activarán cuando aceptes esas categorías y el cambio se reflejará en esta política.',
        ],
      },
      {
        heading: '6. Base legal y relación con el Aviso de Privacidad',
        paragraphs: [
          'En México, el tratamiento de datos personales se rige por la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y su Reglamento, cuya autoridad es el Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (INAI).',
          'La base para el uso de cookies no necesarias es tu consentimiento informado, que otorgas de forma libre y expresa a través del banner. Puedes retirarlo en cualquier momento sin que ello afecte la legalidad del uso realizado antes de retirarlo.',
          'Para conocer con detalle cómo tratamos tu información, consulta nuestro Aviso de Privacidad en /aviso-de-privacidad.',
        ],
      },
      {
        heading: '7. Cambios en esta política',
        paragraphs: [
          'Podemos actualizar esta Política de Cookies para reflejar cambios en las cookies que usamos, en las herramientas que incorporamos o en la normativa aplicable.',
          'Cuando lo hagamos, actualizaremos la fecha de última actualización que aparece al inicio de este documento. Si el cambio es relevante, te volveremos a solicitar tu consentimiento.',
          'Última actualización: 18 de noviembre de 2026.',
        ],
      },
      {
        heading: '8. Contacto',
        paragraphs: [
          'Si tienes dudas sobre esta Política de Cookies o sobre el uso de cookies en el sitio, puedes contactarnos a través de los canales de atención habilitados en el sitio.',
        ],
      },
    ],
  },
  en: {
    title: 'Cookie Policy',
    intro:
      'This policy explains which cookies and similar technologies we use on mascaritasgdl.com, what they are for, and how you can manage your consent. At Mascaritas GDL we are an online store selling handmade lucha libre masks from Guadalajara, Jalisco, Mexico.',
    updatedAt: '2026-11-18',
    sections: [
      {
        heading: '1. What are cookies and similar technologies',
        paragraphs: [
          'Cookies are small text files that a website saves in your browser when you visit it. They allow us to remember information about your visit, such as your preferred language, so you do not have to choose it again every time you come back.',
          'In addition to cookies, a website may use similar technologies such as local storage (localStorage) or session storage (sessionStorage), which keep data on your device without sending it to the server on every request. In this policy we refer to all of them as cookies for simplicity.',
        ],
      },
      {
        heading: '2. Types of cookies by purpose',
        paragraphs: ['We classify cookies by what they are used for:'],
        bullets: [
          'Strictly necessary: they are essential for the site to work and to store your basic preferences. They do not require consent because the site cannot operate correctly without them.',
          'Preferences: they remember your choices, such as your language, to give you a more convenient and consistent experience.',
          'Analytics: they help us measure and understand how the site is used, for example which pages are visited the most or how long people stay. They let us improve our content and performance.',
          'Marketing: they are used to show you relevant advertising and to measure the effectiveness of our campaigns on other sites and social networks.',
        ],
      },
      {
        heading: '3. Cookies we currently use',
        paragraphs: [
          'The site uses necessary and preference cookies and, when you authorize it, marketing cookies. These are the cookies we use:',
        ],
        bullets: [
          'mascaritas_lang. Purpose: to store your preferred language (Spanish or English) so we can show the site in the language you chose. Duration: 1 year. Category: Necessary / preferences.',
          'mascaritas_consent. Purpose: to store the record of your consent, meaning the decision you made, the accepted categories, the version of the notice, and the date. Duration: approximately 6 months. Category: Necessary.',
          '_fbp. Purpose: to identify your browser so we can measure the effectiveness of our campaigns on Meta (Facebook and Instagram) and build audiences. It is set by the Meta pixel and is created only if you accept the marketing category. Duration: approximately 90 days. Category: Marketing.',
          'The Analytics category appears in the preferences panel, but today it remains reserved and disabled. The Marketing category corresponds to the Meta pixel described above and is enabled only if you expressly accept it.',
        ],
      },
      {
        heading: '4. How to manage and withdraw your consent',
        paragraphs: [
          'When you first visit the site we show you a consent banner with three options: Accept all, Reject all, and Customize.',
          'With Accept all, the available categories are enabled and analytics and marketing may be used if they exist. With Reject all, only the necessary cookies stay active and neither analytics nor marketing is used. With Customize, you can choose category by category; necessary cookies are always active and cannot be disabled.',
          'You can change your decision at any time using the Cookie preferences link in the footer. Opening it shows the preferences panel again.',
          'You can also delete or block cookies from your browser settings (Chrome, Safari, Firefox, Edge, and others). Keep in mind that if you delete the mascaritas_lang cookie the site may not remember your language, and if you delete mascaritas_consent we will ask for your decision again.',
          'Your consent lasts approximately 6 months. When it expires, we will ask you again.',
        ],
      },
      {
        heading: '5. Third-party cookies',
        paragraphs: [
          'The site uses the Meta pixel (Meta Platforms, Inc.) to measure visits and conversions from our campaigns on Facebook and Instagram. It is the only third-party service we use for measurement today.',
          'The pixel is activated only when you accept the marketing category in the consent banner. As long as you do not accept it, its code stays disabled and sends no data and does not set the _fbp cookie. You can withdraw your consent at any time from the Cookie preferences link.',
          'If we add other analytics or marketing tools in the future, they will be activated only when you accept those categories, and the change will be reflected in this policy.',
        ],
      },
      {
        heading: '6. Legal basis and relationship with the Privacy Notice',
        paragraphs: [
          'In Mexico, the processing of personal data is governed by the Federal Law on the Protection of Personal Data Held by Private Parties (LFPDPPP) and its Regulations, whose authority is the National Institute for Transparency, Access to Information, and Personal Data Protection (INAI).',
          'The basis for the use of non-essential cookies is your informed consent, which you give freely and expressly through the banner. You can withdraw it at any time without affecting the lawfulness of the use carried out before withdrawal.',
          'To learn in detail how we handle your information, please read our Privacy Notice at /aviso-de-privacidad.',
        ],
      },
      {
        heading: '7. Changes to this policy',
        paragraphs: [
          'We may update this Cookie Policy to reflect changes in the cookies we use, the tools we add, or the applicable regulations.',
          'When we do, we will update the last updated date shown at the beginning of this document. If the change is significant, we will ask for your consent again.',
          'Last updated: November 18, 2026.',
        ],
      },
      {
        heading: '8. Contact',
        paragraphs: [
          'If you have questions about this Cookie Policy or about the use of cookies on the site, you can contact us through the support channels available on the site.',
        ],
      },
    ],
  },
};
