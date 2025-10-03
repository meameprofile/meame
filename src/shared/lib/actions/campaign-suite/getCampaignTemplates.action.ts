// RUTA: src/shared/lib/actions/campaign-suite/getCampaignTemplates.action.ts
/**
 * @file getCampaignTemplates.action.ts
 * @description Server Action de producción para obtener las plantillas, con transformación de datos.
 * @version 4.0.0 (Data Transformation & Elite Observability)
 *@author RaZ Podestá - MetaShark Tech
 */
"use server";

import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import {
  CampaignTemplateSchema,
  type CampaignTemplate,
} from "@/shared/lib/schemas/campaigns/template.schema";
import { z } from "zod";

export async function getCampaignTemplatesAction(
  workspaceId: string
): Promise<ActionResult<CampaignTemplate[]>> {
  const traceId = logger.startTrace("getCampaignTemplates_v4.0");
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logger.warn("[Action] Intento no autorizado de obtener plantillas.", {
      traceId,
    });
    return { success: false, error: "auth_required" };
  }

  logger.info(
    `[Action] Solicitando plantillas para el workspace: ${workspaceId}`,
    { traceId }
  );

  try {
    const { data: templatesFromDb, error } = await supabase
      .from("campaign_templates")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    // --- INICIO: TRANSFORMACIÓN Y GUARDIÁN DE RESILIENCIA ---
    const transformedTemplates = templatesFromDb.map((template) => ({
      id: template.id,
      name: template.name,
      description: template.description,
      createdAt: new Date(template.created_at), // Transformación de snake_case a camelCase y de string a Date
      sourceCampaignId: template.source_campaign_id,
      draftData: template.draft_data,
    }));

    const validation = z
      .array(CampaignTemplateSchema)
      .safeParse(transformedTemplates);

    if (!validation.success) {
      logger.error(
        "[Action] Los datos de plantilla de la DB son inválidos tras la transformación.",
        {
          errors: validation.error.flatten(),
          traceId,
        }
      );
      throw new Error("Formato de datos de plantilla inesperado.");
    }
    // --- FIN: TRANSFORMACIÓN Y GUARDIÁN DE RESILIENCIA ---

    logger.success(
      `Se recuperaron ${validation.data.length} plantillas para el workspace.`,
      { traceId }
    );
    return { success: true, data: validation.data };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("Fallo crítico durante la obtención de plantillas.", {
      error: errorMessage,
      traceId,
    });
    return {
      success: false,
      error: `No se pudieron cargar las plantillas: ${errorMessage}`,
    };
  } finally {
    logger.endTrace(traceId);
  }
}
