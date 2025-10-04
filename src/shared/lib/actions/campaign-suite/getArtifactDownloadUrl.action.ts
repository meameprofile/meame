// RUTA: src/shared/lib/actions/campaign-suite/getArtifactDownloadUrl.action.ts
/**
 * @file getArtifactDownloadUrl.action.ts
 * @description Server Action soberana para generar una URL de descarga segura,
 *              ahora alineada con la Arquitectura de Contratos de Dominio Soberanos.
 * @version 2.0.0 (Sovereign Contract Aligned & Type-Safe)
 * @author L.I.A. Legacy
 */
"use server";

import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import type { CampaignArtifactRow } from "@/shared/lib/schemas/campaigns/campaign-suite.contracts";

const DOWNLOAD_URL_EXPIRES_IN = 300; // 5 minutos

export async function getArtifactDownloadUrlAction(
  artifactId: string
): Promise<ActionResult<{ downloadUrl: string }>> {
  const traceId = logger.startTrace(
    `getArtifactDownloadUrl:${artifactId}_v2.0`
  );
  logger.startGroup(`[Action] Generando URL de descarga...`, traceId);

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

    // Se especifica el tipo de la tabla para que Supabase infiera correctamente.
    const { data: artifact, error: fetchError } = await supabase
      .from("campaign_artifacts")
      .select("storage_path")
      .eq("id", artifactId)
      .single();

    if (fetchError) {
      throw new Error("Artefacto no encontrado o acceso denegado.");
    }
    logger.traceEvent(traceId, "Artefacto encontrado en la base de datos.");

    const typedArtifact = artifact as Pick<CampaignArtifactRow, "storage_path">;

    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from("artifacts")
        .createSignedUrl(typedArtifact.storage_path, DOWNLOAD_URL_EXPIRES_IN);

    if (signedUrlError) {
      throw new Error(`No se pudo firmar la URL: ${signedUrlError.message}`);
    }

    logger.success(`URL firmada generada para el artefacto ${artifactId}`, {
      traceId,
    });
    return { success: true, data: { downloadUrl: signedUrlData.signedUrl } };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("Fallo al generar la URL de descarga.", {
      error: errorMessage,
      traceId,
    });
    return { success: false, error: errorMessage };
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
