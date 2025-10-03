// RUTA: lib/schemas/components/toggle-theme.schema.ts

/**
 * @file toggle-theme.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n del componente ToggleTheme.
 *              Define la estructura de todas las cadenas de texto requeridas para la UI del
 *              conmutador de tema, asegurando una internacionalización completa y robusta.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const ToggleThemeContentSchema = z.object({
  light: z.string().min(1),
  dark: z.string().min(1),
  system: z.string().min(1),
  toggleAriaLabel: z
    .string()
    .min(1, "La etiqueta ARIA es requerida para la accesibilidad."),
});

export const ToggleThemeLocaleSchema = z.object({
  toggleTheme: ToggleThemeContentSchema.optional(),
});
