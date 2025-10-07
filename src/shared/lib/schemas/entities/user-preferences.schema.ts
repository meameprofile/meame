// RUTA: src/shared/lib/schemas/entities/user-preferences.schema.ts
/**
 * @file user-preferences.schema.ts
 * @description SSoT para el contrato de datos de la entidad UserPreferences.
 * @version 3.0.0 (Routing Contract Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import { ROUTING_LOCALES } from "@/shared/lib/i18n/i18n.config"; // <-- CONTRATO CORREGIDO

export const UserPreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system").optional(),
  locale: z.enum(ROUTING_LOCALES).optional(), // <-- CONSUMO DE SSoT CORREGIDO
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
