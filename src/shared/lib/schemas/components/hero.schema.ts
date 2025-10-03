// RUTA: src/shared/lib/schemas/components/hero.schema.ts
/**
 * @file hero.schema.ts
 * @description SSoT para el contrato de datos del componente Hero.
 * @version 4.0.0 (BAVI Integration)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const HeroContentSchema = z.object({
  title: z.string().min(1, "El título es requerido."),
  subtitle: z.string().min(1, "El subtítulo es requerido."),
  // --- MEJORA ARQUITECTÓNICA: Se añade el vínculo a la BAVI ---
  backgroundImageAssetId: z
    .string()
    .optional()
    .describe("ID del activo en la BAVI para la imagen de fondo."),
});

export const HeroLocaleSchema = z.object({
  hero: HeroContentSchema.optional(),
});
