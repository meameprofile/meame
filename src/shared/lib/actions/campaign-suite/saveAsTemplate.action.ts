// RUTA: src/shared/lib/actions/campaign-suite/saveAsTemplate.action.ts
/**
 * @file saveAsTemplate.action.ts
 * @description Server Action para persistir un borrador como plantilla, ahora
 *              alineada con la Arquitectura de Contratos de Dominio Soberanos.
 * @version 5.1.0 (Observability Contract Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import "server-only";
import { z } from "zod";

import { logger } from "@/shared/lib/logging";
import type { CampaignTemplateInsert } from "@/shared/lib/schemas/campaigns/campaign-suite.contracts";
import { CampaignDraftDataSchema } from "@/shared/lib/schemas/campaigns/draft.schema";
import type { Json } from "@/shared/lib/supabase/database.types";
import { createServerClient } from "@/shared/lib/supabase/server";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";

const InputSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  description: z.string(),
  workspaceId: z.string().uuid("Se requiere un ID de workspace válido."),
});

export async function saveAsTemplateAction(
  draft: CampaignDraft,
  name: string,
  description: string,
  workspaceId: string
): Promise<ActionResult<{ templateId: string }>> {
  const traceId = logger.startTrace("saveAsTemplateAction_v5.1");
  const groupId = logger.startGroup(
    `[Action] Guardando borrador como plantilla...`,
    traceId
  );

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

    const inputValidation = InputSchema.safeParse({
      name,
      description,
      workspaceId,
    });
    if (!inputValidation.success) {
      logger.warn("[Action] Input de creación de plantilla inválido.", {
        errors: inputValidation.error.flatten(),
        traceId,
      });
      return {
        success: false,
        error: "Los datos proporcionados son inválidos.",
      };
    }

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

    const draftValidation = CampaignDraftDataSchema.safeParse(draft);
    if (!draftValidation.success) {
      logger.error("[Action] El borrador a guardar es inválido.", {
        errors: draftValidation.error.flatten(),
        traceId,
      });
      return { success: false, error: "El borrador contiene datos corruptos." };
    }
    const draftData = draftValidation.data;
    logger.traceEvent(traceId, "Datos del borrador validados.");

    const templatePayload: CampaignTemplateInsert = {
      user_id: user.id,
      workspace_id: workspaceId,
      name: inputValidation.data.name,
      description: inputValidation.data.description || null,
      source_campaign_id: draftData.baseCampaignId || "unknown",
      draft_data: draftData as Json, // Aserción de tipo explícita
    };
    logger.traceEvent(traceId, "Payload de Supabase generado.");

    const { data, error } = await supabase
      .from("campaign_templates")
      .insert(templatePayload)
      .select("id")
      .single();

    if (error) {
      throw new Error(error.message);
    }
    logger.traceEvent(traceId, `Plantilla insertada con ID: ${data.id}.`);

    logger.success(`[Action] Plantilla '${name}' guardada con éxito.`, {
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
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
