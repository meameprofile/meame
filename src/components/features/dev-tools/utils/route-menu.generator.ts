// RUTA: src/components/features/dev-tools/utils/route-menu.generator.ts
/**
 * @file route-menu.generator.ts
 * @description Motor de generación de menú anti-frágil.
 * @version 7.1.0 (Holistic Restoration & System Health Seismograph Integration)
 * @author RaZ Podestá - MetaShark Tech
 */
import { type LucideIconName } from "@/shared/lib/config/lucide-icon-names";
import { type Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import { routes, RouteType, type RouteParams } from "@/shared/lib/navigation";
import { type Dictionary } from "@/shared/lib/schemas/i18n.schema";

export interface RouteItem {
  name: string;
  path: string;
  iconName: LucideIconName;
}

export interface RouteGroup {
  groupName: string;
  items: RouteItem[];
}

const iconMap: Record<string, LucideIconName> = {
  home: "Home",
  store: "Store",
  storeBySlug: "ShoppingBag",
  news: "Newspaper",
  newsBySlug: "FileText",
  about: "Info",
  terms: "BookCopy",
  privacy: "Shield",
  cookies: "Cookie",
  notFound: "TriangleAlert",
  cByCampaignIdByVariantSlugBySeoKeywordSlug: "Rocket",
  devDashboard: "LayoutDashboard",
  devLogin: "LogIn",
  componentShowcase: "Component",
  creatorCampaignSuiteWithStepId: "LayoutTemplate",
  bavi: "LibraryBig",
  razPrompts: "BrainCircuit",
  cogniReadDashboard: "BookOpenCheck",
  cogniReadEditor: "FilePenLine",
  nos3: "ScreenShare",
  analytics: "AreaChart",
  userIntelligence: "Users",
  heimdallObservatory: "ShieldCheck",
  heimdallObservatorySystemHealth: "HeartPulse",
};

const getMockParams = (key: string, locale: Locale): RouteParams => {
  if (key.startsWith("cBy")) {
    return {
      locale,
      campaignId: "12157",
      variantSlug: "scientific",
      seoKeywordSlug: "benessere-evidenza-scientifica",
    };
  }
  if (key.includes("BySlug")) {
    return { locale, slug: "ejemplo-de-slug" };
  }
  if (key === "analyticsByVariantId") {
    return { locale, variantId: "01" };
  }
  if (key === "nos3BySessionId" || key === "userIntelligenceBySessionId") {
    return { locale, sessionId: "mock-session-id" };
  }
  return { locale };
};

export function generateDevRoutes(
  dictionary: Dictionary["devRouteMenu"],
  locale: Locale
): RouteGroup[] {
  const traceId = logger.startTrace("generateDevRoutes_v7.1");
  logger.info(
    "[route-menu.generator] Generando estructura de menú dinámica..."
  );

  if (!dictionary) {
    logger.warn("[route-menu.generator] Diccionario no proporcionado.");
    return [];
  }

  const groups: Record<string, RouteItem[]> = {
    [dictionary.devToolsGroup]: [],
    [dictionary.campaignPagesGroup]: [],
    [dictionary.portalPagesGroup]: [],
    [dictionary.legalPagesGroup]: [],
  };

  for (const [key, route] of Object.entries(routes)) {
    let groupKey: string | null = null;

    if (route.type === RouteType.DevOnly) {
      groupKey = dictionary.devToolsGroup;
    } else if (route.type === RouteType.Public) {
      if (["terms", "privacy", "cookies"].includes(key)) {
        groupKey = dictionary.legalPagesGroup;
      } else if (key.startsWith("cBy")) {
        groupKey = dictionary.campaignPagesGroup;
      } else {
        groupKey = dictionary.portalPagesGroup;
      }
    }

    if (groupKey && groups[groupKey]) {
      const label = dictionary[key as keyof typeof dictionary] || key;
      const params = getMockParams(key, locale);

      const path = (route.path as (p: RouteParams) => string)(params);

      groups[groupKey].push({
        name: String(label),
        path: path,
        iconName: iconMap[key] || "File",
      });
    }
  }

  logger.endTrace(traceId);

  return [
    {
      groupName: dictionary.devToolsGroup,
      items: groups[dictionary.devToolsGroup],
    },
    {
      groupName: dictionary.campaignPagesGroup,
      items: groups[dictionary.campaignPagesGroup],
    },
    {
      groupName: dictionary.portalPagesGroup,
      items: groups[dictionary.portalPagesGroup],
    },
    {
      groupName: dictionary.legalPagesGroup,
      items: groups[dictionary.legalPagesGroup],
    },
  ].filter((g) => g.items.length > 0);
}
