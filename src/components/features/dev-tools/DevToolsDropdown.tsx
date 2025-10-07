// RUTA: src/components/features/dev-tools/DevToolsDropdown.tsx
/**
 * @file DevToolsDropdown.tsx
 * @description Componente de presentación 100% puro para el menú de desarrollo.
 *              v7.0.0 (Holistic Refactor - Presentation-Only): Refactorizado para
 *              ser un componente de presentación puro, recibiendo sus datos como props.
 * @version 7.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { logger } from "@/shared/lib/logging";
import type { RouteGroup } from "@/components/features/dev-tools/utils/route-menu.generator";
import { DevRouteMenu } from "@/components/features/dev-tools/DevRouteMenu";

interface DevToolsDropdownProps {
  routeGroups: RouteGroup[];
  buttonLabel: string;
}

export default function DevToolsDropdown({
  routeGroups,
  buttonLabel,
}: DevToolsDropdownProps): React.ReactElement {
  logger.info(
    "[DevToolsDropdown] Renderizando componente de presentación (v7.0)."
  );

  return <DevRouteMenu routeGroups={routeGroups} buttonLabel={buttonLabel} />;
}
