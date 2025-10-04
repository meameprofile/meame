// RUTA: src/shared/lib/actions/campaign-suite/getArtifactsForDraft.action.ts
/**
 * @file getArtifactsForDraft.action.ts
 * @description Server Action soberana para obtener el historial de artefactos,
 *              ahora alineada con la Arquitectura de Contratos de Dominio Soberanos.
 * @version 2.0.0 (Sovereign Contract Aligned & Type-Safe)
 * @author L.I.A. Legacy
 */
"use server";

import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import type { CampaignArtifactRow } from "@/shared/lib/schemas/campaigns/campaign-suite.contracts";

export interface ArtifactMetadata {
  id: string;
  version: number;
  file_size: number;
  created_at: string;
}

export async function getArtifactsForDraftAction(
  draftId: string
): Promise<ActionResult<ArtifactMetadata[]>> {
  const traceId = logger.startTrace(`getArtifactsForDraft:${draftId}_v2.0`);
  logger.startGroup(`[Action] Obteniendo historial de artefactos...`, traceId);

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

    const { data, error } = await supabase
      .from("campaign_artifacts")
      .select("id, version, file_size, created_at")
      .eq("draft_id", draftId)
      .order("version", { ascending: false });

    if (error) {
      throw new Error(`Error de Supabase: ${error.message}`);
    }

    // Aseguramos el tipo de `data` para un mapeo seguro.
    const artifactsFromDb = (data as CampaignArtifactRow[]) || [];

    logger.success(
      `[Action] Se encontraron ${artifactsFromDb.length} artefactos para el borrador ${draftId}`,
      { traceId }
    );
    return { success: true, data: artifactsFromDb };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Action] Fallo al obtener el historial de artefactos.", {
      error: errorMessage,
      traceId,
    });
    return {
      success: false,
      error: "No se pudo cargar el historial de compilaciones.",
    };
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
