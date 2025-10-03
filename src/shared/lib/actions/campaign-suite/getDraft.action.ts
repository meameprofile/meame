// RUTA: src/shared/lib/actions/campaign-suite/getDraft.action.ts
/**
 * @file getDraft.action.ts
 * @description Server Action de producción para obtener el borrador más reciente
 *              de un usuario, forjada con observabilidad de élite y resiliencia.
 * @version 2.0.0 (Elite Observability & Resilience)
 *@author RaZ Podestá - MetaShark Tech
 */
"use server";

import { createServerClient } from "@/shared/lib/supabase/server";
import { CampaignDraftDataSchema } from "@/shared/lib/schemas/campaigns/draft.schema";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import { logger } from "@/shared/lib/logging";

export async function getDraftAction(): Promise<
  ActionResult<{ draft: CampaignDraft | null }>
> {
  const traceId = logger.startTrace("getDraftAction_v2.0");
  // --- [INICIO DE CORRECCIÓN DE API LOGGER (TS2345)] ---
  // El segundo argumento de startGroup es para estilo, no para contexto.
  logger.startGroup(`[Action] Obteniendo borrador de campaña...`);
  // --- [FIN DE CORRECCIÓN DE API LOGGER (TS2345)] ---

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      logger.warn(
        "[Action] No hay usuario autenticado. No se puede obtener el borrador.",
        { traceId }
      );
      // No es un error, simplemente no hay sesión.
      return { success: true, data: { draft: null } };
    }
    logger.traceEvent(traceId, `Usuario ${user.id} autorizado.`);

    const { data, error } = await supabase
      .from("campaign_drafts")
      .select("draft_id, draft_data, created_at, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 es "No rows found", que es un caso válido, no un error.
      throw new Error(`Error de Supabase: ${error.message}`);
    }

    if (data) {
      logger.traceEvent(
        traceId,
        "Borrador encontrado en la base de datos. Validando datos..."
      );

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

      logger.traceEvent(traceId, "Datos del borrador validados con éxito.");
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
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
