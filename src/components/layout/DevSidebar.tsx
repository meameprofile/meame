// RUTA: src/components/layout/DevSidebar.tsx
/**
 * @file DevSidebar.tsx
 * @description Barra lateral soberana para el Developer Command Center.
 * @version 1.0.0 (Forged & Elite)
 * @author L.I.A. Legacy
 */
"use client";

import React from "react";
import Link from "next/link";
import { UserNavClient } from "@/components/features/auth/components/UserNavClient";
import type { HeaderClientProps } from "@/components/layout/HeaderClient";
import { logger } from "@/shared/lib/logging";
import { useWorkspaceStore } from "@/shared/lib/stores/use-workspace.store";

type DevSidebarProps = Pick<
  HeaderClientProps,
  "user" | "profile" | "currentLocale" | "content"
>;

export function DevSidebar({
  user,
  profile,
  currentLocale,
  content,
}: DevSidebarProps) {
  logger.info("[DevSidebar] Renderizando barra lateral del DCC.");

  const { activeWorkspaceId, availableWorkspaces } = useWorkspaceStore();
  const activeWorkspace = availableWorkspaces.find(
    (ws) => ws.id === activeWorkspaceId
  );

  return (
    <aside className="h-full w-72 flex-col border-r bg-background p-4 hidden md:flex">
      <div className="flex h-16 items-center border-b px-2">
        <Link
          href={`/${currentLocale}/dev`}
          className="flex items-center gap-2 font-semibold"
        >
          <span className="text-primary">DCC</span>
          <span>/</span>
          <span>{activeWorkspace?.name || "Cargando..."}</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        {/* El DevRouteMenu se podría mover aquí para una navegación persistente */}
      </nav>
      <div className="mt-auto">
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
