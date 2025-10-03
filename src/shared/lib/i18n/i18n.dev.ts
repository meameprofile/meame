// RUTA: src/shared/lib/i18n/i18n.dev.ts
/**
 * @file i18n.dev.ts
 * @description Motor de i18n para el entorno de desarrollo. Ensambla diccionarios
 *              "en caliente" a partir de múltiples archivos fuente.
 * @version 4.1.0 (Build Stability Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import { type ZodError } from "zod";
import { type Locale } from "@/shared/lib/i18n/i18n.config";
import { i18nSchema, type Dictionary } from "@/shared/lib/schemas/i18n.schema";
import { logger } from "@/shared/lib/logging";
import {
  discoverAndReadI18nFiles,
  type I18nFileContent,
} from "@/shared/lib/dev/i18n-discoverer";

const devDictionariesCache: Partial<
  Record<
    Locale,
    { dictionary: Partial<Dictionary>; error: ZodError | Error | null }
  >
> = {};

export async function getDevDictionary(locale: Locale): Promise<{
  dictionary: Partial<Dictionary>;
  error: ZodError | Error | null;
}> {
  if (devDictionariesCache[locale]) {
    logger.trace(
      `[i18n.dev] Sirviendo diccionario para [${locale}] desde caché de petición.`
    );
    return devDictionariesCache[locale]!;
  }

  logger.startGroup(
    `[i18n.dev] Ensamblando diccionario "en caliente" para [${locale}]...`
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
        { errors: validation.error.flatten().fieldErrors }
      );
      const result = {
        dictionary: assembledDictionary,
        error: validation.error,
      };
      devDictionariesCache[locale] = result;
      logger.endGroup();
      return result;
    }

    logger.success(
      `[i18n.dev] Diccionario para [${locale}] ensamblado y validado con éxito.`
    );
    const result = { dictionary: validation.data, error: null };
    devDictionariesCache[locale] = result;
    logger.endGroup();
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(
      `[i18n.dev] Fallo crítico al ensamblar el diccionario para ${locale}.`,
      { error: errorMessage }
    );
    // --- [INICIO DE CORRECCIÓN DE SINTAXIS] ---
    const result = {
      dictionary: {},
      error: error instanceof Error ? error : new Error(errorMessage),
    };
    // --- [FIN DE CORRECCIÓN DE SINTAXIS] ---
    devDictionariesCache[locale] = result;
    logger.endGroup();
    return result;
  }
}
