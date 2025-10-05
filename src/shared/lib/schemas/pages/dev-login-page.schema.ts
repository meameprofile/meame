// RUTA: src/shared/lib/schemas/pages/dev-login-page.schema.ts
/**
 * @file dev-login-page.schema.ts
 * @description SSoT para el contrato de datos i18n del dominio de login del DCC.
 * @version 6.1.0 (Fallback Content Contract)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const DevLoginPageContentSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  contextualMessages: z.object({
    protected_route_access: z.string(),
    session_expired: z.string(),
  }),
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
  backgroundImageAssetId: z.string().min(1),
  showPasswordAriaLabel: z.string(),
  hidePasswordAriaLabel: z.string(),
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
    // --- [INICIO DE RESTAURACIÓN DE CONTRATO] ---
    unknownLocation: z.string(),
    unknownIp: z.string(),
    // --- [FIN DE RESTAURACIÓN DE CONTRATO] ---
  }),
});

export const DevLoginPageLocaleSchema = z.object({
  devLoginPage: DevLoginPageContentSchema.optional(),
});
