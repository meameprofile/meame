// RUTA: src/shared/lib/navigation.ts
/**
 * @file navigation.ts
 * @description Manifiesto y SSoT para la definición de rutas del ecosistema.
 *              ESTE ARCHIVO ES GENERADO AUTOMÁTICAMENTE. NO LO EDITE MANUALMENTE.
 *              Ejecute 'pnpm gen:routes' para actualizarlo.
 * @version 2025-10-10T18:35:52.372Z
 * @author Script de Generación Automática de Élite
 */
import { defaultLocale, type Locale } from "./i18n/i18n.config";

export const RouteType = {
  Public: "public",
  DevOnly: "dev-only",
} as const;

export type RouteType = (typeof RouteType)[keyof typeof RouteType];

export interface RouteParams {
  locale?: Locale;
  [key: string]: string | number | string[] | undefined;
}

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
        // --- [INICIO DE REFACTORIZACIÓN QUIRÚRGICA v9.1.0] ---
        // Se corrige la construcción de la RegExp para que las barras invertidas se escapen correctamente,
        // generando un código final sintácticamente válido y sin advertencias de ESLint.
        const placeholderRegex = new RegExp(
          `\\[\\[\\.\\.\\.${key}\\]\\]\\?|\\[${key}\\]`
        );
        // --- [FIN DE REFACTORIZACIÓN QUIRÚRGICA v9.1.0] ---
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
  about: {
    path: (params: RouteParams) => buildPath(params.locale, "/about", params),
    template: "/about",
    type: RouteType.Public,
  },
  account: {
    path: (params: RouteParams) => buildPath(params.locale, "/account", params),
    template: "/account",
    type: RouteType.Public,
  },
  analytics: {
    path: (params: RouteParams) =>
      buildPath(params.locale, "/analytics", params),
    template: "/analytics",
    type: RouteType.DevOnly,
  },
  analyticsByVariantId: {
    path: (params: RouteParams & { variantId: string | number | string[] }) =>
      buildPath(params.locale, "/analytics/[variantId]", params),
    template: "/analytics/[variantId]",
    type: RouteType.DevOnly,
  },
  bavi: {
    path: (params: RouteParams) => buildPath(params.locale, "/bavi", params),
    template: "/bavi",
    type: RouteType.DevOnly,
  },
  cByCampaignIdByVariantSlugBySeoKeywordSlug: {
    path: (
      params: RouteParams & {
        campaignId: string | number | string[];
        variantSlug: string | number | string[];
        seoKeywordSlug: string | number | string[];
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
  checkout: {
    path: (params: RouteParams) =>
      buildPath(params.locale, "/checkout", params),
    template: "/checkout",
    type: RouteType.Public,
  },
  cinematicDemo: {
    path: (params: RouteParams) =>
      buildPath(params.locale, "/cinematic-demo", params),
    template: "/cinematic-demo",
    type: RouteType.DevOnly,
  },
  cogniread: {
    path: (params: RouteParams) =>
      buildPath(params.locale, "/cogniread", params),
    template: "/cogniread",
    type: RouteType.DevOnly,
  },
  cognireadEditor: {
    path: (params: RouteParams) =>
      buildPath(params.locale, "/cogniread/editor", params),
    template: "/cogniread/editor",
    type: RouteType.DevOnly,
  },
  componentShowcase: {
    path: (params: RouteParams) =>
      buildPath(params.locale, "/component-showcase", params),
    template: "/component-showcase",
    type: RouteType.DevOnly,
  },
  cookies: {
    path: (params: RouteParams) => buildPath(params.locale, "/cookies", params),
    template: "/cookies",
    type: RouteType.Public,
  },
  creatorCampaignSuiteWithStepId: {
    path: (params: RouteParams & { stepId: string | number | string[] }) =>
      buildPath(params.locale, "/creator/campaign-suite/[[...stepId]]", params),
    template: "/creator/campaign-suite/[[...stepId]]",
    type: RouteType.DevOnly,
  },
  devDashboard: {
    path: (params: RouteParams) => buildPath(params.locale, "/dev", params),
    template: "/dev",
    type: RouteType.DevOnly,
  },
  heimdallObservatory: {
    path: (params: RouteParams) =>
      buildPath(params.locale, "/heimdall-observatory", params),
    template: "/heimdall-observatory",
    type: RouteType.DevOnly,
  },
  heimdallObservatorySystemHealth: {
    path: (params: RouteParams) =>
      buildPath(params.locale, "/heimdall-observatory/system-health", params),
    template: "/heimdall-observatory/system-health",
    type: RouteType.DevOnly,
  },
  home: {
    path: (params: RouteParams) => buildPath(params.locale, "/", params),
    template: "/",
    type: RouteType.Public,
  },
  login: {
    path: (params: RouteParams) => buildPath(params.locale, "/login", params),
    template: "/login",
    type: RouteType.Public,
  },
  news: {
    path: (params: RouteParams) => buildPath(params.locale, "/news", params),
    template: "/news",
    type: RouteType.Public,
  },
  newsBySlug: {
    path: (params: RouteParams & { slug: string | number | string[] }) =>
      buildPath(params.locale, "/news/[slug]", params),
    template: "/news/[slug]",
    type: RouteType.Public,
  },
  nos3: {
    path: (params: RouteParams) => buildPath(params.locale, "/nos3", params),
    template: "/nos3",
    type: RouteType.DevOnly,
  },
  nos3BySessionId: {
    path: (params: RouteParams & { sessionId: string | number | string[] }) =>
      buildPath(params.locale, "/nos3/[sessionId]", params),
    template: "/nos3/[sessionId]",
    type: RouteType.DevOnly,
  },
  notFound: {
    path: (params: RouteParams) =>
      buildPath(params.locale, "/not-found", params),
    template: "/not-found",
    type: RouteType.Public,
  },
  notifications: {
    path: (params: RouteParams) =>
      buildPath(params.locale, "/notifications", params),
    template: "/notifications",
    type: RouteType.Public,
  },
  privacy: {
    path: (params: RouteParams) => buildPath(params.locale, "/privacy", params),
    template: "/privacy",
    type: RouteType.Public,
  },
  razPrompts: {
    path: (params: RouteParams) =>
      buildPath(params.locale, "/raz-prompts", params),
    template: "/raz-prompts",
    type: RouteType.DevOnly,
  },
  store: {
    path: (params: RouteParams) => buildPath(params.locale, "/store", params),
    template: "/store",
    type: RouteType.Public,
  },
  storeBySlug: {
    path: (params: RouteParams & { slug: string | number | string[] }) =>
      buildPath(params.locale, "/store/[slug]", params),
    template: "/store/[slug]",
    type: RouteType.Public,
  },
  terms: {
    path: (params: RouteParams) => buildPath(params.locale, "/terms", params),
    template: "/terms",
    type: RouteType.Public,
  },
  userIntelligence: {
    path: (params: RouteParams) =>
      buildPath(params.locale, "/user-intelligence", params),
    template: "/user-intelligence",
    type: RouteType.DevOnly,
  },
  userIntelligenceBySessionId: {
    path: (params: RouteParams & { sessionId: string | number | string[] }) =>
      buildPath(params.locale, "/user-intelligence/[sessionId]", params),
    template: "/user-intelligence/[sessionId]",
    type: RouteType.DevOnly,
  },
} as const;
