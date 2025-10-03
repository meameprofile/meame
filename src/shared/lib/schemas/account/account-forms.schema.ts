// RUTA: src/shared/lib/schemas/account/account-forms.schema.ts
/**
 * @file account-forms.schema.ts
 * @description SSoT para los contratos de datos de TODOS los formularios de la página de cuenta.
 * @version 3.0.0 (Secure Password Update)
 *@author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

/**
 * @const UpdateProfileSchema
 * @description Valida los datos para el formulario de actualización de perfil de usuario.
 */
export const UpdateProfileSchema = z.object({
  fullName: z
    .string()
    .min(3, "El nombre completo debe tener al menos 3 caracteres."),
});

/**
 * @type UpdateProfileFormData
 * @description Infiere el tipo de TypeScript para los datos del formulario de perfil.
 */
export type UpdateProfileFormData = z.infer<typeof UpdateProfileSchema>;

/**
 * @const UpdatePasswordSchema
 * @description Valida los datos para el formulario de cambio de contraseña.
 *              Incluye la validación de la contraseña actual y la confirmación
 *              de la nueva contraseña para una seguridad robusta.
 */
export const UpdatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Debes ingresar tu contraseña actual."),
    newPassword: z
      .string()
      .min(8, "La nueva contraseña debe tener al menos 8 caracteres."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las nuevas contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

/**
 * @type UpdatePasswordFormData
 * @description Infiere el tipo de TypeScript para los datos del formulario de cambio de contraseña.
 */
export type UpdatePasswordFormData = z.infer<typeof UpdatePasswordSchema>;

/**
 * @const ProfileFormContentSchema
 * @description Valida la estructura del contenido i18n para el componente ProfileForm.
 */
export const ProfileFormContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  emailLabel: z.string(),
  fullNameLabel: z.string(),
  saveButtonText: z.string(),
  successToast: z.string(),
  errorToastTitle: z.string(),
});

/**
 * @const ProfileFormLocaleSchema
 * @description Valida la clave de nivel superior para el contenido del ProfileForm
 *              dentro de un diccionario de locale.
 */
export const ProfileFormLocaleSchema = z.object({
  profileForm: ProfileFormContentSchema.optional(),
});
