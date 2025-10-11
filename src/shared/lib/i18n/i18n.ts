// RUTA: src/shared/lib/i18n/i18n.ts
/**
 * @file i18n.ts
 * @description Orquestador de i18n "isomórfico", ahora 100% basado en archivos.
 *              v24.0.0 (File-Based SSoT): Elimina la dependencia de Supabase en producción,
 *              cargando los diccionarios pre-compilados desde el directorio /public.
 * @version 24.0.0
 * @author L.I.A. Legacy
 */
import "server-only";
import { cache } from "react";
import { type ZodError } from "zod";

import {
  ROUTING_LOCALES,
  defaultLocale,
  type Locale,
} from "@/shared/lib/i18n/i18n.config";
import { getDevDictionary } from "@/shared/lib/i18n/i18n.dev";
import { getEdgeDictionary } from "@/shared/lib/i18n/i18n.edge";
import { logger } from "@/shared/lib/logging";
import { i18nSchema, type Dictionary } from "@/shared/lib/schemas/i18n.schema";

const getProductionDictionaryFn = cache(
  async (
    locale: Locale
  ): Promise<{
    dictionary: Partial<Dictionary>;
    error: ZodError | Error | null;
  }> => {
    const traceId = logger.startTrace(
      `getProductionDictionary:${locale}_v24.0`
    );
    const groupId = logger.startGroup(
      `[i18n.prod] Ensamblando diccionario desde /public para [${locale}]...`
    );

    try {
      const { dictionary } = await getEdgeDictionary(locale);

      const validation = i18nSchema.safeParse(dictionary);
      if (!validation.success) {
        throw validation.error;
      }

      logger.success(
        `[i18n.prod] Diccionario para [${locale}] ensamblado y validado desde /public/locales.`, { traceId }
      );
      return { dictionary: validation.data, error: null };
    } catch (error) {
      const typedError =
        error instanceof Error ? error : new Error(String(error));
      logger.error(
        `[i18n.prod] Fallo crítico al ensamblar diccionario para ${locale} desde /public.`,
        { error: typedError.message, traceId }
      );
      return { dictionary: {}, error: typedError };
    } finally {
      logger.endGroup(groupId);
      logger.endTrace(traceId);
    }
  }
);

export const getDictionary = async (
  locale: string
): Promise<{
  dictionary: Partial<Dictionary>;
  error: ZodError | Error | null;
}> => {
  const validatedLocale = ROUTING_LOCALES.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;

  if (process.env.NODE_ENV === "development") {
    return getDevDictionary(validatedLocale);
  }

  return getProductionDictionaryFn(validatedLocale);
};
