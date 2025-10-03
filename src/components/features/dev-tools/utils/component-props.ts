// RUTA: src/components/features/dev-tools/utils/component-props.ts
/**
 * @file component-props.ts
 * @description Utilidad para generar props de fallback robustas y estructuradas para
 *              componentes de desarrollo dentro del Developer Command Center (DCC).
 * @version 2.3.0 (Holistic Hygiene & Elite Compliance)
 * @author L.I.A. Legacy
 */
import { logger } from "@/shared/lib/logging";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

/**
 * @function getFallbackProps
 * @description Genera props de fallback completas y tipadas para componentes específicos
 *              del Dev Canvas, asegurando que la estructura esperada por el componente
 *              esté presente para evitar TypeError durante el desarrollo.
 * @param {string} name - Nombre del componente para el cual generar las props de fallback.
 * @returns {Record<string, unknown>} Objeto de props de fallback estructuradas.
 */
export function getFallbackProps(name: string): Record<string, unknown> {
  const traceId = logger.startTrace(`getFallbackProps:${name}`);
  logger.traceEvent(traceId, `Generando props de fallback para: ${name}`);

  // SSoT de datos de fallback para i18n
  const fallbackHeaderContent: NonNullable<Dictionary["header"]> = {
    logoUrl: "/img/layout/header/globalfitwell-logo-v2.svg",
    logoAlt: "Logo Global Fitwell Mock",
    navLinks: [{ label: "Mock Link", href: "/dev" }],
    signUpButton: { label: "Sign Up Mock" },
  };

  const fallbackDevMenuContent: NonNullable<Dictionary["devRouteMenu"]> = {
    devMenuLabel: "Dev Tools",
    devToolsGroup: "DEV TOOLS",
    campaignPagesGroup: "CAMPAIGN PAGES",
    portalPagesGroup: "PORTAL PAGES",
    legalPagesGroup: "LEGAL PAGES",
  };

  const fallbackCommentSectionContent: NonNullable<
    Dictionary["commentSection"]
  > = {
    title: "Commenti (Fallback)",
    form: {
      placeholder: "Aggiungi il tuo commento...",
      minCharactersError: "Minimo 3 caratteri.",
      publishButton: "Pubblica",
      publishButtonLoading: "Pubblicazione...",
      loginPrompt: "Per partecipare, per favore",
      loginLink: "accedi",
      loginPromptSuffix: "per commentare.",
      authRequiredMessage: "",
      loginLinkText: "",
    },
    list: {
      emptyState: "Sii il primo a commentare!",
    },
    toast: {
      success: "Successo!",
      errorTitle: "Errore",
      authError: "Autenticazione richiesta.",
    },
  };

  try {
    switch (name) {
      case "Header":
      case "StandardHeader":
      case "MinimalHeader":
        return {
          content: fallbackHeaderContent,
          devDictionary: fallbackDevMenuContent,
          // Props adicionales que el componente HeaderClient podría necesitar
          user: null,
          profile: null,
          currentLocale: "it-IT",
          supportedLocales: ["it-IT", "es-ES"],
          initialCart: [],
        };

      case "Footer":
        return {
          content: {
            newsletter: {
              title: "Newsletter Fallback",
              description: "Suscríbete para recibir noticias.",
              placeholder: "tu@email.com",
              buttonText: "Suscribir",
              buttonAriaLabel: "Suscribir a la newsletter",
            },
            linkColumns: [],
            socialLinks: [],
            copyright: "© 2025 Fallback Copyright",
            disclaimer: "Este es un disclaimer de fallback.",
            developerLink: { label: "MetaShark Tech", href: "#" },
          },
        };

      case "TextSection":
        return {
          content: [
            { type: "h2", text: "Título de Fallback" },
            {
              type: "p",
              text: "Este es un párrafo de contenido de fallback para el componente TextSection.",
            },
          ],
        };

      case "CommentSectionClient":
        return {
          initialComments: [],
          articleId: "mock-article-id",
          articleSlug: "mock-article-slug",
          isAuthenticated: true,
          currentUser: { name: "Utente Mock" },
          content: fallbackCommentSectionContent,
          locale: "it-IT",
        };

      // Añadir más casos según sea necesario para otros componentes...

      default:
        logger.warn(
          `[getFallbackProps] No hay props de fallback definidas para: ${name}. Se devuelve un objeto vacío.`,
          { traceId }
        );
        return {};
    }
  } finally {
    logger.endTrace(traceId);
  }
}
