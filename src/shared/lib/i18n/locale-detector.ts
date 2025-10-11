// RUTA: src/shared/lib/i18n/locale-detector.ts
/**
 * @file locale-detector.ts
 * @description Detector de locale del navegador, alineado con la SSoT de enrutamiento.
 * @version 5.0.0 (Contract Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { type NextRequest } from "next/server";

import { logger } from "../logging";

import { LANGUAGE_MANIFEST } from "./global.i18n.manifest";
import {
  ROUTING_LOCALES as supportedLocales,
  defaultLocale,
  type Locale,
} from "./i18n.config";

const allPossibleLocales = LANGUAGE_MANIFEST.map((lang) => lang.code);

export function getLocaleFromBrowser(request: NextRequest): Locale {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    allPossibleLocales
  );

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
