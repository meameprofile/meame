// RUTA: src/shared/lib/actions/analytics/getCampaignAnalytics.action.ts
/**
 * @file getCampaignAnalytics.action.ts
 * @description Server Action de producción para obtener los datos de analíticas
 *              de las campañas de un usuario desde Supabase.
 * @version 2.0.0 (Production-Ready RPC Data Fetching)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { z } from "zod";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import {
  CampaignAnalyticsDataSchema,
  type CampaignAnalyticsData,
} from "@/shared/lib/schemas/analytics/campaign-analytics.schema";
import { createServerClient } from "@/shared/lib/supabase/server";

export async function getCampaignAnalyticsAction(): Promise<
  ActionResult<CampaignAnalyticsData[]>
> {
  const traceId = logger.startTrace("getCampaignAnalytics_v2.0_supabase");
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logger.warn("[Analytics Action] Intento no autorizado.", { traceId });
    return { success: false, error: "auth_required" };
  }

  logger.info(
    `[Analytics Action] Solicitando analíticas para usuario: ${user.id}`
  );

  try {
    const { data, error } = await supabase.rpc("get_campaign_analytics", {
      p_user_id: user.id,
    });

    if (error) {
      throw new Error(error.message);
    }

    // Validamos la respuesta de la DB contra nuestro contrato soberano
    const validation = z.array(CampaignAnalyticsDataSchema).safeParse(data);

    if (!validation.success) {
      logger.error("[Analytics Action] Los datos de la RPC son inválidos.", {
        errors: validation.error.flatten(),
        traceId,
      });
      throw new Error("Formato de datos de analíticas inesperado.");
    }

    logger.success(
      `Se recuperaron ${validation.data.length} registros de analíticas desde la DB.`
    );
    return { success: true, data: validation.data };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("Fallo crítico durante la obtención de analíticas.", {
      error: errorMessage,
      traceId,
    });
    return {
      success: false,
      error: "No se pudieron cargar los datos de analíticas.",
    };
  } finally {
    logger.endTrace(traceId);
  }
}
