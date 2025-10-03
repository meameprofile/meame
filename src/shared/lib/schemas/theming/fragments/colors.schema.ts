// lib/schemas/theming/fragments/colors.schema.ts
/**
 * @file colors.schema.ts
 * @description SSoT para el contrato de datos de un fragmento de paleta de colores.
 *              v2.0.0 (Dual-Mode Theming): Evoluciona el contrato para soportar
 *              paletas de colores explícitas para modo claro y oscuro.
 * @version 2.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import { logger } from "@/shared/lib/logging";

logger.trace("[Schema] Definiendo contrato para fragmentos de colores v2.0...");

/**
 * @const SemanticColorSchema
 * @description Define todas las claves de color semánticas requeridas.
 *              Ahora es la base para las paletas de modo claro y oscuro.
 */
const SemanticColorSchema = z.object({
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

/**
 * @const ColorsObjectSchema
 * @description Valida el objeto `colors` principal. Ahora contiene la paleta
 *              base (modo claro) y una paleta `dark` opcional para anulaciones.
 */
const ColorsObjectSchema = SemanticColorSchema.extend({
  dark: SemanticColorSchema.partial().optional(), // <-- OBJETO 'dark' OPCIONAL
});

/**
 * @const ColorsFragmentSchema
 * @description El schema principal para un archivo de fragmento de colores.
 */
export const ColorsFragmentSchema = z.object({
  colors: ColorsObjectSchema,
});

export type ColorsFragment = z.infer<typeof ColorsFragmentSchema>;
// lib/schemas/theming/fragments/colors.schema.ts
