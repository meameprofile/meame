// RUTA: src/shared/lib/schemas/entities/user-preferences.schema.ts
/**
 * @file user-preferences.schema.ts
 * @description SSoT para el contrato de datos de la entidad UserPreferences.
 * @version 2.0.0 (i18n & Zod Contract Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
// --- [INICIO DE CORRECCIÓN ARQUITECTÓNICA v2.0.0] ---
import { supportedLocales } from "@/shared/lib/i18n/i18n.config";
// --- [FIN DE CORRECCIÓN ARQUITECTÓNICA v2.0.0] ---

export const UserPreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system").optional(),
  // --- [INICIO DE CORRECCIÓN DE CONTRATO ZOD v2.0.0] ---
  locale: z.enum(supportedLocales).optional(),
  // --- [FIN DE CORRECCIÓN DE CONTRATO ZOD v2.0.0] ---
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
