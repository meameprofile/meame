// app/[locale]/(dev)/dev/campaign-suite/_schemas/steps/step1.schema.ts
/**
 * @file step1.schema.ts
 * @description Schema atómico para el contenido i18n del Paso 1 de la SDC.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const Step1ContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  headerSwitchLabel: z.string(),
  footerSwitchLabel: z.string(),
  headerGalleryTitle: z.string(),
  footerGalleryTitle: z.string(),
  selectedLabel: z.string(), // <-- Internacionalización de "Seleccionado"
  galleryDescriptions: z.record(z.string()),
});
// app/[locale]/(dev)/dev/campaign-suite/_schemas/steps/step1.schema.ts
