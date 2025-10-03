// RUTA: components/razBits/LightRays/light-rays.schema.ts
/**
 * @file light-rays.schema.ts
 * @description Esquema de Zod para la configuración del componente LightRays.
 *              v1.1.0 (Resilient Contract): Refactorizado para que todas las
 *              propiedades de configuración sean opcionales, permitiendo a los
 *              componentes consumidores anular solo las propiedades necesarias.
 * @version 1.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const RaysOriginSchema = z.enum([
  "top-center",
  "top-left",
  "top-right",
  "right",
  "left",
  "bottom-center",
  "bottom-right",
  "bottom-left",
]);

export const LightRaysConfigSchema = z.object({
  raysOrigin: RaysOriginSchema.default("top-center").optional(),
  raysColor: z.string().default("primary").optional(),
  raysSpeed: z.number().min(0).default(1.5).optional(),
  lightSpread: z.number().min(0).default(0.8).optional(),
  rayLength: z.number().min(0).default(1.2).optional(),
  pulsating: z.boolean().default(false).optional(),
  fadeDistance: z.number().min(0).max(1).default(1.0).optional(),
  saturation: z.number().min(0).max(1).default(1.0).optional(),
  followMouse: z.boolean().default(true).optional(),
  mouseInfluence: z.number().min(0).max(1).default(0.1).optional(),
  noiseAmount: z.number().min(0).max(1).default(0.1).optional(),
  distortion: z.number().min(0).max(1).default(0.05).optional(),
});

export const LightRaysLocaleSchema = z.object({
  lightRays: LightRaysConfigSchema.optional(),
});
