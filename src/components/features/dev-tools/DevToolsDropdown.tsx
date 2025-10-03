// RUTA: src/components/features/dev-tools/DevToolsDropdown.tsx
/**
 * @file DevToolsDropdown.tsx
 * @description Orquestador de datos para el DevRouteMenu.
 *              v6.0.0 (Sovereign Path Restoration): Se corrigen las rutas de
 *              importación para alinearse con la ACS, restaurando la
 *              integridad del build del DCC.
 * @version 6.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { usePathname } from "next/navigation";
import { logger } from "@/shared/lib/logging";
import { getCurrentLocaleFromPathname } from "@/shared/lib/utils/i18n/i18n.utils";
import { type Dictionary } from "@/shared/lib/schemas/i18n.schema";
// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
// Se corrigen ambas rutas de importación a sus SSoT canónicas.
import { generateDevRoutes } from "@/components/features/dev-tools/utils/route-menu.generator";
import { DevRouteMenu } from "@/components/features/dev-tools/DevRouteMenu";
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA] ---

interface DevToolsDropdownProps {
  dictionary: NonNullable<Dictionary["devRouteMenu"]>;
}

export default function DevToolsDropdown({
  dictionary,
}: DevToolsDropdownProps): React.ReactElement | null {
  logger.info("[DevToolsDropdown] Renderizando orquestador smart (v6.0).");
  const pathname = usePathname();
  const currentLocale = getCurrentLocaleFromPathname(pathname);

  if (!dictionary) {
    logger.warn(
      "[DevToolsDropdown] Diccionario no proporcionado. No se renderizará el menú."
    );
    return null;
  }

  logger.trace(
    `[DevToolsDropdown] Orquestando menú para locale: ${currentLocale}`
  );

  const routeGroups = generateDevRoutes(dictionary, currentLocale);
  const buttonLabel = dictionary.devMenuLabel;

  return <DevRouteMenu routeGroups={routeGroups} buttonLabel={buttonLabel} />;
}
// RUTA: src/components/features/dev-tools/DevToolsDropdown.tsx
