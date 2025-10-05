// RUTA: src/shared/lib/schemas/components/language-switcher.schema.ts
/**
 * @file language-switcher.schema.ts
 * @description SSoT para el contrato i18n del ecosistema de selección de idioma.
 * @version 6.0.0 (Sovereign Path Restoration & Elite Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
// --- [INICIO DE CORRECCIÓN ARQUITECTÓNICA v6.0.0] ---
// La importación ahora apunta a la SSoT de configuración (`i18n.config.ts`),
// que es la fuente de verdad para las constantes de la aplicación, en lugar
// del manifiesto de datos puros. Esto resuelve el error TS2305.
import { supportedLocales } from "@/shared/lib/i18n/i18n.config";
// --- [FIN DE CORRECCIÓN ARQUITECTÓNICA v6.0.0] ---

export const LanguageSwitcherContentSchema = z.object({
  ariaLabel: z.string(),
  modalTitle: z.string(),
  modalDescription: z.string(),
  searchPlaceholder: z.string(),
  noResultsFound: z.string(),
  continents: z.object({
    Africa: z.string(),
    Asia: z.string(),
    Europe: z.string(),
    "North America": z.string(),
    "South America": z.string(),
    Oceania: z.string(),
    Global: z.string(),
    Other: z.string(),
  }),
  // Gracias a la corrección en `i18n.config.ts`, ya no se necesita la aserción de tipo `as [...]`.
  // El tipo de `supportedLocales` es ahora inferido correctamente por TypeScript y Zod.
  languages: z.record(z.enum(supportedLocales), z.string()),
});

export const LanguageSwitcherLocaleSchema = z.object({
  languageSwitcher: LanguageSwitcherContentSchema.optional(),
});
