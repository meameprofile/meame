// RUTA: src/shared/lib/i18n/i18n.config.ts
/**
 * @file i18n.config.ts
 * @description Motor de Configuración Soberano para i18n. Distingue entre
 *              locales de enrutamiento (implementados) y locales de UI (soportados).
 * @version 14.0.0 (Routing & UI Locale Distinction)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import { logger } from "../logging";
import { IMPLEMENTED_LOCALES } from "./implemented-locales.manifest";

// SSoT para enrutamiento y generación de contenido.
export const ROUTING_LOCALES = IMPLEMENTED_LOCALES;
export type Locale = (typeof ROUTING_LOCALES)[number];

const LocaleEnum = z.enum(ROUTING_LOCALES);

function getValidatedDefaultLocale(): Locale {
  const traceId = logger.startTrace("i18n.getValidatedDefaultLocale");
  const envLocale = process.env.NEXT_PUBLIC_SITE_LOCALE;

  if (envLocale) {
    const validation = LocaleEnum.safeParse(envLocale);
    if (validation.success) {
      logger.success(
        `[i18n Config] Locale por defecto validado desde ENV: ${validation.data}`,
        { traceId }
      );
      logger.endTrace(traceId);
      return validation.data;
    } else {
      logger.warn(
        `[i18n Config] El locale en ENV ('${envLocale}') no es un locale implementado. Usando fallback.`,
        { traceId }
      );
    }
  }

  logger.endTrace(traceId);
  return "es-ES"; // Fallback definitivo y seguro
}

export const defaultLocale: Locale = getValidatedDefaultLocale();
