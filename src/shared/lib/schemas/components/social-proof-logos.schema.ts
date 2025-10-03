// RUTA: src/shared/lib/schemas/components/social-proof-logos.schema.ts
/**
 * @file social-proof-logos.schema.ts
 * @description SSoT para el contrato de datos del componente SocialProofLogos.
 * @version 5.0.0 (BAVI 2.0 Asset ID Migration)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

const LogoSchema = z.object({
  assetId: z
    .string()
    .min(1, "El assetId es requerido.")
    .describe(
      "El ID del activo según el Sistema de Nomenclatura (SNIA) de la BAVI."
    ),
  alt: z.string().min(1, "El texto alternativo del logo es requerido."),
});

export type Logo = z.infer<typeof LogoSchema>;

export const SocialProofLogosContentSchema = z.object({
  title: z.string(),
  logos: z.array(LogoSchema),
});

export const SocialProofLogosLocaleSchema = z.object({
  socialProofLogos: SocialProofLogosContentSchema.optional(),
});
