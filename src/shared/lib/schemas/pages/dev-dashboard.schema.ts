// RUTA: src/shared/lib/schemas/pages/dev-dashboard.schema.ts
/**
 * @file dev-dashboard.schema.ts
 * @description SSoT para el contrato de datos del DCC Dashboard v4.0.
 *              Consolida la estructura de datos en torno a `magicBento` como la
 *              única fuente de verdad para las herramientas.
 * @version 4.0.0 (MagicBento SSoT Consolidation)
 *@author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import { PageHeaderContentSchema } from "../components/page-header.schema";
import { MagicBentoLocaleSchema } from "../components/razBits/MagicBento/magic-bento.schema";

export const DevDashboardContentSchema = z.object({
  pageHeader: PageHeaderContentSchema,
  // 'magicBento' es ahora la SSoT oficial para el contenido de las herramientas del dashboard.
  magicBento: MagicBentoLocaleSchema.shape.magicBento,
});

export const DevDashboardLocaleSchema = z.object({
  devDashboardPage: DevDashboardContentSchema.optional(),
});
