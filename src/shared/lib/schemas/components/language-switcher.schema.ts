// RUTA: src/shared/lib/schemas/components/language-switcher.schema.ts
/**
 * @file language-switcher.schema.ts
 * @description SSoT para el contrato i18n del ecosistema de selección de idioma.
 *              v6.0.0 (Sovereign Path Restoration & Elite Compliance): Se corrige la ruta de
 *              importación para alinearse con la ACS y resolver errores de build.
 * @version 6.1.0 (Build Integrity Restoration)
 * @author L.I.A Legacy - Asistente de Refactorización
 */
import { z } from "zod";
// --- [INICIO DE RESTAURACIÓN DE INTEGRIDAD DE BUILD v6.1.0] ---
// Se importa la constante correcta (`ROUTING_LOCALES`) desde la SSoT de configuración
// para resolver la dependencia rota que causaba el fallo de build.
import { ROUTING_LOCALES } from "@/shared/lib/i18n/i18n.config";
// --- [FIN DE RESTAURACIÓN DE INTEGRIDAD DE BUILD v6.1.0] ---

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
  // La validación ahora utiliza la constante correcta, restaurando la funcionalidad.
  languages: z.record(z.enum(ROUTING_LOCALES), z.string()),
});

export const LanguageSwitcherLocaleSchema = z.object({
  languageSwitcher: LanguageSwitcherContentSchema.optional(),
});
