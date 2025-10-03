// RUTA: lib/schemas/components/cookie-consent-banner.schema.ts
/**
 * @file cookie-consent-banner.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n del CookieConsentBanner.
 *              v1.1.0 (Contract Integrity Fix): Añade la propiedad `policyLinkHref`
 *              para alinear el contrato de datos con los requerimientos del componente.
 * @version 1.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const CookieConsentBannerContentSchema = z.object({
  message: z.string(),
  acceptButtonText: z.string(),
  rejectButtonText: z.string(),
  policyLinkText: z.string(),
  // --- [INICIO DE CORRECCIÓN DE INTEGRIDAD] ---
  policyLinkHref: z.string().startsWith("/"), // Se añade la propiedad que faltaba
  // --- [FIN DE CORRECCIÓN DE INTEGRIDAD] ---
});

export const CookieConsentBannerLocaleSchema = z.object({
  cookieConsentBanner: CookieConsentBannerContentSchema.optional(),
});
