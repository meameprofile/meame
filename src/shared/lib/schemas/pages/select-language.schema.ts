// RUTA: src/shared/lib/schemas/pages/select-language.schema.ts
/**
 * @file select-language.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n de la página de selección de idioma.
 * @version 5.0.0 (Routing Contract Alignment)
 * @author L.I.A. Legacy
 */
import { z } from "zod";
import { ROUTING_LOCALES } from "@/shared/lib/i18n/i18n.config"; // <-- CONTRATO CORREGIDO

export const SelectLanguagePageContentSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  languages: z.record(z.enum(ROUTING_LOCALES), z.string()), // <-- CONSUMO DE SSoT CORREGIDO
});

export const SelectLanguagePageLocaleSchema = z.object({
  selectLanguage: SelectLanguagePageContentSchema.optional(),
});

export type SelectLanguagePageContent = z.infer<
  typeof SelectLanguagePageContentSchema
>;
