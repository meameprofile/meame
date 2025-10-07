// RUTA: src/shared/lib/actions/analytics/_shapers/analytics.shapers.ts
/**
 * @file analytics.shapers.ts
 * @description SSoT para la transformación de datos del dominio de Analytics.
 * @version 1.0.0 (Sovereign & Resilient)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import {
  AuraEventPayloadSchema,
  type AuraEventPayload,
} from "@/shared/lib/schemas/analytics/aura.schema";
import type { VisitorCampaignEventRow } from "@/shared/lib/schemas/analytics/analytics.contracts";
import { logger } from "@/shared/lib/logging";

/**
 * @function mapSupabaseToAuraEventPayload
 * @description Transforma una fila 'visitor_campaign_events' y su payload
 *              desencriptado a la entidad 'AuraEventPayload' de la aplicación.
 * @param {VisitorCampaignEventRow} row - La fila cruda de Supabase.
 * @param {Record<string, unknown>} decryptedPayload - El payload ya desencriptado.
 * @param {string} [traceId] - ID de traza opcional para logging.
 * @returns {AuraEventPayload} La entidad transformada y validada.
 * @throws {ZodError} Si los datos no cumplen con el schema.
 */
export function mapSupabaseToAuraEventPayload(
  row: VisitorCampaignEventRow,
  decryptedPayload: Record<string, unknown>,
  traceId?: string
): AuraEventPayload {
  logger.trace(
    `[Shaper] Transformando VisitorCampaignEventRow: ${row.event_id}`,
    { traceId }
  );

  const transformed = {
    eventType: row.event_type,
    sessionId: row.session_id,
    campaignId: row.campaign_id,
    variantId: row.variant_id,
    timestamp: new Date(row.created_at).getTime(),
    payload: decryptedPayload,
  };

  return AuraEventPayloadSchema.parse(transformed);
}
