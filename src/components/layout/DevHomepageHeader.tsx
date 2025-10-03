// RUTA: src/components/layout/DevHomepageHeader.tsx
/**
 * @file DevHomepageHeader.tsx
 * @description Header de desarrollo para la página de inicio.
 *              v9.0.0 (Sovereign Path Restoration): Se corrige la ruta de
 *              importación para alinearse con la Arquitectura Canónica Soberana
 *              (ACS), restaurando la integridad del build.
 * @version 9.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { logger } from "@/shared/lib/logging";
import { getCurrentLocaleFromPathname } from "@/shared/lib/utils/i18n/i18n.utils";
import { routes } from "@/shared/lib/navigation";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
// Se corrige la ruta de importación a la SSoT canónica utilizando un alias soberano.
import DevToolsDropdown from "@/components/features/dev-tools/DevToolsDropdown";
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA] ---

interface DevHomepageHeaderProps {
  dictionary: NonNullable<Dictionary["devHomepageHeader"]>;
  devRouteMenuDictionary: NonNullable<Dictionary["devRouteMenu"]>;
}

export function DevHomepageHeader({
  dictionary,
  devRouteMenuDictionary,
}: DevHomepageHeaderProps): React.ReactElement | null {
  logger.info(
    "[DevHomepageHeader] Renderizando v9.0 (Sovereign Path Restoration)."
  );
  const pathname = usePathname();
  const currentLocale = getCurrentLocaleFromPathname(pathname);

  if (!dictionary || !devRouteMenuDictionary) {
    logger.warn(
      "[DevHomepageHeader] No se proporcionó contenido completo. El header no se renderizará."
    );
    return null;
  }

  return (
    <header className="py-3 sticky top-0 z-50 bg-destructive/90 backdrop-blur-lg border-b border-destructive/50">
      <Container>
        <div className="flex h-16 items-center justify-between gap-8">
          <nav className="flex items-center gap-4">
            <Link
              href={routes.home.path({ locale: currentLocale })}
              className="text-destructive-foreground hover:text-destructive-foreground/80 transition-colors px-3 py-2 rounded-md bg-destructive/50"
            >
              {dictionary.homeLink}
            </Link>
            <Link
              href={routes.about.path({ locale: currentLocale })}
              className="text-destructive-foreground hover:text-destructive-foreground/80 transition-colors px-3 py-2 rounded-md bg-destructive/50"
            >
              {dictionary.aboutLink}
            </Link>
            <Link
              href={routes.store.path({ locale: currentLocale })}
              className="text-destructive-foreground hover:text-destructive-foreground/80 transition-colors px-3 py-2 rounded-md bg-destructive/50"
            >
              {dictionary.storeLink}
            </Link>
            <Link
              href={routes.news.path({ locale: currentLocale })}
              className="text-destructive-foreground hover:text-destructive-foreground/80 transition-colors px-3 py-2 rounded-md bg-destructive/50"
            >
              {dictionary.blogLink}
            </Link>
          </nav>

          <div className="ml-auto">
            <DevToolsDropdown dictionary={devRouteMenuDictionary} />
          </div>
        </div>
      </Container>
    </header>
  );
}
// RUTA: src/components/layout/DevHomepageHeader.tsx
