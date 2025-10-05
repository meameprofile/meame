// RUTA: src/shared/lib/i18n/i18n.ts
/**
 * @file i18n.ts
 * @description Orquestador de i18n "isomórfico" y consciente del entorno,
 *              ahora con un motor de carga de producción desde Supabase
 *              que es completamente seguro a nivel de tipos.
 * @version 20.0.0 (Type-Safe Supabase Engine)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import { cache } from "react";
import { type ZodError } from "zod";
import { i18nSchema, type Dictionary } from "@/shared/lib/schemas/i18n.schema";
import {
  supportedLocales,
  defaultLocale,
  type Locale,
} from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import { getDevDictionary } from "@/shared/lib/i18n/i18n.dev";
import { createServerClient } from "../supabase/server";
import type { I18nFileContent } from "../dev/i18n-discoverer";
import type { Tables } from "../supabase/database.types";

// --- [INICIO DE REFACTORIZACIÓN DE TIPO SOBERANO] ---
// Se define un tipo explícito para la fila que esperamos de la base de datos.
type I18nEntry = Pick<
  Tables<"i18n_content_entries">,
  "entry_key" | "translations"
>;
// --- [FIN DE REFACTORIZACIÓN DE TIPO SOBERANO] ---

const getProductionDictionaryFn = cache(
  async (
    locale: Locale
  ): Promise<{
    dictionary: Partial<Dictionary>;
    error: ZodError | Error | null;
  }> => {
    const traceId = logger.startTrace(`getProductionDictionary:${locale}`);
    logger.startGroup(
      `[i18n.prod] Ensamblando diccionario desde Supabase para [${locale}]...`
    );

    try {
      const supabase = createServerClient();
      // --- [INICIO DE REFACTORIZACIÓN DE TIPO] ---
      // Se elimina la aserción 'as any'. El cliente de Supabase ya está tipado
      // y la consulta ahora devuelve un tipo seguro.
      const { data, error } = await supabase
        .from("i18n_content_entries")
        .select("entry_key, translations");
      // --- [FIN DE REFACTORIZACIÓN DE TIPO] ---

      if (error) throw error;

      const assembledDictionary = (data as I18nEntry[]).reduce(
        (acc: Partial<Dictionary>, entry: I18nEntry) => {
          const entryContent = (entry.translations as I18nFileContent)?.[
            locale
          ];
          if (entryContent) {
            // Se extrae la clave del diccionario desde el nombre del archivo.
            const key = entry.entry_key
              .split("/")
              .pop()
              ?.replace(".i18n.json", "");

            if (key) {
              // Se asigna el contenido a la clave correspondiente en el acumulador.
              (acc as Record<string, unknown>)[key] = entryContent;
            }
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
      logger.endGroup();
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
  const validatedLocale = supportedLocales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;

  if (process.env.NODE_ENV === "development") {
    return getDevDictionary(validatedLocale);
  }

  return getProductionDictionaryFn(validatedLocale);
};
