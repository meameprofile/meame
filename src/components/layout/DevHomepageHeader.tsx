// RUTA: src/components/layout/DevHomepageHeader.tsx
/**
 * @file DevHomepageHeader.tsx
 * @description Header de desarrollo para la página de inicio.
 *              v10.0.0 (Data-Driven Contract Restoration): Refactorizado para
 *              generar dinámicamente las props requeridas por DevToolsDropdown,
 *              restaurando la integridad del contrato de datos.
 * @version 10.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import DevToolsDropdown from "@/components/features/dev-tools/DevToolsDropdown";
import { generateDevRoutes } from "@/components/features/dev-tools/utils/route-menu.generator";
import { Container } from "@/components/ui/Container";
import { logger } from "@/shared/lib/logging";
import { routes } from "@/shared/lib/navigation";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import { getCurrentLocaleFromPathname } from "@/shared/lib/utils/i18n/i18n.utils";

interface DevHomepageHeaderProps {
  dictionary: NonNullable<Dictionary["devHomepageHeader"]>;
  devRouteMenuDictionary: NonNullable<Dictionary["devRouteMenu"]>;
}

export function DevHomepageHeader({
  dictionary,
  devRouteMenuDictionary,
}: DevHomepageHeaderProps): React.ReactElement | null {
  logger.info(
    "[DevHomepageHeader] Renderizando v10.0 (Data-Driven Contract Restoration)."
  );
  const pathname = usePathname();
  const currentLocale = getCurrentLocaleFromPathname(pathname);

  if (!dictionary || !devRouteMenuDictionary) {
    logger.warn(
      "[DevHomepageHeader] No se proporcionó contenido completo. El header no se renderizará."
    );
    return null;
  }

  // Se generan las rutas dinámicamente a partir del diccionario.
  const routeGroups = generateDevRoutes(devRouteMenuDictionary, currentLocale);
  const buttonLabel = devRouteMenuDictionary.devMenuLabel;

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
            {/* Se pasan las props correctas al componente hijo. */}
            <DevToolsDropdown
              routeGroups={routeGroups}
              buttonLabel={buttonLabel}
            />
          </div>
        </div>
      </Container>
    </header>
  );
}
