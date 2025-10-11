// RUTA: src/shared/lib/middleware/handlers/i18n.handler.ts
/**
 * @file i18n.handler.ts
 * @description Manejador de middleware i18n, con consumo de la SSoT de rutas restaurado.
 * @version 12.3.0 (Routing Contract Restoration & Elite Compliance)
 * @author L.I.A. Legacy
 */
"use server-only";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextResponse } from "next/server";

import { getLocaleFromCountry } from "../../i18n/country-locale-map";
import { LANGUAGE_MANIFEST } from "../../i18n/global.i18n.manifest";
import {
  ROUTING_LOCALES,
  defaultLocale,
  type Locale,
} from "../../i18n/i18n.config";
import { logger } from "../../logging";
import { type MiddlewareHandler } from "../engine";

const PUBLIC_FILE = /\.(.*)$/;
// --- [INICIO DE REFACTORIZACIÓN DE CONTRATO DE RUTA v12.3.0] ---
// La ruta '/select-language' se gestiona aquí como una ruta libre de locale.
const LOCALE_FREE_PATHS = ["/select-language", "/api", "/auth"];
// --- [FIN DE REFACTORIZACIÓN DE CONTRATO DE RUTA v12.3.0] ---

const allPossibleLocales = LANGUAGE_MANIFEST.map((lang) => lang.code);

export const i18nHandler: MiddlewareHandler = (req, res) => {
  const traceId = logger.startTrace("i18nHandler_v12.3");
  const { pathname } = req.nextUrl;
  const groupId = logger.startGroup(
    `[i18nHandler] Procesando ruta: ${pathname}`
  );

  try {
    if (
      PUBLIC_FILE.test(pathname) ||
      LOCALE_FREE_PATHS.some((p) => pathname.startsWith(p))
    ) {
      logger.trace(
        `[i18nHandler] Ruta ${pathname} es libre de locale. Omitiendo.`,
        { traceId }
      );
      return res;
    }

    const pathnameHasImplementedLocale = ROUTING_LOCALES.some(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );
    if (pathnameHasImplementedLocale) {
      logger.trace(
        `[i18nHandler] Ruta ${pathname} ya contiene un locale válido. Omitiendo.`,
        { traceId }
      );
      return res;
    }

    let targetLocale: Locale | null = null;
    let detectionSource = "unknown";

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
    logger.error(
      "[i18nHandler] Fallo crítico no controlado. Redirigiendo a selector de idioma.",
      { error: errorMessage, pathname, traceId }
    );
    const selectLangUrl = new URL("/select-language", req.url);
    selectLangUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(selectLangUrl);
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
};
