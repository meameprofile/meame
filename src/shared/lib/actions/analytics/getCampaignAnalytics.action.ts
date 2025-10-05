// APARATO 2: SERVER ACTION DE OBTENCIÓN DE DATOS
// RUTA: src/shared/lib/actions/analytics/getCampaignAnalytics.action.ts

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
  const traceId = logger.startTrace("getCampaignAnalytics_v3.0_sovereign");
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

    // Guardián de Resiliencia: Validamos la respuesta de la DB contra nuestro contrato.
    const validation = z.array(CampaignAnalyticsDataSchema).safeParse(data);

    if (!validation.success) {
      logger.error("[Analytics Action] Los datos de la RPC son inválidos.", {
        errors: validation.error.flatten(),
        rawData: data,
        traceId,
      });
      throw new Error("Formato de datos de analíticas inesperado.");
    }

    logger.success(
      `[Analytics Action] Se recuperaron y validaron ${validation.data.length} registros de analíticas.`,
      { traceId }
    );
    return { success: true, data: validation.data };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Analytics Action] Fallo crítico al obtener analíticas.", {
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
