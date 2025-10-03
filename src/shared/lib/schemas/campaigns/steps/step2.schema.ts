// app/[locale]/(dev)/dev/campaign-suite/_schemas/steps/step2.schema.ts
/**
 * @file step2.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n del Paso 2 de la SDC.
 *              v2.0.0 (Contract Unification): Unifica la clave de descripción a 'description'
 *              para una consistencia total.
 * @version 2.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const Step2ContentSchema = z.object({
  title: z.string(),
  description: z.string(), // <-- Clave unificada y canónica
  libraryTitle: z.string(),
  canvasTitle: z.string(),
  addSectionButtonText: z.string(),
  emptyLibraryText: z.string(),
  emptyCanvasText: z.string(),
  nextButtonText: z.string(),
});
// app/[locale]/(dev)/dev/campaign-suite/_schemas/steps/step2.schema.ts
