// RUTA: src/shared/lib/schemas/components/auth/oauth-buttons.schema.ts
/**
 * @file oauth-buttons.schema.ts
 * @description SSoT para el contrato de datos i18n del componente OAuthButtons.
 * @version 1.0.0
 * @author L.I.A. Legacy
 */
import { z } from "zod";

export const OAuthButtonsContentSchema = z.object({
  google: z.string(),
  apple: z.string(),
  facebook: z.string(),
});

export const OAuthButtonsLocaleSchema = z.object({
  oAuthButtons: OAuthButtonsContentSchema.optional(),
});
