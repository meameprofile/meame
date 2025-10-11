// RUTA: src/shared/lib/actions/campaign-suite/getDraft.action.ts
/**
 * @file getDraft.action.ts
 * @description Server Action de producción para obtener el borrador más reciente
 *              de un usuario, forjada con observabilidad de élite y resiliencia.
 * @version 3.0.0 (Hyper-Granular Observability)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { logger } from "@/shared/lib/logging";
import { CampaignDraftDataSchema } from "@/shared/lib/schemas/campaigns/draft.schema";
import { createServerClient } from "@/shared/lib/supabase/server";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";

export async function getDraftAction(): Promise<
  ActionResult<{ draft: CampaignDraft | null }>
> {
  const traceId = logger.startTrace("getDraftAction_v3.0");
  const groupId = logger.startGroup(
    `[Action] Obteniendo borrador de campaña...`
  );

  try {
    const supabase = createServerClient();
    logger.traceEvent(traceId, "Paso 1: Autorizando usuario...");
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      logger.warn(
        "[Action] No hay usuario autenticado. No se puede obtener el borrador.",
        { traceId }
      );
      return { success: true, data: { draft: null } };
    }
    logger.traceEvent(
      traceId,
      `Paso 1 Completado: Usuario ${user.id} autorizado.`
    );

    logger.traceEvent(traceId, "Paso 2: Consultando base de datos...");
    const { data, error } = await supabase
      .from("campaign_drafts")
      .select("draft_id, draft_data, created_at, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();
    logger.traceEvent(traceId, "Paso 2 Completado: Consulta a DB finalizada.");

    if (error && error.code !== "PGRST116") {
      throw new Error(`Error de Supabase: ${error.message}`);
    }

    if (data) {
      logger.traceEvent(traceId, "Paso 3: Validando datos del borrador...");
      const validation = CampaignDraftDataSchema.safeParse(data.draft_data);

      if (!validation.success) {
        logger.error(
          "[Guardián de Resiliencia] Datos de borrador corruptos en la base de datos.",
          {
            draftId: data.draft_id,
            errors: validation.error.flatten(),
            traceId,
          }
        );
        throw new Error(
          "Los datos del borrador en la base de datos están corruptos."
        );
      }
      logger.traceEvent(traceId, "Paso 3 Completado: Datos validados.");
      return { success: true, data: { draft: validation.data } };
    } else {
      logger.info(
        "[Action] No se encontró un borrador existente para el usuario.",
        { traceId }
      );
      return { success: true, data: { draft: null } };
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Action] Fallo crítico al obtener el borrador.", {
      error: errorMessage,
      traceId,
    });
    return {
      success: false,
      error: "No se pudo obtener el borrador de la base de datos.",
    };
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
