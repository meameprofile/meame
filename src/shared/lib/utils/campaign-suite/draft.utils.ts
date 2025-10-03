// lib/utils/draft.utils.ts
/**
 * @file draft.utils.ts
 * @description Utilidades puras y atómicas para la lógica de negocio de los borradores de campaña.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 * @principle SOLID (SRP), DRY
 */
import { logger } from "@/shared/lib/logging";

/**
 * @function generateDraftId
 * @description Genera un identificador único y legible para un borrador de campaña.
 * @param {string} baseCampaignId - El ID de la campaña base sobre la que se crea el borrador.
 * @returns {string} Un ID de borrador único (ej. "12157-1694812800000").
 */
export function generateDraftId(baseCampaignId: string): string {
  const draftId = `${baseCampaignId}-${Date.now()}`;
  logger.trace(`[DraftUtils] Nuevo draftId generado: ${draftId}`);
  return draftId;
}
// lib/utils/draft.utils.ts
