// RUTA: src/shared/lib/utils/i18n/i18n.utils.ts
/**
 * @file i18n.utils.ts
 * @description Aparato de utilidades puras y sin estado para la lógica de i18n,
 *              ahora alineado con la SSoT de enrutamiento.
 * @version 3.0.0 (Routing Contract Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
import {
  ROUTING_LOCALES,
  defaultLocale,
  type Locale,
} from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";

logger.trace(
  "[i18n.utils.ts] Módulo de utilidades i18n cargado y listo para usar (v3.0)."
);

export function pathnameHasLocale(pathname: string): boolean {
  return ROUTING_LOCALES.some(
    (locale: Locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
}

export function getCurrentLocaleFromPathname(pathname: string): Locale {
  if (!pathname || pathname === "/") {
    return defaultLocale;
  }

  const segments = pathname.split("/").filter(Boolean);
  const potentialLocale = segments[0] as Locale;

  if (ROUTING_LOCALES.includes(potentialLocale)) {
    return potentialLocale;
  }

  logger.warn(
    `[i18n.utils] No se pudo determinar un locale válido desde "${pathname}". Usando fallback: ${defaultLocale}`
  );
  return defaultLocale;
}
