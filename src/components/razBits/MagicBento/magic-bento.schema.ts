// RUTA: src/components/razBits/MagicBento/magic-bento.schema.ts
/**
 * @file magic-bento.schema.ts
 * @description SSoT para el contrato de datos del componente MagicBento, ahora
 *              con soporte para navegación y contratos de tipo explícitos.
 * @version 2.1.0 (Navigable & Type-Safe)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

// Contrato para una única tarjeta dentro de la cuadrícula, ahora con capacidad de enlace.
export const BentoCardSchema = z.object({
  title: z.string(),
  description: z.string(),
  label: z.string(),
  href: z.string().optional(), // <-- PROPIEDAD SOBERANA AÑADIDA
});

// Pilar II: Se exporta explícitamente el tipo inferido para un consumo seguro.
export type BentoCardData = z.infer<typeof BentoCardSchema>;

// Contrato para el objeto de configuración de los efectos visuales
export const MagicBentoConfigSchema = z.object({
  textAutoHide: z.boolean().default(true),
  enableStars: z.boolean().default(true),
  enableSpotlight: z.boolean().default(true),
  enableBorderGlow: z.boolean().default(true),
  disableAnimations: z.boolean().default(false),
  spotlightRadius: z.number().default(300),
  particleCount: z.number().default(12),
  enableTilt: z.boolean().default(false),
  glowColor: z.string().default("primary"), // Clave de color semántica
  clickEffect: z.boolean().default(true),
  enableMagnetism: z.boolean().default(true),
});

// Define la clave de nivel superior para el diccionario i18n
export const MagicBentoLocaleSchema = z.object({
  magicBento: z
    .object({
      config: MagicBentoConfigSchema,
      cards: z.array(BentoCardSchema),
    })
    .optional(),
});
