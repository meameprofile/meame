// lib/schemas/theming/fragments/fonts.schema.ts
/**
 * @file fonts.schema.ts
 * @description SSoT para el contrato de datos de un fragmento de tipografía.
 *              Expandido para incluir tamaños de fuente, pesos, alturas de línea y espaciado de letras.
 * @version 2.0.0 (Granular Typography)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import { logger } from "@/shared/lib/logging";

logger.trace(
  "[Schema] Definiendo el contrato para fragmentos de tipografía (v2.0 - Granular)..."
);

/**
 * @const FontsObjectSchema
 * @description Valida el objeto `fonts` interno. Ahora incluye más propiedades de tipografía.
 */
const FontsObjectSchema = z.object({
  sans: z.string().optional(),
  serif: z.string().optional(),
  mono: z.string().optional(),
  // Tamaños de fuente (text-xs, text-sm, etc.)
  "--text-xs": z.string().optional(),
  "--text-sm": z.string().optional(),
  "--text-base": z.string().optional(),
  "--text-lg": z.string().optional(),
  "--text-xl": z.string().optional(),
  "--text-2xl": z.string().optional(),
  // Pesos de fuente (font-light, font-bold, etc.)
  "--font-weight-light": z.string().optional(),
  "--font-weight-normal": z.string().optional(),
  "--font-weight-medium": z.string().optional(),
  "--font-weight-semibold": z.string().optional(),
  "--font-weight-bold": z.string().optional(),
  // Alturas de línea (leading-none, leading-tight, etc.)
  "--leading-none": z.string().optional(),
  "--leading-tight": z.string().optional(),
  "--leading-snug": z.string().optional(),
  "--leading-normal": z.string().optional(),
  "--leading-relaxed": z.string().optional(),
  "--leading-loose": z.string().optional(),
  // Espaciado de letras (tracking-tighter, tracking-wide, etc.)
  "--tracking-tighter": z.string().optional(),
  "--tracking-tight": z.string().optional(),
  "--tracking-normal": z.string().optional(),
  "--tracking-wide": z.string().optional(),
});

/**
 * @const FontsFragmentSchema
 * @description El schema principal para un archivo de fragmento de fuentes.
 */
export const FontsFragmentSchema = z.object({
  fonts: FontsObjectSchema,
});

/**
 * @type FontsFragment
 * @description Tipo inferido a partir del schema, representa un fragmento de
 *              tipografía validado.
 */
export type FontsFragment = z.infer<typeof FontsFragmentSchema>;
