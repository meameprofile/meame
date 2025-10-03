// RUTA: src/shared/lib/schemas/pages/select-language.schema.ts
/**
 * @file select-language.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n de la página de selección de idioma.
 * @version 3.0.0 (Sovereign Export Alignment)
 * @author L.I.A. Legacy
 */
import { z } from "zod";
import { supportedLocales } from "@/shared/lib/i18n/i18n.config";

export const SelectLanguagePageContentSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  languages: z.record(z.enum(supportedLocales), z.string()),
});

// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
// Se exporta el schema de locale para su consumo en el ensamblador i18n.
export const SelectLanguagePageLocaleSchema = z.object({
  selectLanguage: SelectLanguagePageContentSchema.optional(),
});
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA] ---

export type SelectLanguagePageContent = z.infer<
  typeof SelectLanguagePageContentSchema
>;
