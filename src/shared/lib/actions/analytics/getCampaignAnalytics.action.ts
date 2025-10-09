// RUTA: src/shared/lib/actions/analytics/getCampaignAnalytics.action.ts
/**
 * @file getCampaignAnalytics.action.ts
 * @description Server Action soberana para obtener datos agregados de analíticas de campaña.
 *              v5.0.0 (Holistic Observability & Elite Compliance): Refactorizado para inyectar
 *              una trazabilidad hiper-granular con `traceEvent` en cada hito lógico,
 *              garantizando el cumplimiento del Pilar III (Observabilidad Profunda) y
 *              la resiliencia en el manejo de errores.
 * @version 5.0.0
 * @author RaZ Podestá - MetaShark Tech
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

/**
 * @function getCampaignAnalyticsAction
 * @description Orquesta la obtención de datos analíticos agregados desde la base de datos
 *              a través de una llamada a la función RPC `get_campaign_analytics`.
 * @returns {Promise<ActionResult<CampaignAnalyticsData[]>>} Un objeto con el resultado de la operación,
 *          conteniendo los datos de analíticas o un mensaje de error.
 */
export async function getCampaignAnalyticsAction(): Promise<
  ActionResult<CampaignAnalyticsData[]>
> {
  const traceId = logger.startTrace("getCampaignAnalytics_v5.0");
  const groupId = logger.startGroup(
    `[Analytics Action] Obteniendo analíticas de campaña...`,
    traceId
  );

  try {
    const supabase = createServerClient();
    logger.traceEvent(traceId, "Paso 1/4: Autorizando usuario...");
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      logger.warn("[Analytics Action] Intento de acceso no autorizado.", {
        traceId,
      });
      return { success: false, error: "auth_required" };
    }
    logger.traceEvent(
      traceId,
      `Paso 1/4 Completado: Usuario ${user.id} autorizado.`
    );

    logger.traceEvent(
      traceId,
      "Paso 2/4: Invocando RPC 'get_campaign_analytics'..."
    );
    const { data, error } = await supabase.rpc("get_campaign_analytics");

    if (error) {
      throw new Error(
        `Error en RPC 'get_campaign_analytics': ${error.message}`
      );
    }
    logger.traceEvent(
      traceId,
      "Paso 2/4 Completado: Respuesta de RPC recibida."
    );

    logger.traceEvent(
      traceId,
      "Paso 3/4: Validando datos contra el schema Zod..."
    );
    const validation = z.array(CampaignAnalyticsDataSchema).safeParse(data);

    if (!validation.success) {
      logger.error(
        "[Analytics Action] Los datos de la RPC son inválidos y no cumplen el contrato.",
        {
          errors: validation.error.flatten(),
          rawData: data,
          traceId,
        }
      );
      throw new Error(
        "Formato de datos de analíticas inesperado desde la base de datos."
      );
    }
    logger.traceEvent(
      traceId,
      `Paso 3/4 Completado: ${validation.data.length} registros validados.`
    );

    logger.success(
      `[Analytics Action] Analíticas recuperadas y validadas con éxito.`,
      { traceId }
    );
    return { success: true, data: validation.data };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(
      "[Analytics Action] Fallo crítico durante la obtención de analíticas.",
      {
        error: errorMessage,
        traceId, // Se incluye el traceId para correlacionar el error con el flujo completo.
      }
    );
    return {
      success: false,
      error: "No se pudieron cargar los datos de analíticas del servidor.",
    };
  } finally {
    logger.traceEvent(traceId, "Paso 4/4: Finalizando traza de ejecución.");
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
