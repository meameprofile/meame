// RUTA: src/shared/lib/i18n/i18n.dev.ts
/**
 * @file i18n.dev.ts
 * @description Motor de i18n para desarrollo, ahora con una caché de módulo
 *              persistente para una experiencia de desarrollo de élite (DX).
 * @version 5.0.0 (Elite DX with Persistent Module Cache)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import { type ZodError } from "zod";

import {
  discoverAndReadI18nFiles,
  type I18nFileContent,
} from "@/shared/lib/dev/i18n-discoverer";
import { type Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import { i18nSchema, type Dictionary } from "@/shared/lib/schemas/i18n.schema";

// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA v5.0.0] ---
// Se establece una caché a nivel de módulo. Esta persistirá mientras el proceso
// del servidor de desarrollo de Next.js esté en ejecución, sobreviviendo a
// las peticiones individuales. Solo se purgará si este mismo archivo es modificado.
const moduleLevelCache: Partial<
  Record<
    Locale,
    { dictionary: Partial<Dictionary>; error: ZodError | Error | null }
  >
> = {};
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA v5.0.0] ---

export async function getDevDictionary(locale: Locale): Promise<{
  dictionary: Partial<Dictionary>;
  error: ZodError | Error | null;
}> {
  const traceId = logger.startTrace(`getDevDictionary:${locale}_v5.0`);

  // Se comprueba primero la caché del módulo.
  if (moduleLevelCache[locale]) {
    logger.success(
      `[i18n.dev] Sirviendo diccionario para [${locale}] desde caché de MÓDULO.`,
      { traceId }
    );
    logger.endTrace(traceId);
    return moduleLevelCache[locale]!;
  }

  const groupId = logger.startGroup(
    `[i18n.dev] CACHE MISS: Ensamblando diccionario "en caliente" para [${locale}]...`
  );

  try {
    const allI18nContents = await discoverAndReadI18nFiles();

    const assembledDictionary = allI18nContents.contents.reduce(
      (acc: Partial<Dictionary>, moduleContent: I18nFileContent) => {
        const contentForLocale = moduleContent[locale];
        return { ...acc, ...((contentForLocale as Partial<Dictionary>) || {}) };
      },
      {} as Partial<Dictionary>
    );

    const validation = i18nSchema.safeParse(assembledDictionary);

    if (!validation.success) {
      logger.error(
        `[i18n.dev] ¡FALLO DE VALIDACIÓN! Diccionario para [${locale}] está corrupto.`,
        { errors: validation.error.flatten().fieldErrors, traceId }
      );
      const result = {
        dictionary: assembledDictionary,
        error: validation.error,
      };
      // No se cachea un resultado fallido para permitir reintentos.
      return result;
    }

    logger.success(
      `[i18n.dev] Diccionario para [${locale}] ensamblado y validado. Poblando caché de módulo.`,
      { traceId }
    );
    const result = { dictionary: validation.data, error: null };
    // Se puebla la caché del módulo para futuras peticiones.
    moduleLevelCache[locale] = result;
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(
      `[i18n.dev] Fallo crítico al ensamblar el diccionario para ${locale}.`,
      { error: errorMessage, traceId }
    );
    return {
      dictionary: {},
      error: error instanceof Error ? error : new Error(errorMessage),
    };
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
