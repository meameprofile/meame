// RUTA: src/shared/lib/schemas/pages/dev/heimdall-observatory.i18n.schema.ts
/**
 * @file heimdall-observatory.i18n.schema.ts
 * @description SSoT para el contrato i18n del Observatorio Heimdall.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

import { PageHeaderContentSchema } from "@/shared/lib/schemas/components/page-header.schema";

export const HeimdallObservatoryContentSchema = z.object({
  pageHeader: PageHeaderContentSchema,
  recentsPanel: z.object({
    title: z.string(),
  }),
  detailPanel: z.object({
    title: z.string(),
  }),
  mimirPanel: z.object({
    title: z.string(),
    analyzeButton: z.string(),
    thinkingButton: z.string(),
    placeholder: z.string(),
  }),
});

export const HeimdallObservatoryLocaleSchema = z.object({
  heimdallObservatory: HeimdallObservatoryContentSchema.optional(),
});
