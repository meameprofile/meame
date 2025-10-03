// RUTA: src/shared/lib/schemas/components/header.schema.ts
/**
 * @file header.schema.ts
 * @description SSoT para el contrato de datos del Header. Resuelve la
 *              definición de tipo recursiva para sub-enlaces anidados y se alinea
 *              con la arquitectura de autenticación actual.
 * @version 7.1.0 (Sign Up Button Integration & Elite Compliance)
 *@author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

/**
 * @const baseNavLinkSchema
 * @description Define la estructura base para un enlace de navegación, sin la propiedad recursiva.
 * @private
 */
const baseNavLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

/**
 * @type NavLink
 * @description Define el tipo TypeScript para un enlace de navegación, incluyendo la
 *              posibilidad de sub-enlaces anidados.
 */
type NavLink = z.infer<typeof baseNavLinkSchema> & {
  subLinks?: NavLink[];
};

/**
 * @const NavLinkSchema
 * @description Schema de Zod para un enlace de navegación. Utiliza `z.lazy()` para
 *              manejar correctamente la definición de tipo recursiva para `subLinks`.
 */
const NavLinkSchema: z.ZodType<NavLink> = baseNavLinkSchema.extend({
  subLinks: z.lazy(() => z.array(NavLinkSchema)).optional(),
});

export type { NavLink };

/**
 * @const HeaderLocaleSchema
 * @description Valida la estructura del contenido del Header para un único locale.
 */
export const HeaderLocaleSchema = z.object({
  header: z
    .object({
      logoUrl: z.string().startsWith("/"),
      logoAlt: z.string(),
      navLinks: z.array(NavLinkSchema),
      // --- REFACTORIZACIÓN DE CONTRATO ---
      // ctaButton ha sido reemplazado por signUpButton para alinearse con la lógica de UI actual.
      signUpButton: z.object({
        label: z.string(),
      }),
    })
    .optional(),
});

/**
 * @const HeaderI18nSchema
 * @description Valida la estructura completa del archivo `header.i18n.json`.
 */
export const HeaderI18nSchema = z.object({
  "es-ES": HeaderLocaleSchema,
  "pt-BR": HeaderLocaleSchema,
  "en-US": HeaderLocaleSchema,
  "it-IT": HeaderLocaleSchema,
});
