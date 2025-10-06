// RUTA: src/shared/lib/navigation.ts
/**
 * @file navigation.ts
 * @description Manifiesto y SSoT para la definición de rutas del ecosistema.
 *              v16.0.0 (Heimdall Observatory Integration): Se integra la nueva
 *              ruta soberana para el Observatorio Heimdall dentro del DCC.
 * @version 16.0.0
 * @author L.I.A. Legacy
 */
import { defaultLocale, type Locale } from "./i18n/i18n.config";
import { logger } from "./logging";

logger.info(
  "[Observabilidad][ARQUITECTURA-RAIZ] Cargando Manifiesto de Rutas v16.0..."
);

export const RouteType = {
  Public: "public",
  DevOnly: "dev-only",
} as const;

export type RouteType = (typeof RouteType)[keyof typeof RouteType];

export type RouteParams = {
  locale?: Locale;
  [key: string]: string | number | string[] | undefined;
};

const buildPath = (
  locale: Locale | undefined,
  template: string,
  params?: RouteParams
): string => {
  let path = `/${locale || defaultLocale}${template}`;
  if (params) {
    for (const key in params) {
      if (key !== "locale" && params[key] !== undefined) {
        const value = params[key];
        const stringValue = Array.isArray(value)
          ? value.join("/")
          : String(value);
        const placeholderRegex = new RegExp(
          `\\[\\[?\\.\\.\\.${key}\\]\\]?|\\[${key}\\]`
        );
        path = path.replace(placeholderRegex, stringValue);
      }
    }
  }
  path = path.replace(/\/\[\[\.\.\..*?\]\]/g, "");
  path = path.replace(/\/+/g, "/");
  if (path !== "/" && path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  return path || "/";
};

export const routes = {
  home: {
    path: (params: RouteParams) => buildPath(params.locale, "/"),
    template: "/",
    type: RouteType.Public,
  },
  store: {
    path: (params: RouteParams) => buildPath(params.locale, "/store"),
    template: "/store",
    type: RouteType.Public,
  },
  storeBySlug: {
    path: (params: RouteParams & { slug: string }) =>
      buildPath(params.locale, "/store/[slug]", params),
    template: "/store/[slug]",
    type: RouteType.Public,
  },
  news: {
    path: (params: RouteParams) => buildPath(params.locale, "/news"),
    template: "/news",
    type: RouteType.Public,
  },
  newsBySlug: {
    path: (params: RouteParams & { slug: string }) =>
      buildPath(params.locale, "/news/[slug]", params),
    template: "/news/[slug]",
    type: RouteType.Public,
  },
  about: {
    path: (params: RouteParams) => buildPath(params.locale, "/about"),
    template: "/about",
    type: RouteType.Public,
  },
  terms: {
    path: (params: RouteParams) => buildPath(params.locale, "/terms"),
    template: "/terms",
    type: RouteType.Public,
  },
  privacy: {
    path: (params: RouteParams) => buildPath(params.locale, "/privacy"),
    template: "/privacy",
    type: RouteType.Public,
  },
  cookies: {
    path: (params: RouteParams) => buildPath(params.locale, "/cookies"),
    template: "/cookies",
    type: RouteType.Public,
  },
  checkout: {
    path: (params: RouteParams) => buildPath(params.locale, "/checkout"),
    template: "/checkout",
    type: RouteType.Public,
  },
  cByCampaignIdByVariantSlugBySeoKeywordSlug: {
    path: (
      params: RouteParams & {
        campaignId: string;
        variantSlug: string;
        seoKeywordSlug: string;
      }
    ) =>
      buildPath(
        params.locale,
        "/c/[campaignId]/[variantSlug]/[seoKeywordSlug]",
        params
      ),
    template: "/c/[campaignId]/[variantSlug]/[seoKeywordSlug]",
    type: RouteType.Public,
  },
  login: {
    path: (params: RouteParams) => buildPath(params.locale, "/login"),
    template: "/login",
    type: RouteType.Public,
  },
  account: {
    path: (params: RouteParams) => buildPath(params.locale, "/account"),
    template: "/account",
    type: RouteType.Public,
  },
  notifications: {
    path: (params: RouteParams) => buildPath(params.locale, "/notifications"),
    template: "/notifications",
    type: RouteType.Public,
  },
  selectLanguage: {
    path: () => "/select-language",
    template: "/select-language",
    type: RouteType.Public,
  },
  notFound: {
    path: (params: RouteParams) => buildPath(params.locale, "/not-found"),
    template: "/not-found",
    type: RouteType.Public,
  },
  devDashboard: {
    path: (params: RouteParams) => buildPath(params.locale, "/dev"),
    template: "/dev",
    type: RouteType.DevOnly,
  },
  devTestPage: {
    path: (params: RouteParams) => buildPath(params.locale, "/dev/test-page"),
    template: "/dev/test-page",
    type: RouteType.DevOnly,
  },
  devComponentShowcase: {
    path: (params: RouteParams) =>
      buildPath(params.locale, "/dev/component-showcase"),
    template: "/dev/component-showcase",
    type: RouteType.DevOnly,
  },
  devCinematicDemo: {
    path: (params: RouteParams) =>
      buildPath(params.locale, "/dev/cinematic-demo"),
    template: "/dev/cinematic-demo",
    type: RouteType.DevOnly,
  },
  creatorCampaignSuite: {
    path: (params: RouteParams & { stepId?: string[] }) =>
      buildPath(params.locale, "/creator/campaign-suite/[[...stepId]]", params),
    template: "/creator/campaign-suite/[[...stepId]]",
    type: RouteType.DevOnly,
  },
  analytics: {
    path: (params: RouteParams) => buildPath(params.locale, "/dev/analytics"),
    template: "/dev/analytics",
    type: RouteType.DevOnly,
  },
  analyticsByVariant: {
    path: (params: RouteParams & { variantId: string }) =>
      buildPath(params.locale, "/dev/analytics/[variantId]", params),
    template: "/dev/analytics/[variantId]",
    type: RouteType.DevOnly,
  },
  bavi: {
    path: (params: RouteParams) => buildPath(params.locale, "/dev/bavi"),
    template: "/dev/bavi",
    type: RouteType.DevOnly,
  },
  razPrompts: {
    path: (params: RouteParams) => buildPath(params.locale, "/dev/raz-prompts"),
    template: "/dev/raz-prompts",
    type: RouteType.DevOnly,
  },
  cogniReadDashboard: {
    path: (params: RouteParams) => buildPath(params.locale, "/dev/cogniread"),
    template: "/dev/cogniread",
    type: RouteType.DevOnly,
  },
  cogniReadEditor: {
    path: (params: RouteParams) =>
      buildPath(params.locale, "/dev/cogniread/editor"),
    template: "/dev/cogniread/editor",
    type: RouteType.DevOnly,
  },
  nos3Dashboard: {
    path: (params: RouteParams) => buildPath(params.locale, "/dev/nos3"),
    template: "/dev/nos3",
    type: RouteType.DevOnly,
  },
  nos3SessionPlayer: {
    path: (params: RouteParams & { sessionId: string }) =>
      buildPath(params.locale, "/dev/nos3/[sessionId]", params),
    template: "/dev/nos3/[sessionId]",
    type: RouteType.DevOnly,
  },
  userIntelligence: {
    path: (params: RouteParams) =>
      buildPath(params.locale, "/dev/user-intelligence"),
    template: "/dev/user-intelligence",
    type: RouteType.DevOnly,
  },
  userIntelligenceDetail: {
    path: (params: RouteParams & { sessionId: string }) =>
      buildPath(params.locale, "/dev/user-intelligence/[sessionId]", params),
    template: "/dev/user-intelligence/[sessionId]",
    type: RouteType.DevOnly,
  },
  // --- [INICIO DE NIVELACIÓN DE RUTA v16.0.0] ---
  heimdallObservatory: {
    path: (params: RouteParams) =>
      buildPath(params.locale, "/dev/heimdall-observatory"),
    template: "/dev/heimdall-observatory",
    type: RouteType.DevOnly,
  },
  // --- [FIN DE NIVELACIÓN DE RUTA v16.0.0] ---
} as const;
