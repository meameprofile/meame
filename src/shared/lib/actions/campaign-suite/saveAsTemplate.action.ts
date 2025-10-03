// RUTA: src/shared/lib/actions/campaign-suite/saveAsTemplate.action.ts
/**
 * @file saveAsTemplate.action.ts
 * @description Server Action para persistir un borrador como plantilla, ahora
 *              consciente del contexto del workspace y con seguridad a nivel de fila.
 * @version 4.0.0 (Workspace-Aware & Secure)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { z } from "zod";
import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";
import { CampaignDraftDataSchema } from "@/shared/lib/schemas/campaigns/draft.schema";

const InputSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  description: z.string(),
  workspaceId: z.string().uuid("Se requiere un ID de workspace válido."),
});

export async function saveAsTemplateAction(
  draft: CampaignDraft,
  name: string,
  description: string,
  workspaceId: string // <-- PARÁMETRO DE CONTEXTO REQUERIDO
): Promise<ActionResult<{ templateId: string }>> {
  const traceId = logger.startTrace("saveAsTemplateAction_v4.0");
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "auth_required" };
  }

  try {
    const inputValidation = InputSchema.safeParse({
      name,
      description,
      workspaceId,
    });
    if (!inputValidation.success) {
      return {
        success: false,
        error: "Los datos proporcionados son inválidos.",
      };
    }

    // --- GUARDIA DE SEGURIDAD DE WORKSPACE ---
    const { data: memberCheck, error: memberError } = await supabase.rpc(
      "is_workspace_member",
      { workspace_id_to_check: workspaceId }
    );
    if (memberError || !memberCheck) {
      logger.error("[Action] Verificación de membresía fallida.", {
        userId: user.id,
        workspaceId,
        error: memberError,
        traceId,
      });
      throw new Error("Acceso denegado al workspace.");
    }
    logger.traceEvent(
      traceId,
      `Usuario ${user.id} verificado como miembro del workspace ${workspaceId}.`
    );
    // --- FIN DE LA GUARDIA DE SEGURIDAD ---

    const draftValidation = CampaignDraftDataSchema.safeParse(draft);
    if (!draftValidation.success) {
      return { success: false, error: "El borrador contiene datos corruptos." };
    }

    const templateData = {
      user_id: user.id, // Mantenemos el creador original por auditoría
      workspace_id: workspaceId, // <-- PROPIEDAD DEL WORKSPACE
      name: inputValidation.data.name,
      description: inputValidation.data.description || null,
      source_campaign_id: draft.baseCampaignId || "unknown",
      draft_data: draftValidation.data,
    };

    const { data, error } = await supabase
      .from("campaign_templates")
      .insert(templateData)
      .select("id")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    logger.success("[Action] Plantilla guardada exitosamente.", {
      templateId: data.id,
      traceId,
    });
    return { success: true, data: { templateId: data.id } };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Action] Fallo crítico al guardar la plantilla.", {
      error: errorMessage,
      traceId,
    });
    return { success: false, error: "No se pudo guardar la plantilla." };
  } finally {
    logger.endTrace(traceId);
  }
}
