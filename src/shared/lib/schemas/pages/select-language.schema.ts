// RUTA: src/shared/lib/schemas/pages/select-language.schema.ts
/**
 * @file select-language.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n de la página de selección de idioma.
 * @version 4.0.0 (i18n & Zod Contract Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
// --- [INICIO DE CORRECCIÓN ARQUITECTÓNICA v4.0.0] ---
import { supportedLocales } from "@/shared/lib/i18n/i18n.config";
// --- [FIN DE CORRECCIÓN ARQUITECTÓNICA v4.0.0] ---

export const SelectLanguagePageContentSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  // --- [INICIO DE CORRECCIÓN DE CONTRATO ZOD v4.0.0] ---
  languages: z.record(z.enum(supportedLocales), z.string()),
  // --- [FIN DE CORRECCIÓN DE CONTRATO ZOD v4.0.0] ---
});

export const SelectLanguagePageLocaleSchema = z.object({
  selectLanguage: SelectLanguagePageContentSchema.optional(),
});

export type SelectLanguagePageContent = z.infer<
  typeof SelectLanguagePageContentSchema
>;
