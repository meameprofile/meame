// RUTA: src/shared/lib/actions/analytics/getCampaignAnalytics.action.ts
/**
 * @file getCampaignAnalytics.action.ts
 * @description Server Action para obtener datos de analíticas de campaña.
 * @version 4.0.0 (Holistic Elite Leveling)
 * @author L.I.A. Legacy
 */
"use server";

import { z } from "zod";
import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import {
  CampaignAnalyticsDataSchema,
  type CampaignAnalyticsData,
} from "@/shared/lib/schemas/analytics/campaign-analytics.schema";

export async function getCampaignAnalyticsAction(): Promise<
  ActionResult<CampaignAnalyticsData[]>
> {
  const traceId = logger.startTrace("getCampaignAnalytics_v4.0");
  logger.startGroup(`[Analytics Action] Obteniendo analíticas...`, traceId);

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      logger.warn("[Analytics Action] Intento no autorizado.", { traceId });
      return { success: false, error: "auth_required" };
    }
    logger.traceEvent(traceId, `Usuario ${user.id} autorizado.`);

    const { data, error } = await supabase.rpc("get_campaign_analytics");

    if (error) {
      throw new Error(
        `Error en RPC 'get_campaign_analytics': ${error.message}`
      );
    }

    const validation = z.array(CampaignAnalyticsDataSchema).safeParse(data);

    if (!validation.success) {
      logger.error("[Analytics Action] Los datos de la RPC son inválidos.", {
        errors: validation.error.flatten(),
        rawData: data,
        traceId,
      });
      throw new Error("Formato de datos de analíticas inesperado.");
    }
    logger.traceEvent(
      traceId,
      `${validation.data.length} registros validados.`
    );

    logger.success(`[Analytics Action] Analíticas recuperadas con éxito.`);
    return { success: true, data: validation.data };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Analytics Action] Fallo crítico.", {
      error: errorMessage,
      traceId,
    });
    return {
      success: false,
      error: "No se pudieron cargar los datos de analíticas.",
    };
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
