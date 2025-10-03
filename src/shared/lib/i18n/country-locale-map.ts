// RUTA: shared/lib/i18n/country-locale-map.ts
/**
 * @file country-locale-map.ts
 * @description SSoT para el mapeo de códigos de país a locales soportados.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import type { Locale } from "./i18n.config";

const countryToLocaleMap: Record<string, Locale> = {
  IT: "it-IT",
  ES: "es-ES",
  US: "en-US",
  GB: "en-US", // Mapeamos Reino Unido a en-US
  BR: "pt-BR",
  PT: "pt-BR", // Mapeamos Portugal a pt-BR
};

/**
 * @function getLocaleFromCountry
 * @description Devuelve un locale soportado basado en un código de país.
 * @param {string | undefined} countryCode - El código de país de 2 letras (ej. 'IT').
 * @returns {Locale | null} El locale correspondiente o null si no hay un mapeo.
 */
export function getLocaleFromCountry(countryCode?: string): Locale | null {
  if (!countryCode) {
    return null;
  }
  return countryToLocaleMap[countryCode.toUpperCase()] || null;
}
