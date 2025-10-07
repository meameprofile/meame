// RUTA: src/components/layout/DevSidebar.tsx
/**
 * @file DevSidebar.tsx
 * @description Barra lateral soberana para el DCC, ahora con observabilidad de
 *              intención de navegación y una higiene de código impecable.
 * @version 6.2.0 (Elite Code Hygiene)
 * @author L.I.A. Legacy
 */
"use client";

import React, { useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserNavClient } from "@/components/features/auth/components/UserNavClient";
import type { HeaderClientProps } from "@/components/layout/HeaderClient";
import { logger } from "@/shared/lib/logging";
import { useWorkspaceStore } from "@/shared/lib/stores/use-workspace.store";
import {
  type RouteGroup,
  type RouteItem,
} from "@/components/features/dev-tools/utils/route-menu.generator";
import type { Workspace } from "@/shared/lib/schemas/entities/workspace.schema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { Separator } from "@/components/ui/Separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { Badge } from "@/components/ui/Badge";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

type DevSidebarProps = Omit<
  HeaderClientProps,
  | "supportedLocales"
  | "logoUrl"
  | "initialCart"
  | "centerComponent"
  | "rightComponent"
> & {
  workspaces: Workspace[];
  content: HeaderClientProps["content"] & {
    devRouteMenu: NonNullable<Dictionary["devRouteMenu"]>;
  };
  routeGroups: RouteGroup[];
};

export function DevSidebar({
  user,
  profile,
  currentLocale,
  workspaces,
  content,
  routeGroups,
}: DevSidebarProps) {
  const traceId = useMemo(() => logger.startTrace("DevSidebar_Lifecycle_v6.2"), []);
  useEffect(() => {
    logger.info("[DevSidebar] Componente de presentación puro montado (v6.2).", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const { activeWorkspaceId, setAvailableWorkspaces } = useWorkspaceStore();
  const pathname = usePathname();

  useEffect(() => {
    setAvailableWorkspaces(workspaces);
  }, [workspaces, setAvailableWorkspaces]);

  const activeWorkspace = workspaces.find((ws) => ws.id === activeWorkspaceId);

  const handleLinkClick = useCallback((path: string, name: string) => {
    logger.info(`[DevSidebar] INTENCIÓN DE NAVEGACIÓN: El usuario ha hecho clic para ir a '${name}' (${path})`, { traceId });
  }, [traceId]);

  return (
    <aside className="h-full w-72 flex-col border-r bg-card p-4 hidden md:flex">
      <div className="flex h-16 items-center px-2">
        <Link
          href={`/${currentLocale}/dev`}
          className="flex items-center gap-2 font-semibold"
          onClick={() => handleLinkClick(`/${currentLocale}/dev`, "DCC Dashboard")}
        >
          <span className="text-primary font-black text-lg">DCC</span>
          <span className="text-muted-foreground">/</span>
          <span className="truncate text-foreground">
            {activeWorkspace?.name || "Cargando..."}
          </span>
        </Link>
      </div>
      <Separator />

      <nav className="flex-1 overflow-y-auto py-4 space-y-1">
        {routeGroups.map((group) => (
          <Accordion
            type="single"
            collapsible
            defaultValue={group.groupName}
            key={group.groupName}
          >
            <AccordionItem value={group.groupName} className="border-b-0">
              <AccordionTrigger className="py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline">
                {group.groupName}
              </AccordionTrigger>
              <AccordionContent className="pl-2 space-y-1">
                {group.items.map((item: RouteItem) => {
                  const isDynamic = item.path.includes("[");
                  const isActive = !isDynamic && pathname === item.path;

                  return (
                    <TooltipProvider key={item.path} delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            asChild={!isDynamic}
                            variant={isActive ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            disabled={isDynamic}
                          >
                            {isDynamic ? (
                              <span className="flex w-full items-center">
                                <DynamicIcon name={item.iconName} className="mr-2 h-4 w-4" />
                                {item.name}
                                <Badge variant="outline" className="ml-auto text-xs font-mono">tpl</Badge>
                              </span>
                            ) : (
                              <Link href={item.path} onClick={() => handleLinkClick(item.path, item.name)}>
                                <DynamicIcon name={item.iconName} className="mr-2 h-4 w-4" />
                                {item.name}
                              </Link>
                            )}
                          </Button>
                        </TooltipTrigger>
                        {isDynamic && (
                          <TooltipContent><p>Esta es una plantilla de ruta dinámica y no se puede navegar directamente.</p></TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </nav>

      <div className="mt-auto border-t pt-4">
        <UserNavClient
          user={user}
          profile={profile}
          userNavContent={content.userNav}
          loginContent={content.devLoginPage}
          locale={currentLocale}
        />
      </div>
    </aside>
  );
}
