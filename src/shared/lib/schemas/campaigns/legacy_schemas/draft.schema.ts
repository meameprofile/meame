// RUTA: src/shared/lib/schemas/campaigns/legacy_schemas/draft.schema.ts
/**
 * @file draft.schema.ts
 * @description SSoT para los schemas que componen un CampaignDraft (Legacy).
 * @version 2.0.0 (i18n & Zod Contract Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
// --- [INICIO DE CORRECCIÓN ARQUITECTÓNICA v2.0.0] ---
import { supportedLocales } from "@/shared/lib/i18n/i18n.config";
// --- [FIN DE CORRECCIÓN ARQUITECTÓNICA v2.0.0] ---

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

// --- [INICIO DE CORRECCIÓN DE CONTRATO ZOD v2.0.0] ---
const SectionContentSchema = z.record(
  z.enum(supportedLocales),
  LocaleContentSchema.optional()
);
// --- [FIN DE CORRECCIÓN DE CONTRATO ZOD v2.0.0] ---

export const ContentDataSchema = z.record(z.string(), SectionContentSchema);
