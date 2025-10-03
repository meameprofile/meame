// shared/lib/schemas/components/share-button.schema.ts
/**
 * @file share-button.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n del ShareButton.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const ShareButtonContentSchema = z.object({
  buttonLabel: z.string(),
  popoverTitle: z.string(),
  copyLinkAction: z.string(),
  copySuccessToast: z.string(),
});

export const ShareButtonLocaleSchema = z.object({
  shareButton: ShareButtonContentSchema.optional(),
});
// shared/lib/schemas/components/share-button.schema.ts
