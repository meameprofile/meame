// RUTA: src/shared/lib/schemas/campaigns/draft.parts.schema.ts
/**
 * @file draft.parts.schema.ts
 * @description SSoT para los schemas atómicos que componen un CampaignDraft.
 * @version 4.0.0 (Contract Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import { ROUTING_LOCALES as supportedLocales } from "@/shared/lib/i18n/i18n.config";
import { AssembledThemeSchema } from "@/shared/lib/schemas/theming/assembled-theme.schema";

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
  themeOverrides: AssembledThemeSchema.optional(),
});

const LocaleContentSchema = z.record(z.string(), z.unknown());

const SectionContentSchema = z.record(
  z.enum(supportedLocales),
  LocaleContentSchema.optional()
);

export const ContentDataSchema = z.record(z.string(), SectionContentSchema);
