// lib/schemas/theming/theme-parts.schema.ts
/**
 * @file theme-parts.schema.ts
 * @description SSoT para los schemas atómicos que componen un tema.
 *              Estos bloques de construcción son reutilizados para definir
 *              tanto los presets como los temas ensamblados.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import { sectionsConfig } from "@/shared/lib/config/sections.config";

const sectionNamesList = Object.keys(sectionsConfig) as [string, ...string[]];

export const ColorsSchema = z.object({
  background: z.string(),
  foreground: z.string(),
  card: z.string(),
  cardForeground: z.string(),
  popover: z.string(),
  popoverForeground: z.string(),
  primary: z.string(),
  primaryForeground: z.string(),
  secondary: z.string(),
  secondaryForeground: z.string(),
  muted: z.string(),
  mutedForeground: z.string(),
  accent: z.string(),
  accentForeground: z.string(),
  destructive: z.string(),
  destructiveForeground: z.string(),
});

export const FontsSchema = z.object({
  sans: z.string(),
  serif: z.string().optional(),
});

export const GeometrySchema = z.object({
  "--radius": z.string(),
  "--border": z.string().optional(),
  "--input": z.string().optional(),
  "--ring": z.string().optional(),
});

export const LayoutSchema = z.object({
  sections: z.array(z.object({ name: z.enum(sectionNamesList) })),
});

// Schemas para propiedades que generalmente vienen del tema base
export const OptionalThemePartsSchema = z.object({
  shadows: z.record(z.string()).optional(),
  animations: z.record(z.string()).optional(),
  backgrounds: z.record(z.string()).optional(),
  breakpoints: z.record(z.string()).optional(),
  spacing: z.record(z.string()).optional(),
});
// lib/schemas/theming/theme-parts.schema.ts
