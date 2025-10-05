// RUTA: src/shared/lib/i18n/i18n.config.ts
/**
 * @file i18n.config.ts
 * @description Motor de Configuración Soberano para i18n. Consume el manifiesto
 *              global y deriva las constantes de configuración de la aplicación.
 *              Es resiliente al entorno (isomórfico).
 * @version 13.0.0 (Zod Enum Contract Compliance)
 * @author L.I.A. Legacy
 */
import { z } from "zod";
import { logger } from "../logging";
import { LANGUAGE_MANIFEST } from "./global.i18n.manifest"; // <-- IMPORTA LA SSoT DE DATOS

logger.info(
  "[i18n Config Engine] Cargando Motor de Configuración i18n v13.0..."
);

// --- [INICIO DE REFACTORIZACIÓN DE TIPO SOBERANO v13.0.0] ---
// Se extraen los códigos de locale en un formato que Zod.enum puede consumir.
// Esto crea una tupla `readonly [string, ...string[]]`, que es el contrato exacto
// que Zod espera, resolviendo el error de compilación TS2769 en todos los schemas consumidores.
const localeCodes = LANGUAGE_MANIFEST.map((lang) => lang.code);
export const supportedLocales = [
  localeCodes[0],
  ...localeCodes.slice(1),
] as const;
// --- [FIN DE REFACTORIZACIÓN DE TIPO SOBERANO v13.0.0] ---

export type Locale = (typeof supportedLocales)[number];

const LocaleEnum = z.enum(supportedLocales);

function getValidatedDefaultLocale(): Locale {
  const traceId = logger.startTrace("i18n.getValidatedDefaultLocale");
  const envLocale =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_SITE_LOCALE
      : undefined;

  if (envLocale) {
    const validation = LocaleEnum.safeParse(envLocale);
    if (validation.success) {
      logger.success(
        `[i18n Config] Locale por defecto validado desde ENV: ${validation.data}`,
        { traceId }
      );
      logger.endTrace(traceId);
      return validation.data as Locale;
    } else {
      logger.warn(
        `[i18n Config] El locale en ENV ('${envLocale}') es inválido. Usando fallback.`,
        { traceId }
      );
    }
  } else {
    logger.traceEvent(
      traceId,
      "NEXT_PUBLIC_SITE_LOCALE no está definido. Usando fallback."
    );
  }

  logger.endTrace(traceId);
  return "es-ES";
}

export const defaultLocale: Locale = getValidatedDefaultLocale();
