// RUTA: src/shared/lib/navigation.ts
/**
 * @file navigation.ts
 * @description Manifiesto y SSoT para la definición de rutas del ecosistema.
 *              v22.0.0 (Isomorphic Purity Restoration): Se elimina la directiva 'server-only'
 *              para restaurar la naturaleza isomórfica del módulo, permitiendo su
 *              consumo seguro tanto en componentes de servidor como de cliente.
 * @version 22.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
// La directiva "server-only" ha sido eliminada.
import { defaultLocale, type Locale } from "./i18n/i18n.config";

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
  // --- Rutas Públicas ---
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

  // --- Rutas del DCC ---
  devDashboard: {
    path: (params: RouteParams) => buildPath(params.locale, "/dev"),
    template: "/dev",
    type: RouteType.DevOnly,
  },
  devComponentShowcase: {
    path: (params: RouteParams) =>
      buildPath(params.locale, "/component-showcase"),
    template: "/component-showcase",
    type: RouteType.DevOnly,
  },
  devCinematicDemo: {
    path: (params: RouteParams) => buildPath(params.locale, "/cinematic-demo"),
    template: "/cinematic-demo",
    type: RouteType.DevOnly,
  },
  creatorCampaignSuite: {
    path: (params: RouteParams & { stepId?: string[] }) =>
      buildPath(params.locale, "/creator/campaign-suite/[[...stepId]]", params),
    template: "/creator/campaign-suite/[[...stepId]]",
    type: RouteType.DevOnly,
  },
  analytics: {
    path: (params: RouteParams) => buildPath(params.locale, "/analytics"),
    template: "/analytics",
    type: RouteType.DevOnly,
  },
  analyticsByVariant: {
    path: (params: RouteParams & { variantId: string }) =>
      buildPath(params.locale, "/analytics/[variantId]", params),
    template: "/analytics/[variantId]",
    type: RouteType.DevOnly,
  },
  bavi: {
    path: (params: RouteParams) => buildPath(params.locale, "/bavi"),
    template: "/bavi",
    type: RouteType.DevOnly,
  },
  razPrompts: {
    path: (params: RouteParams) => buildPath(params.locale, "/raz-prompts"),
    template: "/raz-prompts",
    type: RouteType.DevOnly,
  },
  cogniReadDashboard: {
    path: (params: RouteParams) => buildPath(params.locale, "/cogniread"),
    template: "/cogniread",
    type: RouteType.DevOnly,
  },
  cogniReadEditor: {
    path: (params: RouteParams) =>
      buildPath(params.locale, "/cogniread/editor"),
    template: "/cogniread/editor",
    type: RouteType.DevOnly,
  },
  nos3Dashboard: {
    path: (params: RouteParams) => buildPath(params.locale, "/nos3"),
    template: "/nos3",
    type: RouteType.DevOnly,
  },
  nos3SessionPlayer: {
    path: (params: RouteParams & { sessionId: string }) =>
      buildPath(params.locale, "/nos3/[sessionId]", params),
    template: "/nos3/[sessionId]",
    type: RouteType.DevOnly,
  },
  userIntelligence: {
    path: (params: RouteParams) =>
      buildPath(params.locale, "/user-intelligence"),
    template: "/user-intelligence",
    type: RouteType.DevOnly,
  },
  userIntelligenceDetail: {
    path: (params: RouteParams & { sessionId: string }) =>
      buildPath(params.locale, "/user-intelligence/[sessionId]", params),
    template: "/user-intelligence/[sessionId]",
    type: RouteType.DevOnly,
  },
  heimdallObservatory: {
    path: (params: RouteParams) =>
      buildPath(params.locale, "/heimdall-observatory"),
    template: "/heimdall-observatory",
    type: RouteType.DevOnly,
  },
} as const;
