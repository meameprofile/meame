// app/[locale]/(dev)/dev/campaign-suite/_schemas/steps/step4.schema.ts
/**
 * @file step4.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n del Paso 4 de la SDC.
 * @version 2.0.0 (Contract Sync)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const Step4ContentSchema = z.object({
  title: z.string(),
  // --- [INICIO DE SINCRONIZACIÓN DE CONTRATO] ---
  description: z.string(),
  emptyStateTitle: z.string(),
  emptyStateDescription: z.string(),
  editButtonText: z.string(),
  nextButtonText: z.string(),
  // --- [FIN DE SINCRONIZACIÓN DE CONTRATO] ---
});
// app/[locale]/(dev)/dev/campaign-suite/_schemas/steps/step4.schema.ts
