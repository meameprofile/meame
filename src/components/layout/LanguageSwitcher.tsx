// APARATO REVISADO Y NIVELADO POR L.I.A. LEGACY - VERSIÓN 6.2.0
// ADVERTENCIA: No modificar sin consultar para evaluar el impacto holístico.

// RUTA: src/components/layout/LanguageSwitcher.tsx
/**
 * @file LanguageSwitcher.tsx
 * @description Componente de UI de élite para cambiar el idioma, con persistencia
 *              de la preferencia del usuario a través de cookies. Esta versión
 *              restaura la integridad de dependencias y la higiene de código.
 * @version 6.2.0 (Dependency Integrity & Elite Compliance)
 * @author L.I.A. Legacy
 */
"use client";

import React, { useCallback, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";
import { FlagIcon } from "@/components/ui/FlagIcon";
import { type Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import { cn } from "@/shared/lib/utils/cn";

interface LanguageSwitcherProps {
  currentLocale: Locale;
  supportedLocales: readonly string[];
  content: NonNullable<Dictionary["languageSwitcher"]>;
}

export function LanguageSwitcher({
  currentLocale,
  supportedLocales,
  content,
}: LanguageSwitcherProps): React.ReactElement {
  const traceId = useMemo(() => logger.startTrace("LanguageSwitcher_v6.2"), []);
  logger.info("[LanguageSwitcher] Renderizando v6.2 (Restored).", {
    traceId,
  });
  const router = useRouter();
  const pathname = usePathname();

  /**
   * @function handleLanguageChange
   * @description Orquesta el cambio de idioma. Persiste la preferencia en una
   *              cookie y luego redirige al usuario a la nueva ruta localizada.
   * @param {string} newLocale - El nuevo locale seleccionado por el usuario.
   */
  const handleLanguageChange = useCallback(
    (newLocale: string) => {
      const actionTraceId = logger.startTrace("handleLanguageChange");
      logger.startGroup(
        `[LanguageSwitcher] Cambiando idioma a ${newLocale}...`
      );

      // 1. Persistir la preferencia explícita del usuario en el disco duro del navegador.
      Cookies.set("NEXT_LOCALE", newLocale, { expires: 365, path: "/" });
      logger.traceEvent(
        actionTraceId,
        `Cookie 'NEXT_LOCALE' establecida con valor: ${newLocale}`
      );

      // 2. Calcular la nueva ruta
      const segments = pathname.split("/");
      const localeIndex = segments.findIndex((segment) =>
        supportedLocales.includes(segment as Locale)
      );

      if (localeIndex !== -1) {
        segments[localeIndex] = newLocale;
      } else {
        segments.splice(1, 0, newLocale);
      }

      const newPathname = segments.join("/") || "/";
      const finalPath = newPathname.startsWith(`/${newLocale}/${newLocale}`)
        ? newPathname.substring(`/${newLocale}`.length)
        : newPathname;

      logger.traceEvent(
        actionTraceId,
        `Redirigiendo a la nueva ruta: ${finalPath}`
      );
      router.push(finalPath);

      logger.endGroup();
      logger.endTrace(actionTraceId);
    },
    [pathname, router, supportedLocales]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={content.ariaLabel}
          className="relative group"
        >
          <FlagIcon
            locale={currentLocale}
            className="w-5 h-5 rounded-sm transition-transform duration-300 group-hover:scale-110"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {supportedLocales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLanguageChange(locale)}
            className={cn(
              "flex items-center gap-3 cursor-pointer",
              currentLocale === locale && "bg-muted font-semibold"
            )}
          >
            <FlagIcon
              locale={locale as Locale}
              className="w-5 h-5 rounded-sm"
            />
            <span>
              {content.languages[locale as keyof typeof content.languages]}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
