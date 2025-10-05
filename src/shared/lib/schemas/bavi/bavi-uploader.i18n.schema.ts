// RUTA: src/shared/lib/schemas/bavi/bavi-uploader.i18n.schema.ts
/**
 * @file bavi-uploader.i18n.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n del AssetUploader.
 * @version 2.1.0 (Intelligent Ingestion Content)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const BaviUploaderContentSchema = z.object({
  dropzoneDefault: z.string(),
  finalFileNameLabel: z.string(), // <-- NUEVO
  finalFileNamePlaceholder: z.string(), // <-- NUEVO
  metadataFormTitle: z.string(),
  assetIdLabel: z.string(),
  assetIdPlaceholder: z.string(),
  keywordsLabel: z.string(),
  keywordsPlaceholder: z.string(),
  altTextLabel: z.string(),
  altTextPlaceholder: z.string(),
  promptIdLabel: z.string(),
  promptIdPlaceholder: z.string(),
  submitButtonText: z.string(),
  selectFromBaviButton: z.string(),
  assetSelectorModalTitle: z.string(),
  assetSelectorModalDescription: z.string(),
});

export const BaviUploaderLocaleSchema = z.object({
  baviUploader: BaviUploaderContentSchema.optional(),
});
