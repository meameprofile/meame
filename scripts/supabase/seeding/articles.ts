// RUTA: scripts/supabase/seeding/articles.ts
/**
 * @file articles.ts
 * @description Script de inyección autónomo y de élite para CogniRead.
 *              Silencioso en el éxito, forense en el fracaso.
 * @version 21.0.0 (Sovereign Injector)
 * @author RaZ Podestá - MetaShark Tech
 */
import * as fs from "fs/promises";
import * as path from "path";

import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";

import type { CogniReadArticleInsert } from "@/shared/lib/schemas/cogniread/cogniread.contracts";
import type { Json } from "@/shared/lib/supabase/database.types";

import { scriptLogger as logger } from "../../_utils/logger";
import { createScriptClient } from "../../_utils/supabaseClient";
import type { ScriptActionResult as ActionResult } from "../../_utils/types";

const FIXTURES_DIR = path.resolve(process.cwd(), "content/cogniread/fixtures");

// --- Contratos de Datos (sin cambios) ---
const supportedLocales = ["es-ES", "pt-BR", "en-US", "it-IT"] as const;
const ArticleTranslationSchema = z.object({
  title: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  summary: z.string().min(1),
  body: z.string().min(1),
});
const StudyDnaSchema = z.object({
  originalTitle: z.string().min(1),
  authors: z.array(z.string().min(1)).min(1),
  institution: z.string().min(1),
  publication: z.string().min(1),
  publicationDate: z.string().datetime(),
  doi: z.string().url(),
  fundingSource: z.string(),
  objective: z.string().min(1),
  studyType: z.string().min(1),
  methodologySummary: z.string().min(1),
  mainResults: z.string().min(1),
  authorsConclusion: z.string().min(1),
  limitations: z.array(z.string().min(1)),
});
const CogniReadArticleInputSchema = z.object({
  articleId: z.string().cuid2().optional(),
  status: z.enum(["draft", "published", "archived"]),
  createdAt: z.string().datetime().optional(),
  studyDna: StudyDnaSchema,
  content: z.record(
    z.enum(supportedLocales),
    ArticleTranslationSchema.partial()
  ),
  tags: z.array(z.string()).optional(),
  baviHeroImageId: z.string().optional(),
  relatedPromptIds: z.array(z.string().cuid2()).optional(),
});
type ArticleInput = z.infer<typeof CogniReadArticleInputSchema>;

async function processFixtureFile(
  filePath: string,
  supabase: ReturnType<typeof createScriptClient>
): Promise<boolean> {
  const fileName = path.basename(filePath);
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const articleData: ArticleInput = JSON.parse(fileContent);
    const validation = CogniReadArticleInputSchema.safeParse(articleData);
    if (!validation.success) {
      throw new Error(
        `Datos inválidos: ${JSON.stringify(validation.error.flatten().fieldErrors)}`
      );
    }
    const validatedData = validation.data;
    const now = new Date().toISOString();
    const articleId = validatedData.articleId || createId();

    const supabasePayload: CogniReadArticleInsert = {
      id: articleId,
      status: validatedData.status,
      study_dna: validatedData.studyDna as Json,
      content: validatedData.content as Json,
      tags: validatedData.tags || [],
      bavi_hero_image_id: validatedData.baviHeroImageId || null,
      related_prompt_ids: validatedData.relatedPromptIds || [],
      created_at: validatedData.createdAt || now,
      updated_at: now,
    };

    const { error } = await supabase
      .from("cogniread_articles")
      .upsert(supabasePayload, { onConflict: "id" })
      .select("id")
      .single();

    if (error) throw error;
    return true;
  } catch (error) {
    // --- [INICIO DE GUARDIÁN FORENSE] ---
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    if (errorMessage.includes('column "key" does not exist')) {
      logger.error(
        `❌ Fallo en '${fileName}': Error de Permisos Crítico. La SUPABASE_SERVICE_ROLE_KEY es inválida.`
      );
    } else {
      logger.error(`❌ Fallo al procesar el archivo '${fileName}':`, {
        error: errorMessage,
      });
    }
    // --- [FIN DE GUARDIÁN FORENSE] ---
    return false;
  }
}

export default async function seedAllCogniReadArticles(): Promise<
  ActionResult<{ successCount: number; errorCount: number }>
> {
  const traceId = logger.startTrace("seedAllCogniReadArticles_v21.0");

  try {
    const supabase = createScriptClient();
    const files = await fs.readdir(FIXTURES_DIR);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    if (jsonFiles.length === 0) {
      logger.warn(
        "[Injector] No se encontraron archivos de fixture .json en el directorio."
      );
      return { success: true, data: { successCount: 0, errorCount: 0 } };
    }

    const results = await Promise.all(
      jsonFiles.map((file) =>
        processFixtureFile(path.join(FIXTURES_DIR, file), supabase)
      )
    );

    const successCount = results.filter(Boolean).length;
    const errorCount = results.length - successCount;

    console.log("\n--- [INFORME DE INYECCIÓN COGNIREAD] ---");
    console.log(`Archivos Procesados: ${results.length}`);
    console.log(`✅ Éxitos: ${successCount}`);
    console.log(`❌ Fallos: ${errorCount}`);
    console.log("----------------------------------------\n");

    if (errorCount > 0) {
      throw new Error(
        `${errorCount} archivos no pudieron ser inyectados. Revisa los logs de error de arriba.`
      );
    }

    logger.success(
      "✅ Inyección Masiva Completada: Todos los artículos fueron procesados con éxito."
    );
    return { success: true, data: { successCount, errorCount } };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("Fallo crítico durante el proceso de inyección autónoma:", {
      error: errorMessage,
      traceId,
    });
    return { success: false, error: errorMessage };
  } finally {
    logger.endTrace(traceId);
  }
}
