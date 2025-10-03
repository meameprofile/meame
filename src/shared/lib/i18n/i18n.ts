// RUTA: src/shared/lib/i18n/i18n.ts
/**
 * @file i18n.ts
 * @description Orquestador de i18n "isomórfico" y consciente del entorno.
 * @version 18.0.0 (Isomorphic & Build-Resilient)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import * as React from "react";
import * as fs from "fs/promises";
import * as path from "path";
import { type ZodError } from "zod";
import { i18nSchema, type Dictionary } from "@/shared/lib/schemas/i18n.schema";
import {
  supportedLocales,
  defaultLocale,
  type Locale,
} from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import { getDevDictionary } from "@/shared/lib/i18n/i18n.dev";

logger.trace("[i18n.ts] Módulo orquestador i18n v18.0 cargado.");

const prodDictionariesCache: Partial<
  Record<
    Locale,
    { dictionary: Partial<Dictionary>; error: ZodError | Error | null }
  >
> = {};

// --- [INICIO DE REFACTORIZACIÓN DE ÉLITE: LÓGICA PURA AISLADA] ---
const getProductionDictionaryFn = async (
  locale: Locale
): Promise<{
  dictionary: Partial<Dictionary>;
  error: ZodError | Error | null;
}> => {
  if (prodDictionariesCache[locale]) {
    return prodDictionariesCache[locale]!;
  }
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "locales",
      `${locale}.json`
    );
    const fileContent = await fs.readFile(filePath, "utf-8");
    const dictionary = JSON.parse(fileContent);

    const validation = i18nSchema.safeParse(dictionary);
    if (!validation.success) {
      throw new Error(`Diccionario i18n para '${locale}' corrupto o inválido.`);
    }
    const result = { dictionary: validation.data, error: null };
    prodDictionariesCache[locale] = result;
    return result;
  } catch (error) {
    logger.error(
      `[i18n.prod] No se pudo cargar el diccionario para ${locale}.`,
      { error }
    );
    throw error;
  }
};
// --- [FIN DE REFACTORIZACIÓN DE ÉLITE] ---

const getCachedProductionDictionary =
  typeof React.cache === "function"
    ? React.cache(getProductionDictionaryFn)
    : getProductionDictionaryFn;

export const getDictionary = async (
  locale: string
): Promise<{
  dictionary: Partial<Dictionary>;
  error: ZodError | Error | null;
}> => {
  const validatedLocale = supportedLocales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;

  if (process.env.NODE_ENV === "development") {
    return getDevDictionary(validatedLocale);
  }

  try {
    return await getCachedProductionDictionary(validatedLocale);
  } catch (error) {
    return {
      dictionary: {},
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
};
