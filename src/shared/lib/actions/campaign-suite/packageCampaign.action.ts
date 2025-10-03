// RUTA: src/shared/lib/actions/campaign-suite/packageCampaign.action.ts
/**
 * @file packageCampaign.action.ts
 * @description Server Action de élite que orquesta el "Motor de Forja" SSG.
 * @version 6.0.0 (Elite & Resilient Orchestrator)
 * @author RaZ Podestá - MetaShark Tech
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

export async function packageCampaignAction(
  draft: CampaignDraft
): Promise<ActionResult<{ downloadUrl: string }>> {
  if (!draft.draftId) {
    return {
      success: false,
      error: "El borrador debe tener un ID para ser empaquetado.",
    };
  }

  const traceId = logger.startTrace(`packageCampaign:${draft.draftId}`);
  logger.info(
    `[Action] Iniciando orquestación de empaquetado v6.0 para draft: ${draft.draftId}`
  );

  const draftValidation = CampaignDraftDataSchema.safeParse(draft);
  if (!draftValidation.success) {
    logger.error("[Action] El borrador a empaquetar es inválido.", {
      errors: draftValidation.error.flatten(),
      traceId,
    });
    return { success: false, error: "El borrador contiene datos corruptos." };
  }

  const tempDir = path.join(process.cwd(), ".tmp", `campaign-${draft.draftId}`);
  const buildContext: BuildContext = {
    draft: draft,
    tempDir: tempDir,
    buildDir: path.join(tempDir, "out"),
    zipPath: path.join(process.cwd(), ".tmp", `campaign-${draft.draftId}.zip`),
  };

  try {
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
    await fs
      .rm(buildContext.tempDir, { recursive: true, force: true })
      .catch(() => {});
    await fs.unlink(buildContext.zipPath).catch(() => {});
    logger.endTrace(traceId);
  }
}
