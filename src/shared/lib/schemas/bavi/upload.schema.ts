// RUTA: src/shared/lib/schemas/bavi/upload.schema.ts
/**
 * @file upload.schema.ts
 * @description SSoT para los metadatos de subida a la BAVI.
 * @version 3.0.0 (Intelligent Ingestion)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import { RaZPromptsSesaTagsSchema } from "@/shared/lib/schemas/raz-prompts/atomic.schema";

export const assetUploadMetadataSchema = z.object({
  finalFileName: z
    .string()
    .min(1, "El nombre del archivo no puede estar vacío."), // <-- NUEVO
  assetId: z.string().min(1, "Se requiere un assetId único."),
  keywords: z.array(z.string()),
  sesaTags: RaZPromptsSesaTagsSchema.partial(),
  altText: z.record(z.string()),
  promptId: z.string().optional(),
});

export type AssetUploadMetadata = z.infer<typeof assetUploadMetadataSchema>;
