// RUTA: src/shared/lib/schemas/components/dev/dev-route-menu.schema.ts
/**
 * @file dev-route-menu.schema.ts
 * @description SSoT para el contrato i18n del DevRouteMenu.
 *              v7.1.0 (Logger Purge): Se elimina la llamada al logger para
 *              cumplir con la arquitectura de schemas puros y resolver el
 *              error de build "Attempted to call a client-side function from the server".
 * @version 7.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

// La llamada a `logger.trace` ha sido eliminada.

export const DevRouteMenuContentSchema = z
  .object({
    devMenuLabel: z.string(),
    devToolsGroup: z.string(),
    campaignPagesGroup: z.string(),
    portalPagesGroup: z.string(),
    legalPagesGroup: z.string(),
  })
  .passthrough();

export const DevRouteMenuLocaleSchema = z.object({
  devRouteMenu: DevRouteMenuContentSchema.optional(),
});
