// RUTA: src/shared/lib/schemas/pages/dev-login-page.schema.ts
/**
 * @file dev-login-page.schema.ts
 * @description SSoT para el contrato de datos i18n del dominio de login del DCC.
 * @version 6.0.0 (Password Visibility Toggle & MEA/UX)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const DevLoginPageContentSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  emailLabel: z.string(),
  emailPlaceholder: z.string(),
  passwordLabel: z.string(),
  passwordPlaceholder: z.string(),
  forgotPasswordLink: z.string(),
  buttonText: z.string(),
  buttonLoadingText: z.string(),
  signUpPrompt: z.string(),
  signUpLink: z.string(),
  footerHtml: z.string(),
  backgroundImageAssetId: z
    .string()
    .min(1, "Se requiere un assetId para la imagen de fondo."),
  forgotPassword: z.object({
    modalTitle: z.string(),
    modalDescription: z.string(),
    submitButton: z.string(),
    submitButtonLoading: z.string(),
    cancelButton: z.string(),
    successToastTitle: z.string(),
    successToastDescription: z.string(),
  }),
  lastSignIn: z.object({
    title: z.string(),
    location: z.string().includes("{{location}}"),
    ip: z.string().includes("{{ip}}"),
  }),
  // --- [INICIO DE MEJORA DE CONTRATO] ---
  showPasswordAriaLabel: z.string(),
  hidePasswordAriaLabel: z.string(),
  // --- [FIN DE MEJORA DE CONTRATO] ---
});

export const DevLoginPageLocaleSchema = z.object({
  devLoginPage: DevLoginPageContentSchema.optional(),
});
