// RUTA: src/shared/lib/schemas/components/auth/user-nav.schema.ts
/**
 * @file user-nav.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n del ecosistema UserNav.
 * @version 3.0.0 (Workspace Switcher Integration)
 * @author L.I.A. Legacy
 */
import { z } from "zod";
import { WorkspaceSwitcherContentSchema } from "./workspace-switcher.schema"; // <-- NUEVA IMPORTACIÓN

export const UserNavContentSchema = z.object({
  loginButton: z.string(),
  sessionLabel: z.string(),
  logoutButton: z.string(),
  viewAllNotificationsLink: z.string(),
  notificationsLabel: z.string(),
  noNotificationsText: z.string(),
  loadingText: z.string(),
  workspaceSwitcher: WorkspaceSwitcherContentSchema, // <-- NUEVA PROPIEDAD
});

export const UserNavLocaleSchema = z.object({
  userNav: UserNavContentSchema.optional(),
});
