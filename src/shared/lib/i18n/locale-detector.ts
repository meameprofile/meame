// RUTA: src/shared/lib/i18n/locale-detector.ts
/**
 * @file locale-detector.ts
 * @version 4.0.0 (Production-Grade Logging)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import { type NextRequest } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { supportedLocales, defaultLocale, type Locale } from "./i18n.config";
import { logger } from "../logging";

export function getLocaleFromBrowser(request: NextRequest): Locale {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages([
    ...supportedLocales,
  ]);

  const locale = matchLocale(
    languages,
    [...supportedLocales],
    defaultLocale
  ) as Locale;

  logger.trace(`[LocaleDetector] Detección de navegador completada.`, {
    preferredLanguages: languages,
    matchedLocale: locale,
  });
  return locale;
}
