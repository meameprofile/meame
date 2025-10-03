// Ruta correcta: src/shared/lib/schemas/components/account/profile-form.schema.ts
/**
 * @file profile-form.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n del componente ProfileForm.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const ProfileFormContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  emailLabel: z.string(),
  fullNameLabel: z.string(),
  saveButtonText: z.string(),
  successToast: z.string(),
  errorToastTitle: z.string(),
});

export const ProfileFormLocaleSchema = z.object({
  profileForm: ProfileFormContentSchema.optional(),
});
// Ruta correcta: src/shared/lib/schemas/components/account/profile-form.schema.ts
