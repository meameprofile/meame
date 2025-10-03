// lib/schemas/campaigns/steps/step3.schema.ts
/**
 * @file step3.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n del Paso 3 de la SDC.
 * @version 3.0.0 (Theme Composer UI Content)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const Step3ContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  themeSelectorTitle: z.string(),
  colorsLabel: z.string(),
  fontsLabel: z.string(),
  radiiLabel: z.string(),
  colorsPlaceholder: z.string(),
  fontsPlaceholder: z.string(),
  radiiPlaceholder: z.string(),
  nextButtonText: z.string(),
  // --- [INICIO] NUEVAS CLAVES PARA EL THEME COMPOSER ---
  composerTitle: z.string(),
  composerDescription: z.string(),
  composerColorsTab: z.string(),
  composerTypographyTab: z.string(),
  composerGeometryTab: z.string(),
  composerSaveButton: z.string(),
  composerCancelButton: z.string(),
  createNewPaletteButton: z.string(),
  createNewFontSetButton: z.string(),
  createNewRadiusStyleButton: z.string(),
  placeholderFontsNone: z.string(),
  placeholderRadiiNone: z.string(),
  // --- [FIN] NUEVAS CLAVES PARA EL THEME COMPOSER ---
});
// lib/schemas/campaigns/steps/step3.schema.ts
