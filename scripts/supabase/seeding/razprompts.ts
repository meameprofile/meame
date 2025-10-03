// RUTA: scripts/seeding/seed-razprompts.ts
/**
 * @file seed-razprompts.ts
 * @description Script de siembra soberano para RaZPrompts, ahora arquitectónicamente puro.
 * @version 6.0.0 (Architectural Purity)
 * @author L.I.A. Legacy
 */
import { promises as fs } from "fs";
import path from "path";
import chalk from "chalk";
import { createScriptClient } from "../supabase/script-client";

// --- Tipos y Logger locales para aislamiento total ---
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
const log = (msg: string) =>
  console.log(chalk.cyan(`[RaZPrompts Seeder] ${msg}`));
const errorLog = (msg: string, details?: unknown) =>
  console.error(chalk.red.bold(`[RaZPrompts Seeder] ${msg}`), details || "");
const successLog = (msg: string) =>
  console.log(chalk.green(`[RaZPrompts Seeder] ${msg}`));

const PROMPTS_DIR = path.resolve(process.cwd(), "content/raz-prompts");

async function seedRaZPrompts(): Promise<
  ActionResult<{ seededCount: number }>
> {
  log("Iniciando siembra de la Bóveda RaZPrompts (v6.0 - Puro)...");
  const supabase = createScriptClient();
  let seededCount = 0;

  try {
    const files = await fs.readdir(PROMPTS_DIR);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    if (jsonFiles.length === 0) {
      log("No se encontraron archivos .json en el directorio de prompts.");
      return { success: true, data: { seededCount: 0 } };
    }
    log(`Se encontraron ${jsonFiles.length} archivos de prompt para procesar.`);

    for (const fileName of jsonFiles) {
      const filePath = path.join(PROMPTS_DIR, fileName);
      try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        const promptData = JSON.parse(fileContent);

        // Se omite la validación de Zod para mantener el script aislado de 'src'.
        // Confiamos en la integridad de los fixtures.

        const { error } = await supabase.from("razprompts_entries").upsert(
          {
            id: promptData.promptId,
            user_id: promptData.userId,
            workspace_id: promptData.workspaceId,
            title: promptData.title,
            status: promptData.status,
            ai_service: promptData.aiService,
            keywords: promptData.keywords,
            versions: promptData.versions,
            tags: promptData.tags,
            bavi_asset_ids: promptData.baviAssetIds,
            created_at: promptData.createdAt,
            updated_at: promptData.updatedAt,
          },
          { onConflict: "id" }
        );

        if (error)
          throw new Error(
            `Error de Supabase para ${fileName}: ${error.message}`
          );

        successLog(
          `Genoma de prompt '${promptData.promptId}' inyectado/actualizado.`
        );
        seededCount++;
      } catch (fileError) {
        errorLog(`Fallo al procesar el archivo ${fileName}.`, fileError);
      }
    }

    return { success: true, data: { seededCount } };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    errorLog("Fallo crítico durante la siembra de RaZPrompts.", {
      error: errorMessage,
    });
    return { success: false, error: errorMessage };
  }
}

export default seedRaZPrompts;
