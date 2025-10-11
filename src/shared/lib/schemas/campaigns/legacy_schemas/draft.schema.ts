// RUTA: src/shared/lib/schemas/campaigns/legacy_schemas/draft.schema.ts
/**
 * @file draft.schema.ts
 * @description SSoT para los schemas que componen un CampaignDraft (Legacy).
 * @version 2.1.0 (i18n Contract Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

// --- [INICIO DE REFACTORIZACIÓN DE CONTRATO] ---
import { ROUTING_LOCALES as supportedLocales } from "@/shared/lib/i18n/i18n.config";
// --- [FIN DE REFACTORIZACIÓN DE CONTRATO] ---

export const HeaderConfigSchema = z.object({
  useHeader: z.boolean(),
  componentName: z.string().nullable(),
  logoPath: z.string().nullable(),
});

export const FooterConfigSchema = z.object({
  useFooter: z.boolean(),
  componentName: z.string().nullable(),
});

export const LayoutConfigSchema = z.array(z.object({ name: z.string() }));

export const ThemeConfigSchema = z.object({
  colorPreset: z.string().nullable(),
  fontPreset: z.string().nullable(),
  radiusPreset: z.string().nullable(),
});

const LocaleContentSchema = z.record(z.string(), z.unknown());

const SectionContentSchema = z.record(
  z.enum(supportedLocales),
  LocaleContentSchema.optional()
);

export const ContentDataSchema = z.record(z.string(), SectionContentSchema);
