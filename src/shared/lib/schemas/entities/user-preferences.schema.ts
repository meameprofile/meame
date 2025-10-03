// RUTA: shared/lib/schemas/entities/user-preferences.schema.ts
/**
 * @file user-preferences.schema.ts
 * @description SSoT para el contrato de datos de la entidad de Preferencias de Usuario.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import { supportedLocales } from "@/shared/lib/i18n/i18n.config";

export const UserPreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system").optional(),
  locale: z.enum(supportedLocales).optional(),
  // Futuras preferencias (ej. 'notifications', 'dashboardLayout') se añadirán aquí.
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
