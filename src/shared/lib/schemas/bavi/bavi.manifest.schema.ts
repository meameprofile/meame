// RUTA: src/shared/lib/schemas/bavi/bavi.manifest.schema.ts
/**
 * @file bavi.manifest.schema.ts
 * @description SSoT para el contrato de datos del manifiesto BAVI.
 * @version 5.0.0 (SESA Atomic Keys)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

import { RaZPromptsSesaTagsSchema } from "../raz-prompts/atomic.schema";

const BaviVariantSchema = z.object({
  versionId: z.string(),
  publicId: z.string(),
  state: z.enum(["orig", "enh"]),
  dimensions: z.object({
    width: z.number(),
    height: z.number(),
  }),
});

export const BaviAssetSchema = z.object({
  assetId: z.string(),
  status: z.enum(["active", "archived", "pending"]),
  provider: z.enum(["cloudinary"]),
  description: z.string().optional(),
  tags: RaZPromptsSesaTagsSchema.partial().optional(),
  variants: z.array(BaviVariantSchema).min(1),
  metadata: z.object({
    altText: z.record(z.string()),
  }),
  promptId: z.string().min(1).nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const BaviManifestSchema = z.object({
  assets: z.array(BaviAssetSchema),
});

export type BaviAsset = z.infer<typeof BaviAssetSchema>;
export type BaviManifest = z.infer<typeof BaviManifestSchema>;
export type BaviVariant = z.infer<typeof BaviVariantSchema>;
