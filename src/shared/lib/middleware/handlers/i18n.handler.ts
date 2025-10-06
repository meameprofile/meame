// RUTA: src/shared/lib/middleware/handlers/i18n.handler.ts
/**
 * @file i18n.handler.ts
 * @description Manejador de middleware i18n, ahora con consumo de la SSoT de rutas.
 * @version 12.1.0 (SSoT Route Consumption)
 * @author L.I.A. Legacy
 */
import "server-only";
import { NextResponse } from "next/server";
import {
  ROUTING_LOCALES,
  defaultLocale,
  type Locale,
} from "../../i18n/i18n.config";
import { LANGUAGE_MANIFEST } from "../../i18n/global.i18n.manifest";
import { getLocaleFromCountry } from "../../i18n/country-locale-map";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { type MiddlewareHandler } from "../engine";
import { routes } from "../../navigation"; // La importación ahora tiene un propósito.
import { logger } from "../../logging";

const PUBLIC_FILE = /\.(.*)$/;
const LOCALE_FREE_PATHS = ["/select-language", "/api", "/auth"];

const allPossibleLocales = LANGUAGE_MANIFEST.map((lang) => lang.code);

export const i18nHandler: MiddlewareHandler = (req, res) => {
  const traceId = logger.startTrace("i18nHandler_v12.1");
  const { pathname } = req.nextUrl;
  logger.startGroup(`[i18nHandler] Procesando ruta: ${pathname}`);

  try {
    if (
      PUBLIC_FILE.test(pathname) ||
      LOCALE_FREE_PATHS.some((p) => pathname.startsWith(p))
    ) {
      return res;
    }

    const pathnameHasImplementedLocale = ROUTING_LOCALES.some(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );
    if (pathnameHasImplementedLocale) {
      return res;
    }

    let targetLocale: Locale | null = null;
    let detectionSource: string = "unknown";

    const preferredLocale = req.cookies.get("NEXT_LOCALE")?.value as
      | Locale
      | undefined;
    if (preferredLocale && ROUTING_LOCALES.includes(preferredLocale)) {
      targetLocale = preferredLocale;
      detectionSource = "Cookie 'NEXT_LOCALE'";
    }

    if (!targetLocale) {
      const countryCode = req.headers.get("x-visitor-geo");
      const localeFromCountry = getLocaleFromCountry(countryCode || undefined);
      if (localeFromCountry && ROUTING_LOCALES.includes(localeFromCountry)) {
        targetLocale = localeFromCountry;
        detectionSource = `GeoIP (${countryCode})`;
      }
    }

    if (!targetLocale) {
      const negotiatorHeaders: Record<string, string> = {};
      req.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
      const languages = new Negotiator({
        headers: negotiatorHeaders,
      }).languages(allPossibleLocales);

      const matchedLocale = matchLocale(
        languages,
        [...ROUTING_LOCALES],
        defaultLocale
      ) as Locale;
      targetLocale = matchedLocale;
      detectionSource = "Cabeceras 'Accept-Language'";
    }

    if (!targetLocale || !ROUTING_LOCALES.includes(targetLocale)) {
      targetLocale = defaultLocale;
      detectionSource += " -> Fallback a Default";
    }

    logger.traceEvent(traceId, `Locale final determinado: ${targetLocale}`, {
      source: detectionSource,
    });

    const newUrl = new URL(`/${targetLocale}${pathname}`, req.url);
    logger.info(`[i18nHandler] Decisión: Redirigir.`, {
      redirectTo: newUrl.href,
      traceId,
    });
    return NextResponse.redirect(newUrl);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";

    // --- [INICIO DE REFACTORIZACIÓN DE SSoT Y RESILIENCIA v12.1.0] ---
    // En caso de un error inesperado, redirigimos a la página de selección de idioma
    // utilizando el manifiesto de rutas, en lugar de simplemente no hacer nada.
    logger.error(
      "[i18nHandler] Fallo crítico no controlado. Redirigiendo a selector de idioma.",
      { error: errorMessage, pathname, traceId }
    );
    const selectLangUrl = new URL(routes.selectLanguage.path(), req.url);
    selectLangUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(selectLangUrl);
    // --- [FIN DE REFACTORIZACIÓN DE SSoT Y RESILIENCIA v12.1.0] ---
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
};
