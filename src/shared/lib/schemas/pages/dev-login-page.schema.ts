// RUTA: src/shared/lib/schemas/pages/dev-login-page.schema.ts
/**
 * @file dev-login-page.schema.ts
 * @description SSoT para el contrato de datos i18n del dominio de login del DCC.
 * @version 8.0.0 (Interactive Inactivity Toast Contract)
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
    unknownLocation: z.string(),
    unknownIp: z.string(),
  }),
  // --- [INICIO DE NIVELACIÓN DE CONTRATO v8.0.0] ---
  inactivityToast: z.object({
    title: z.string(),
    description: z.string(),
    renewButton: z.string(),
    redirectNowButton: z.string(),
  }),
  // Se elimina la propiedad obsoleta `inactivityRedirect`.
  // --- [FIN DE NIVELACIÓN DE CONTRATO v8.0.0] ---
});

export const DevLoginPageLocaleSchema = z.object({
  devLoginPage: DevLoginPageContentSchema.optional(),
});
