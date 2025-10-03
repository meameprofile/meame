// RUTA: shared/lib/schemas/components/dev/suite-style-composer.schema.ts
/**
 * @file suite-style-composer.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n del
 *              SuiteStyleComposer.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const SuiteStyleComposerContentSchema = z.object({
  customizeButton: z.string(),
  composerTitle: z.string(),
  composerDescription: z.string(),
  composerColorsTab: z.string(),
  composerTypographyTab: z.string(),
  composerGeometryTab: z.string(),
  composerSaveButton: z.string(),
  composerCancelButton: z.string(),
  selectThemeLabel: z.string(),
  selectFontLabel: z.string(),
  selectRadiusLabel: z.string(),
  defaultPresetName: z.string(),
  colorFilterPlaceholder: z.string(),
  fontFilterPlaceholder: z.string(),
  radiusFilterPlaceholder: z.string(),
  fontSizeLabel: z.string(),
  fontWeightLabel: z.string(),
  lineHeightLabel: z.string(),
  letterSpacingLabel: z.string(),
  borderRadiusLabel: z.string(),
  borderWidthLabel: z.string(),
  baseSpacingUnitLabel: z.string(),
  inputHeightLabel: z.string(),
});

export const SuiteStyleComposerLocaleSchema = z.object({
  suiteStyleComposer: SuiteStyleComposerContentSchema.optional(),
});
