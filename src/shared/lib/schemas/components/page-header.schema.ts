// RUTA: lib/schemas/components/page-header.schema.ts
/**
 * @file page-header.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n del componente
 *              de élite PageHeader. Incluye la configuración para el efecto
 *              visual MEA <LightRays />.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

import { LightRaysConfigSchema } from "@/shared/lib/schemas/components/razBits/LightRays/light-rays.schema";

export const PageHeaderContentSchema = z.object({
  title: z.string().min(1, "El título es requerido."),
  subtitle: z.string().min(1, "El subtítulo es requerido."),
  lightRays: LightRaysConfigSchema.optional(),
});

export const PageHeaderLocaleSchema = z.object({
  pageHeader: PageHeaderContentSchema.optional(),
});
