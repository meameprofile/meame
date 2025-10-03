// RUTA: src/shared/lib/actions/bavi/addAssetToManifests.action.ts
/**
 * @file addAssetToManifests.action.ts
 * @description Server Action atómica para registrar un nuevo activo en Supabase.
 *              v6.0.0 (Elite Observability & Resilience): Inyectado con un sistema
 *              de tracing completo y un guardián de resiliencia que propaga
 *              errores de forma controlada al orquestador principal.
 * @version 6.0.0
 *@author RaZ Podestá - MetaShark Tech
 */
"use server";

import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import type { AssetUploadMetadata } from "@/shared/lib/schemas/bavi/upload.schema";
import type { UploadApiResponse } from "cloudinary";

interface AddAssetToDbInput {
  metadata: AssetUploadMetadata;
  cloudinaryResponse: UploadApiResponse;
  userId: string;
  workspaceId: string;
}

export async function addAssetToManifestsAction({
  metadata,
  cloudinaryResponse,
  userId,
  workspaceId,
}: AddAssetToDbInput): Promise<ActionResult<{ assetId: string }>> {
  const traceId = logger.startTrace("addAssetToDb_v6.0");
  logger.startGroup(
    `[DB Action] Persistiendo activo '${metadata.assetId}'...`,
    traceId
  );
  const supabase = createServerClient();

  try {
    logger.traceEvent(traceId, "Paso 1/2: Insertando en 'bavi_assets'...");
    const { error: assetError } = await supabase.from("bavi_assets").insert({
      asset_id: metadata.assetId,
      user_id: userId,
      workspace_id: workspaceId,
      provider: "cloudinary",
      prompt_id: metadata.promptId || null,
      tags: metadata.sesaTags,
      metadata: { altText: metadata.altText },
    });

    if (assetError) {
      throw new Error(
        `Error al insertar en bavi_assets: ${assetError.message}`
      );
    }
    logger.traceEvent(
      traceId,
      `Activo ${metadata.assetId} registrado en bavi_assets.`
    );

    logger.traceEvent(traceId, "Paso 2/2: Insertando en 'bavi_variants'...");
    const { error: variantError } = await supabase
      .from("bavi_variants")
      .insert({
        variant_id: "v1-orig",
        asset_id: metadata.assetId,
        public_id: cloudinaryResponse.public_id,
        state: "orig",
        width: cloudinaryResponse.width,
        height: cloudinaryResponse.height,
      });

    if (variantError) {
      throw new Error(
        `Error al insertar en bavi_variants: ${variantError.message}`
      );
    }
    logger.traceEvent(
      traceId,
      `Variante v1-orig para ${metadata.assetId} registrada.`
    );

    logger.success(
      `[DB Action] Activo ${metadata.assetId} persistido con éxito en Supabase.`,
      { traceId }
    );
    return { success: true, data: { assetId: metadata.assetId } };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[DB Action] Fallo al escribir en Supabase.", {
      error: errorMessage,
      traceId,
    });
    // Propaga el error hacia el orquestador `uploadAssetAction` para que pueda
    // ejecutar el rollback en Cloudinary.
    return {
      success: false,
      error: `No se pudo registrar el activo en la base de datos: ${errorMessage}`,
    };
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
