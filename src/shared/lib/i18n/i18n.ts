// RUTA: src/shared/lib/i18n/i18n.ts
/**
 * @file i18n.ts
 * @description Orquestador de i18n "isomórfico", con lógica de ensamblaje de producción reparada.
 * @version 23.0.0 (Production Assembly Logic Fix & Strict Contract)
 * @author RaZ Podestá - MetaShark Tech
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
import { logger } from "@/shared/lib/logging";
import { i18nSchema, type Dictionary } from "@/shared/lib/schemas/i18n.schema";

import type { I18nFileContent } from "../dev/i18n-discoverer";
import type { Tables } from "../supabase/database.types";
import { createServerClient } from "../supabase/server";

type I18nEntry = Pick<
  Tables<"i18n_content_entries">,
  "entry_key" | "translations"
>;

const getProductionDictionaryFn = cache(
  async (
    locale: Locale
  ): Promise<{
    dictionary: Partial<Dictionary>;
    error: ZodError | Error | null;
  }> => {
    const traceId = logger.startTrace(
      `getProductionDictionary:${locale}_v23.0`
    );
    const groupId = logger.startGroup(
      `[i18n.prod] Ensamblando diccionario desde Supabase para [${locale}]...`
    );

    try {
      const supabase = createServerClient();
      const { data, error } = await supabase
        .from("i18n_content_entries")
        .select("entry_key, translations");

      if (error) throw error;

      const assembledDictionary = (data as I18nEntry[]).reduce(
        (acc: Partial<Dictionary>, entry: I18nEntry) => {
          const entryContent = (entry.translations as I18nFileContent)?.[
            locale
          ];
          if (entryContent) {
            // --- [INICIO DE REFACTORIZACIÓN DE LÓGICA DE ENSAMBLAJE] ---
            // En lugar de crear una clave basada en el nombre del archivo,
            // fusionamos directamente el objeto de contenido, que ya contiene
            // la clave de nivel superior correcta (ej. { socialProofLogos: {...} }).
            logger.traceEvent(
              traceId,
              `Fusionando contenido para clave(s): ${Object.keys(entryContent).join(", ")}`
            );
            Object.assign(acc, entryContent);
            // --- [FIN DE REFACTORIZACIÓN DE LÓGICA DE ENSAMBLAJE] ---
          }
          return acc;
        },
        {} as Partial<Dictionary>
      );

      const validation = i18nSchema.safeParse(assembledDictionary);
      if (!validation.success) {
        throw validation.error;
      }

      logger.success(
        `[i18n.prod] Diccionario para [${locale}] ensamblado y validado desde Supabase.`
      );
      return { dictionary: validation.data, error: null };
    } catch (error) {
      const typedError =
        error instanceof Error ? error : new Error(String(error));
      logger.error(
        `[i18n.prod] Fallo crítico al ensamblar diccionario para ${locale} desde Supabase.`,
        { error: typedError.message }
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
