// RUTA: scripts/seeding/seed-articles.ts
/**
 * @file seed-articles.ts
 * @description Script de siembra para CogniRead. SSoT para la inyección de artículos.
 *              v12.0.0 (Architectural Purity): Esta versión consume el nuevo
 *              cliente de Supabase aislado, rompiendo todas las cadenas de importación
 *              hacia el directorio `src` y resolviendo los errores de module boundary.
 * @version 12.0.0
 * @author L.I.A. Legacy
 */
import * as fs from "fs/promises";
import * as path from "path";
import chalk from "chalk";
import { createId } from "@paralleldrive/cuid2";
import { logger } from "../../src/shared/lib/logging";
import {
  CogniReadArticleSchema,
  type CogniReadArticle,
} from "../../src/shared/lib/schemas/cogniread/article.schema";
import { createScriptClient } from "../supabase/script-client"; // <-- RUTA CORREGIDA
import type { ActionResult } from "../../src/shared/lib/types/actions.types";

type ArticleInput = Omit<
  CogniReadArticle,
  "articleId" | "createdAt" | "updatedAt" | "tags"
> & {
  articleId?: string;
  createdAt?: string;
  tags?: string[];
};

async function seedSingleCogniReadArticle(): Promise<
  ActionResult<{ articleId: string }>
> {
  const traceId = logger.startTrace("seedCogniReadArticle_v12.0");
  logger.startGroup("🌱 Iniciando siembra de artículo de CogniRead (v12.0)...");

  const fixturePathArgument = process.argv[2];
  if (!fixturePathArgument) {
    const errorMsg =
      "No se especificó la ruta al archivo de fixture. Uso: pnpm tsx scripts/run-with-env.ts scripts/seeding/seed-articles.ts <ruta/al/fixture.json>";
    logger.error(`[Seeder] ${errorMsg}`);
    logger.endGroup();
    logger.endTrace(traceId);
    return { success: false, error: errorMsg };
  }
  const fixturePath = path.resolve(process.cwd(), fixturePathArgument);

  const supabase = createScriptClient();

  try {
    const fileContent = await fs.readFile(fixturePath, "utf-8");
    const articleData: ArticleInput = JSON.parse(fileContent);

    const now = new Date().toISOString();
    const articleId = articleData.articleId || createId();

    logger.info(`[Seeder] Procesando fixture para: ${articleId}`);

    const articleDocument: CogniReadArticle = {
      ...(articleData as Omit<
        ArticleInput,
        "articleId" | "createdAt" | "tags"
      >),
      articleId,
      createdAt: articleData.createdAt || now,
      updatedAt: now,
      baviHeroImageId: articleData.baviHeroImageId || undefined,
      relatedPromptIds: articleData.relatedPromptIds || [],
      tags: articleData.tags || [],
    };

    const validation = CogniReadArticleSchema.safeParse(articleDocument);
    if (!validation.success) {
      const errorMsg = "Los datos del fixture son inválidos según el schema.";
      logger.error("[Seeder] " + errorMsg, {
        errors: validation.error.flatten(),
        traceId,
      });
      throw new Error(errorMsg);
    }
    const { data: validatedData } = validation;

    const supabasePayload = {
      id: validatedData.articleId,
      status: validatedData.status,
      study_dna: validatedData.studyDna,
      content: validatedData.content,
      tags: validatedData.tags,
      bavi_hero_image_id: validatedData.baviHeroImageId || null,
      related_prompt_ids: validatedData.relatedPromptIds || [],
      created_at: validatedData.createdAt,
      updated_at: validatedData.updatedAt,
    };

    logger.traceEvent(
      traceId,
      "Realizando operación 'upsert' en la tabla 'cogniread_articles'..."
    );

    const { data, error } = await supabase
      .from("cogniread_articles")
      .upsert(supabasePayload, { onConflict: "id" })
      .select("id")
      .single();

    if (error) {
      throw new Error(`Error de Supabase: ${error.message}`);
    }

    console.log(
      chalk.green.bold(
        `\n     ✅ Éxito: Artículo '${data.id}' sembrado/actualizado en Supabase.`
      )
    );
    return { success: true, data: { articleId: data.id } };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("Error crítico durante el proceso de siembra:", {
      error: errorMessage,
      traceId,
    });
    return { success: false, error: errorMessage };
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}

export default seedSingleCogniReadArticle;
