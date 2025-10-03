// RUTA: src/shared/lib/actions/campaign-suite/getArtifactsForDraft.action.ts
/**
 * @file getArtifactsForDraft.action.ts
 * @description Server Action soberana para obtener el historial de artefactos
 *              generados para un borrador de campaña específico.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";

export interface ArtifactMetadata {
  id: string;
  version: number;
  file_size: number;
  created_at: string;
}

export async function getArtifactsForDraftAction(
  draftId: string
): Promise<ActionResult<ArtifactMetadata[]>> {
  const traceId = logger.startTrace(`getArtifactsForDraft:${draftId}`);
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "auth_required" };
  }

  try {
    const { data, error } = await supabase
      .from("campaign_artifacts")
      .select("id, version, file_size, created_at")
      .eq("draft_id", draftId)
      .order("version", { ascending: false });

    if (error) {
      throw new Error(`Error de Supabase: ${error.message}`);
    }

    logger.success(
      `Se encontraron ${data.length} artefactos para el borrador ${draftId}`,
      { traceId }
    );
    return { success: true, data };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("Fallo al obtener el historial de artefactos.", {
      error: errorMessage,
      traceId,
    });
    return {
      success: false,
      error: "No se pudo cargar el historial de compilaciones.",
    };
  } finally {
    logger.endTrace(traceId);
  }
}
