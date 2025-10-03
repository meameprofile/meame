// components/razBits/MagicBento/magic-bento.schema.ts
/**
 * @file magic-bento.schema.ts
 * @description Esquema de Zod para el contenido y configuración del componente MagicBento.
 * @version 1.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

// Contrato para una única tarjeta dentro de la cuadrícula
export const BentoCardSchema = z.object({
  title: z.string(),
  description: z.string(),
  label: z.string(),
});

// Exporta el tipo para ser usado en el componente
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
// components/razBits/MagicBento/magic-bento.schema.ts
