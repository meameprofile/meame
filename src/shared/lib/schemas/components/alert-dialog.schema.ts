// shared/lib/schemas/components/alert-dialog.schema.ts
/**
 * @file alert-dialog.schema.ts
 * @description SSoT para el contrato de datos i18n del componente AlertDialog.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const AlertDialogContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  footerButton: z.string(),
});

export const AlertDialogLocaleSchema = z.object({
  alertDialog: AlertDialogContentSchema.optional(),
});
