// Ruta correcta: src/shared/lib/i18n/i18n.config.ts
/**
 * @file i18n.config.ts
 * @description SSoT para la configuración estática de internacionalización.
 *              v8.0.0 (Purity Restoration): Se eliminan todas las llamadas
 *              al logger para cumplir con el principio de pureza de los
 *              módulos de configuración y resolver el error crítico de build.
 * @version 8.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const supportedLocales = ["es-ES", "pt-BR", "en-US", "it-IT"] as const;
export type Locale = (typeof supportedLocales)[number];

const LocaleEnum = z.enum(supportedLocales);

function getValidatedDefaultLocale(): Locale {
  const envLocale = process.env.NEXT_PUBLIC_SITE_LOCALE;

  if (envLocale) {
    const validation = LocaleEnum.safeParse(envLocale);
    if (validation.success) {
      // El logging se ha eliminado de aquí.
      return validation.data;
    }
  }
  // El logging se ha eliminado de aquí.
  return "es-ES"; // Fallback definitivo y seguro.
}

export const defaultLocale: Locale = getValidatedDefaultLocale();
// Ruta correcta: src/shared/lib/i18n/i18n.config.ts
