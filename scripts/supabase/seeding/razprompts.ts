// RUTA: src/shared/lib/actions/supabase/seeding/razprompts.ts
/**
 * @file razprompts.ts
 * @description Script de siembra soberano para RaZPrompts, con observabilidad de élite.
 * @version 9.1.0 (Elite Observability & Type Safety)
 * @author RaZ Podestá - MetaShark Tech
 */
import { promises as fs } from "fs";
import path from "path";
import { createScriptClient } from "../../_utils/supabaseClient";
import { scriptLogger as logger } from "../../_utils/logger";
import type { ScriptActionResult as ActionResult } from "../../_utils/types";
import type { RazPromptsEntryInsert } from "../../../src/shared/lib/schemas/raz-prompts/raz-prompts.contracts";
import type { Json } from "../../../src/shared/lib/supabase/database.types";

const PROMPTS_DIR = path.resolve(process.cwd(), "content/raz-prompts");

export default async function seedRaZPrompts(): Promise<
  ActionResult<{ seededCount: number }>
> {
  const traceId = logger.startTrace("seedRaZPrompts_v9.1");
  const groupId = logger.startGroup(
    `[RaZPrompts Seeder] Iniciando siembra de la Bóveda...`
  );

  try {
    const supabase = createScriptClient();
    let seededCount = 0;

    const files = await fs.readdir(PROMPTS_DIR);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    if (jsonFiles.length === 0) {
      logger.info(
        "[RaZPrompts Seeder] No se encontraron archivos .json en el directorio de prompts."
      );
      return { success: true, data: { seededCount: 0 } };
    }
    logger.info(
      `[RaZPrompts Seeder] Se encontraron ${jsonFiles.length} archivos de prompt para procesar.`
    );

    for (const fileName of jsonFiles) {
      const filePath = path.join(PROMPTS_DIR, fileName);
      try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        const promptData = JSON.parse(fileContent);

        const payload: RazPromptsEntryInsert = {
          id: promptData.promptId,
          user_id: promptData.userId,
          workspace_id: promptData.workspaceId,
          title: promptData.title,
          status: promptData.status,
          ai_service: promptData.aiService,
          keywords: promptData.keywords,
          versions: promptData.versions as Json,
          tags: promptData.tags as Json,
          bavi_asset_ids: promptData.baviAssetIds,
          created_at: promptData.createdAt,
          updated_at: promptData.updatedAt,
        };

        const { error } = await supabase
          .from("razprompts_entries")
          .upsert(payload, { onConflict: "id" });
        if (error)
          throw new Error(
            `Error de Supabase para ${fileName}: ${error.message}`
          );

        logger.success(
          `[RaZPrompts Seeder] Genoma de prompt '${promptData.promptId}' inyectado/actualizado.`
        );
        seededCount++;
      } catch (fileError) {
        logger.error(
          `[RaZPrompts Seeder] Fallo al procesar el archivo ${fileName}.`,
          { error: fileError }
        );
      }
    }

    return { success: true, data: { seededCount } };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[RaZPrompts Seeder] Fallo crítico durante la siembra.", {
      error: errorMessage,
    });
    return { success: false, error: errorMessage };
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
