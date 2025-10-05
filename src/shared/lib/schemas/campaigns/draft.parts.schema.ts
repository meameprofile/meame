// RUTA: src/shared/lib/schemas/campaigns/draft.parts.schema.ts
/**
 * @file draft.parts.schema.ts
 * @description SSoT para los schemas atómicos que componen un CampaignDraft.
 *              v3.0.0 (i18n & Zod Contract Alignment): Alineado con la SSoT de i18n
 *              y corregida la aserción de tipo para `z.enum`, resolviendo TS2769.
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
// --- [INICIO DE CORRECCIÓN ARQUITECTÓNICA v3.0.0] ---
// Se corrige la ruta de importación para apuntar a la SSoT de configuración.
import { supportedLocales } from "@/shared/lib/i18n/i18n.config";
// --- [FIN DE CORRECCIÓN ARQUITECTÓNICA v3.0.0] ---
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

// --- [INICIO DE CORRECCIÓN DE CONTRATO ZOD v3.0.0] ---
// Se elimina la aserción de tipo `as [string, ...string[]]`. La constante `supportedLocales`
// ahora tiene el tipo correcto `readonly [string, ...string[]]` inferido desde su SSoT.
const SectionContentSchema = z.record(
  z.enum(supportedLocales),
  LocaleContentSchema.optional()
);
// --- [FIN DE CORRECCIÓN DE CONTRATO ZOD v3.0.0] ---

export const ContentDataSchema = z.record(z.string(), SectionContentSchema);
