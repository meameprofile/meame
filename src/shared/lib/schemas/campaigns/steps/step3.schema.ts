// RUTA: src/shared/lib/schemas/campaigns/steps/step3.schema.ts
/**
 * @file step3.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n del Paso 3 de la SDC.
 * @version 3.4.0 (Sovereign Dialog Schemas)
 * @author L.I.A. Legacy
 */
import { z } from "zod";

export const DeletePresetDialogSchema = z.object({
  title: z.string(),
  description: z.string(),
  cancelButton: z.string(),
  confirmButton: z.string(),
});

export const EditPresetDialogSchema = z.object({
  title: z.string(),
  description: z.string(),
  nameLabel: z.string(),
  descriptionLabel: z.string(),
  saveButton: z.string(),
  cancelButton: z.string(),
});

export const CreatePresetDialogSchema = z.object({
  title: z.string(),
  description: z.string(),
  nameLabel: z.string(),
  namePlaceholder: z.string(),
  descriptionLabel: z.string(),
  descriptionPlaceholder: z.string(),
  saveButton: z.string(),
  cancelButton: z.string(),
});

export const Step3ContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  loadingTitle: z.string(),
  loadingDescription: z.string(),
  themeSelectorTitle: z.string(),
  colorsLabel: z.string(),
  fontsLabel: z.string(),
  radiiLabel: z.string(),
  colorsPlaceholder: z.string(),
  fontsPlaceholder: z.string(),
  radiiPlaceholder: z.string(),
  nextButtonText: z.string(),
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
  deletePresetDialog: DeletePresetDialogSchema,
  editPresetDialog: EditPresetDialogSchema,
  createPresetDialog: CreatePresetDialogSchema,
});
