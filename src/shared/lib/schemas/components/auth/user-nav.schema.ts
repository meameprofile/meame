// RUTA: src/shared/lib/schemas/components/auth/user-nav.schema.ts
/**
 * @file user-nav.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n del ecosistema UserNav.
 * @version 2.0.0 (Login Button Integration)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const UserNavContentSchema = z.object({
  loginButton: z.string(), // <-- NUEVA CLAVE
  sessionLabel: z.string(),
  logoutButton: z.string(),
  viewAllNotificationsLink: z.string(),
  notificationsLabel: z.string(),
  noNotificationsText: z.string(),
  loadingText: z.string(),
});

export const UserNavLocaleSchema = z.object({
  userNav: UserNavContentSchema.optional(),
});
