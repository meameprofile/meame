// RUTA: src/shared/lib/actions/campaign-suite/packageCampaign.action.ts
/**
 * @file packageCampaign.action.ts
 * @description Server Action de élite que orquesta el "Motor de Forja" SSG.
 *              v7.0.0 (Centralized Theming & DRY Principle): Ahora ensambla y
 *              valida el tema de forma centralizada, adhiriéndose al principio DRY.
 * @version 7.0.0
 * @author L.I.A. Legacy
 */
"use server";

import { promises as fs } from "fs";
import path from "path";
import { put } from "@vercel/blob";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";
import { CampaignDraftDataSchema } from "@/shared/lib/schemas/campaigns/draft.schema";
import { BuildPipeline } from "@/shared/lib/ssg/engine/build-pipeline";
import type { BuildContext } from "@/shared/lib/ssg/engine/types";
import { defineCampaignBuildPipeline } from "@/shared/lib/ssg/pipelines/campaign.build-pipeline";
import { deepMerge } from "@/shared/lib/utils";
import {
  AssembledThemeSchema,
  type AssembledTheme,
} from "@/shared/lib/schemas/theming/assembled-theme.schema";
import { loadJsonAsset } from "@/shared/lib/i18n/campaign.data.loader";

export async function packageCampaignAction(
  draft: CampaignDraft
): Promise<ActionResult<{ downloadUrl: string }>> {
  if (!draft.draftId) {
    return {
      success: false,
      error: "El borrador debe tener un ID para ser empaquetado.",
    };
  }

  const traceId = logger.startTrace(`packageCampaign:${draft.draftId}_v7.0`);
  logger.info(
    `[Action] Iniciando orquestación de empaquetado v7.0 para draft: ${draft.draftId}`
  );

  const draftValidation = CampaignDraftDataSchema.safeParse(draft);
  if (!draftValidation.success) {
    return { success: false, error: "El borrador contiene datos corruptos." };
  }

  const tempDir = path.join(process.cwd(), ".tmp", `campaign-${draft.draftId}`);

  try {
    // --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
    // La lógica de ensamblaje de tema ahora reside aquí, en el orquestador.
    logger.traceEvent(traceId, "Ensamblando tema de campaña...");
    const { colorPreset, fontPreset, radiusPreset, themeOverrides } =
      draft.themeConfig;
    const [base, colors, fonts, radii] = await Promise.all([
      loadJsonAsset<Partial<AssembledTheme>>(
        "theme-fragments",
        "base",
        "global.theme.json"
      ),
      colorPreset
        ? loadJsonAsset<Partial<AssembledTheme>>(
            "theme-fragments",
            "colors",
            `${colorPreset}.colors.json`
          )
        : Promise.resolve({}),
      fontPreset
        ? loadJsonAsset<Partial<AssembledTheme>>(
            "theme-fragments",
            "fonts",
            `${fontPreset}.fonts.json`
          )
        : Promise.resolve({}),
      radiusPreset
        ? loadJsonAsset<Partial<AssembledTheme>>(
            "theme-fragments",
            "radii",
            `${radiusPreset}.radii.json`
          )
        : Promise.resolve({}),
    ]);

    const finalThemeObject = deepMerge(
      deepMerge(deepMerge(deepMerge(base, colors), fonts), radii),
      themeOverrides ?? {}
    );
    const themeValidation = AssembledThemeSchema.safeParse(finalThemeObject);
    if (!themeValidation.success) {
      throw new Error(
        `El tema ensamblado es inválido: ${themeValidation.error.message}`
      );
    }
    const validatedTheme = themeValidation.data;
    logger.success(
      "[Action] Tema de campaña ensamblado y validado con éxito.",
      { traceId }
    );
    // --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA] ---

    const buildContext: BuildContext = {
      draft: draft,
      theme: validatedTheme, // El tema validado se inyecta en el contexto.
      tempDir: tempDir,
      buildDir: path.join(tempDir, "out"),
      zipPath: path.join(
        process.cwd(),
        ".tmp",
        `campaign-${draft.draftId}.zip`
      ),
    };

    const pipeline = new BuildPipeline(buildContext);
    defineCampaignBuildPipeline(pipeline, traceId);

    const pipelineResult = await pipeline.run();
    if (!pipelineResult.success) return pipelineResult;

    const zipBuffer = await fs.readFile(buildContext.zipPath);
    const blob = await put(
      `campaign-packages/${path.basename(buildContext.zipPath)}`,
      zipBuffer,
      { access: "public" }
    );

    logger.success(
      `[Action] Artefacto subido a Vercel Blob. URL: ${blob.url}`,
      { traceId }
    );
    return { success: true, data: { downloadUrl: blob.url } };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Action] Fallo crítico en la orquestación del empaquetado.", {
      error: errorMessage,
      traceId,
    });
    return { success: false, error: "No se pudo generar el paquete." };
  } finally {
    // Limpieza de archivos temporales
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
    await fs
      .unlink(path.join(process.cwd(), ".tmp", `campaign-${draft.draftId}.zip`))
      .catch(() => {});
    logger.endTrace(traceId);
  }
}
