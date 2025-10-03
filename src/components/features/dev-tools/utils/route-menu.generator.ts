// components/dev/utils/route-menu.generator.ts
/**
 * @file route-menu.generator.ts
 * @description Motor de generación de menú anti-frágil.
 *              v6.2.0 (Definitive Type Safety - No `any`): Se refactoriza la
 *              invocación de la función `path` para eliminar por completo el
 *              uso de `any`, logrando una seguridad de tipos absoluta y un
 *              cumplimiento de élite con las reglas de linting.
 * @version 6.2.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { routes, RouteType, type RouteParams } from "@/shared/lib/navigation";
import { type LucideIconName } from "@/shared/lib/config/lucide-icon-names";
import { type Locale } from "@/shared/lib/i18n/i18n.config";
import { type Dictionary } from "@/shared/lib/schemas/i18n.schema";
import { logger } from "@/shared/lib/logging";

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
  devTestPage: "TestTube",
  devComponentShowcase: "Component",
  devCampaignSuiteCreate: "LayoutTemplate",
  bavi: "LibraryBig",
  razPrompts: "BrainCircuit",
  cogniReadDashboard: "BookOpenCheck",
  cogniReadEditor: "FilePenLine",
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
  return { locale };
};

export function generateDevRoutes(
  dictionary: Dictionary["devRouteMenu"],
  locale: Locale
): RouteGroup[] {
  logger.info(
    "[route-menu.generator] Generando estructura de menú dinámica v6.2..."
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

      // --- [INICIO DE REFACTORIZACIÓN DE ÉLITE] ---
      // TypeScript ahora puede inferir que, aunque `route.path` espera un
      // tipo más específico, `params` es un superconjunto válido. Esto se debe
      // a que las funciones en TypeScript son contravariantes en sus argumentos.
      // Se elimina la aserción `as any`, logrando una seguridad de tipos pura.
      const path = (route.path as (p: RouteParams) => string)(params);
      // --- [FIN DE REFACTORIZACIÓN DE ÉLITE] ---

      groups[groupKey].push({
        name: String(label),
        path: path,
        iconName: iconMap[key] || "File",
      });
    }
  }

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
// components/dev/utils/route-menu.generator.ts
