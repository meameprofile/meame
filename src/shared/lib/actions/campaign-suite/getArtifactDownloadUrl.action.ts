// RUTA: src/shared/lib/actions/campaign-suite/getArtifactDownloadUrl.action.ts
/**
 * @file getArtifactDownloadUrl.action.ts
 * @description Server Action soberana para generar una URL de descarga segura y
 *              de corta duración para un artefacto de campaña.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";

const DOWNLOAD_URL_EXPIRES_IN = 300; // 5 minutos

export async function getArtifactDownloadUrlAction(
  artifactId: string
): Promise<ActionResult<{ downloadUrl: string }>> {
  const traceId = logger.startTrace(`getArtifactDownloadUrl:${artifactId}`);
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "auth_required" };
  }

  try {
    const { data: artifact, error: fetchError } = await supabase
      .from("campaign_artifacts")
      .select("storage_path")
      .eq("id", artifactId)
      .single();

    if (fetchError) {
      throw new Error("Artefacto no encontrado o acceso denegado.");
    }

    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from("artifacts")
        .createSignedUrl(artifact.storage_path, DOWNLOAD_URL_EXPIRES_IN);

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
    logger.endTrace(traceId);
  }
}
