// APARATO REVISADO Y NIVELADO POR L.I.A. LEGACY - VERSIÓN 11.2.0
// ADVERTENCIA: No modificar sin consultar para evaluar el impacto holístico.

// RUTA: src/shared/lib/middleware/handlers/i18n.handler.ts
/**
 * @file i18n.handler.ts
 * @description Manejador de middleware i18n, consciente de rutas públicas
 *              y forjado con observabilidad y resiliencia de élite para prevenir
 *              bucles de redirección.
 * @version 11.2.0 (Elite Code Hygiene)
 * @author L.I.A. Legacy
 */
import "server-only";
import { NextResponse } from "next/server";
import { supportedLocales, type Locale } from "../../i18n/i18n.config";
import { getLocaleFromCountry } from "../../i18n/country-locale-map";
import { getLocaleFromBrowser } from "../../i18n/locale-detector";
import { type MiddlewareHandler } from "../engine";
import { routes } from "../../navigation";
import { logger } from "../../logging";

const PUBLIC_FILE = /\.(.*)$/;
const LOCALE_FREE_PATHS = ["/select-language", "/api", "/auth"];

/**
 * @function i18nHandler
 * @description Orquesta la lógica de enrutamiento internacional.
 * @param {NextRequest} req - La petición entrante.
 * @param {NextResponse} res - La respuesta en construcción.
 * @returns {NextResponse} La respuesta, posiblemente modificada con una redirección.
 */
export const i18nHandler: MiddlewareHandler = (req, res) => {
  const traceId = logger.startTrace("i18nHandler_v11.2");
  const { pathname } = req.nextUrl;
  logger.startGroup(`[i18nHandler] Procesando ruta: ${pathname}`);

  try {
    // --- GUARDIÁN 1: Rutas Públicas Exentas ---
    if (
      PUBLIC_FILE.test(pathname) ||
      LOCALE_FREE_PATHS.some((p) => pathname.startsWith(p))
    ) {
      logger.traceEvent(
        traceId,
        "Decisión: Omitir. Razón: Ruta pública exenta de localización."
      );
      return res;
    }

    // --- GUARDIÁN 2: Rutas Ya Localizadas ---
    const pathnameHasLocale = supportedLocales.some(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );
    if (pathnameHasLocale) {
      logger.traceEvent(
        traceId,
        "Decisión: Omitir. Razón: La ruta ya está localizada."
      );
      return res;
    }

    // --- ESTRATEGIA DE DETECCIÓN JERÁRQUICA ---
    let targetLocale: Locale | null = null;
    let detectionSource: string = "unknown";

    // 1. (PRIORIDAD MÁXIMA) Preferencia Explícita del Usuario
    const preferredLocale = req.cookies.get("NEXT_LOCALE")?.value as
      | Locale
      | undefined;
    if (preferredLocale && supportedLocales.includes(preferredLocale)) {
      targetLocale = preferredLocale;
      detectionSource = "Cookie 'NEXT_LOCALE'";
    }

    // 2. Detección por Geolocalización (GeoIP)
    if (!targetLocale) {
      const countryCode = req.headers.get("x-visitor-country");
      const localeFromCountry = getLocaleFromCountry(countryCode || undefined);
      if (localeFromCountry) {
        targetLocale = localeFromCountry;
        detectionSource = `GeoIP (${countryCode})`;
      }
    }

    // 3. (FALLBACK) Detección por Cabeceras del Navegador
    if (!targetLocale) {
      targetLocale = getLocaleFromBrowser(req);
      detectionSource = "Cabeceras 'Accept-Language'";
    }

    logger.traceEvent(traceId, `Locale detectado: ${targetLocale}`, {
      source: detectionSource,
    });

    // --- ACCIÓN DE REDIRECCIÓN ---
    if (targetLocale) {
      const newUrl = new URL(`/${targetLocale}${pathname}`, req.url);
      logger.info(
        `[i18nHandler] Decisión: Redirigir. Razón: Aplicando locale '${targetLocale}'.`,
        { redirectTo: newUrl.href, traceId }
      );
      return NextResponse.redirect(newUrl);
    }

    // --- FALLBACK FINAL: Selector de Idioma ---
    const selectLangUrl = new URL(routes.selectLanguage.path(), req.url);
    selectLangUrl.searchParams.set("returnUrl", pathname);
    logger.warn(
      `[i18nHandler] Decisión: Redirigir a selector. Razón: No se pudo determinar un locale.`,
      { redirectTo: selectLangUrl.href, traceId }
    );
    return NextResponse.redirect(selectLangUrl);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[i18nHandler] Fallo crítico no controlado.", {
      error: errorMessage,
      pathname,
      traceId,
    });
    return res; // En caso de error, no interrumpir la petición.
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
};
