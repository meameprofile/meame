/**
 * @file i18n.ts
 * @description Inyector Soberano para el contenido de i18n.
 * @version 2.1.0 (Elite Observability & Contract Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import { createScriptClient } from "../../_utils/supabaseClient";
import { scriptLogger as logger } from "../../_utils/logger";
import {
  discoverAndReadI18nFiles,
  type I18nFileContent,
} from "../../generation/i18n-discoverer";
import path from "path";
import type { ScriptActionResult as ActionResult } from "../../_utils/types";
import type { TablesInsert, Json } from "@/shared/lib/supabase/database.types";

export default async function seedI18nContent(): Promise<
  ActionResult<{ syncedEntries: number }>
> {
  const traceId = logger.startTrace("seedI18nContent_v2.1");
  const groupId = logger.startGroup(
    `[i18n Inyector] Sincronizando contenido con Supabase...`
  );

  try {
    const supabase = createScriptClient();
    const { files, contents } = await discoverAndReadI18nFiles();

    if (files.length === 0) {
      logger.warn("[i18n Inyector] No se encontraron archivos de contenido.");
      return { success: true, data: { syncedEntries: 0 } };
    }

    const upserts: TablesInsert<"i18n_content_entries">[] = files.map(
      (filePath, index) => {
        const entry_key = path
          .relative(path.join(process.cwd(), "src", "messages"), filePath)
          .replace(/\\/g, "/");
        return {
          entry_key,
          translations: contents[index] as I18nFileContent as Json,
        };
      }
    );

    const { error, count } = await supabase
      .from("i18n_content_entries")
      .upsert(upserts, { onConflict: "entry_key" });

    if (error) throw new Error(`Error de Supabase: ${error.message}`);

    logger.success(
      `Sincronización completada. ${count ?? 0} entradas afectadas.`
    );
    return { success: true, data: { syncedEntries: count ?? 0 } };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error desconocido.";
    logger.error("Fallo crítico durante la sincronización.", {
      error: msg,
      traceId,
    });
    return { success: false, error: msg };
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
