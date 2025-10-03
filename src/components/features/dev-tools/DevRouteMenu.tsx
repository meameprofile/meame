// Ruta correcta: src/components/dev/DevRouteMenu.tsx
/**
 * @file DevRouteMenu.tsx
 * @description Componente de presentación 100% puro para el menú de desarrollo.
 *              v3.0.0 (Holistic Refactor - Path & Type Safety): Se corrigen las rutas
 *              de importación a sus SSoT canónicas y se erradican los 'any' implícitos
 *              mediante la importación y uso de contratos de tipo explícitos.
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {
  type RouteGroup,
  type RouteItem,
} from "@/components/features/dev-tools/utils/route-menu.generator";
import { logger } from "@/shared/lib/logging";

interface DevRouteMenuProps {
  routeGroups: RouteGroup[];
  buttonLabel: string;
}

export function DevRouteMenu({
  routeGroups,
  buttonLabel,
}: DevRouteMenuProps): React.ReactElement {
  logger.info(
    "[Observabilidad][DevRouteMenu] Renderizando componente de presentación puro (v3.0)."
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm">
          <DynamicIcon name="Wrench" className="mr-2 h-4 w-4" />
          {buttonLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        {routeGroups.map((group, groupIndex) => (
          <DropdownMenuGroup key={group.groupName}>
            <DropdownMenuLabel>{group.groupName}</DropdownMenuLabel>
            {group.items.map((item: RouteItem) => (
              <Link href={item.path} key={item.path} passHref legacyBehavior>
                <DropdownMenuItem>
                  <DynamicIcon name={item.iconName} className="mr-3 h-4 w-4" />
                  <span>{item.name}</span>
                </DropdownMenuItem>
              </Link>
            ))}
            {groupIndex < routeGroups.length - 1 && <DropdownMenuSeparator />}
          </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
