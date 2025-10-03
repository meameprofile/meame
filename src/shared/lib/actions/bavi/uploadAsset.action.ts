// RUTA: src/shared/lib/actions/bavi/uploadAsset.action.ts
/**
 * @file uploadAsset.action.ts
 * @description Server Action orquestadora de élite para la ingesta completa
 *              de activos. v12.0.0 (Transactional Rollback & Elite Resilience):
 *              Implementa un mecanismo de rollback transaccional manual. Si las
 *              operaciones de base de datos fallan post-subida, el activo
 *              huérfano es destruido de Cloudinary para garantizar la
 *              integridad de los datos.
 * @version 12.0.0
 *@author RaZ Podestá - MetaShark Tech
 */
"use server";

import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import { assetUploadMetadataSchema } from "@/shared/lib/schemas/bavi/upload.schema";
import { addAssetToManifestsAction } from "./addAssetToManifests.action";
import { linkPromptToBaviAssetAction } from "@/shared/lib/actions/raz-prompts";

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error(
    "Las variables de entorno de Cloudinary no están configuradas."
  );
}
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadAssetAction(
  formData: FormData
): Promise<ActionResult<UploadApiResponse>> {
  const traceId = logger.startTrace("uploadAssetOrchestration_v12.0");
  logger.startGroup(`[Action] Orquestando ingesta de activo...`, traceId);

  let uploadedPublicId: string | null = null;

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      logger.warn("[Action] Intento no autorizado.", { traceId });
      return { success: false, error: "auth_required" };
    }
    logger.traceEvent(traceId, `Usuario ${user.id} autorizado.`);

    const file = formData.get("file");
    const metadataString = formData.get("metadata") as string;
    const workspaceId = formData.get("workspaceId") as string;

    if (!file || !(file instanceof File) || !metadataString || !workspaceId) {
      throw new Error("Datos de subida incompletos o falta el workspaceId.");
    }
    logger.traceEvent(traceId, "Payload de FormData validado inicialmente.");

    const { data: memberCheck, error: memberError } = await supabase.rpc(
      "is_workspace_member",
      { workspace_id_to_check: workspaceId }
    );

    if (memberError || !memberCheck) {
      throw new Error("Acceso denegado al workspace.");
    }
    logger.traceEvent(
      traceId,
      `Membresía del workspace ${workspaceId} verificada.`
    );

    const metadata = assetUploadMetadataSchema.parse(
      JSON.parse(metadataString)
    );
    logger.traceEvent(traceId, "Metadatos parseados y validados con Zod.");

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const cloudinaryResponse = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: `webvork/assets/${workspaceId}/${metadata.assetId}`,
              public_id: "v1-original",
              resource_type: "auto",
            },
            (error, result) => {
              if (error) return reject(error);
              if (result) return resolve(result);
              reject(new Error("Respuesta de Cloudinary indefinida."));
            }
          )
          .end(buffer);
      }
    );
    uploadedPublicId = cloudinaryResponse.public_id;
    logger.traceEvent(traceId, "Subida a Cloudinary exitosa.", {
      publicId: uploadedPublicId,
    });

    const manifestResult = await addAssetToManifestsAction({
      metadata,
      cloudinaryResponse,
      userId: user.id,
      workspaceId: workspaceId,
    });

    if (!manifestResult.success) {
      throw new Error(manifestResult.error);
    }
    logger.traceEvent(traceId, "Registro en BAVI DB completado.");

    if (metadata.promptId) {
      logger.traceEvent(
        traceId,
        `Vinculando con prompt ${metadata.promptId}...`
      );
      const linkResult = await linkPromptToBaviAssetAction({
        promptId: metadata.promptId,
        baviAssetId: metadata.assetId,
        workspaceId: workspaceId,
      });

      if (!linkResult.success) {
        throw new Error(linkResult.error);
      }
      logger.traceEvent(traceId, "Vinculación con prompt completada.");
    }

    logger.success("[Action] Orquestación de ingesta completada con éxito.", {
      traceId,
    });
    return { success: true, data: cloudinaryResponse };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Action] Fallo crítico en la orquestación de ingesta.", {
      error: errorMessage,
      traceId,
    });

    // --- [INICIO] GUARDIÁN DE RESILIENCIA Y ROLLBACK ---
    if (uploadedPublicId) {
      logger.warn(
        `[Rollback] Intentando eliminar activo huérfano de Cloudinary: ${uploadedPublicId}`,
        { traceId }
      );
      try {
        await cloudinary.uploader.destroy(uploadedPublicId);
        logger.success(
          `[Rollback] Activo huérfano ${uploadedPublicId} eliminado con éxito.`
        );
      } catch (cleanupError) {
        logger.error(
          `[Rollback] ¡FALLO CRÍTICO DE LIMPIEZA! No se pudo eliminar el activo huérfano ${uploadedPublicId}.`,
          { cleanupError, traceId }
        );
      }
    }
    // --- [FIN] GUARDIÁN DE RESILIENCIA Y ROLLBACK ---

    return {
      success: false,
      error: `Fallo el proceso de ingesta del activo: ${errorMessage}`,
    };
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
