// RUTA: src/shared/lib/schemas/theming/assembled-theme.schema.ts
/**
 * @file assembled-theme.schema.ts
 * @description SSoT para el contrato de datos de un objeto de tema final y ensamblado.
 *              v4.0.0 (Strict Layout Contract & Surgical Partial): Refactorizado para
 *              aplicar `.deepPartial()` solo a los fragmentos de estilo, manteniendo
 *              un contrato estricto para la propiedad `layout`.
 * @version 4.1.0 (Elite Documentation & Observability)
 *@author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

import { logger } from "@/shared/lib/logging";

import { ColorsFragmentSchema } from "./fragments/colors.schema";
import { FontsFragmentSchema } from "./fragments/fonts.schema";
import { GeometryFragmentSchema } from "./fragments/geometry.schema";

// --- Pilar III (Observabilidad): Se traza la carga del módulo ---
logger.trace(
  "[Schema] Definiendo el contrato para el tema ensamblado final (v4.1)..."
);

/**
 * @const LayoutSchema
 * @description Define un contrato estricto para la propiedad `layout` del tema.
 *              Esta parte del tema NO es opcional si está presente.
 * @private
 */
const LayoutSchema = z
  .object({
    sections: z.array(z.object({ name: z.string() })),
  })
  .optional();

/**
 * @const AssembledThemeSchema
 * @description El schema soberano para un tema de campaña completamente ensamblado.
 *
 * @architecture_note (Pilar II - Contrato Estricto)
 * Este schema utiliza `.deepPartial()` de forma deliberada y quirúrgica sobre
 * los fragmentos de estilo (`colors`, `fonts`, `geometry`). Esto proporciona
 * flexibilidad durante el ensamblaje del tema, donde algunos fragmentos
 * pueden estar ausentes.
 *
 * **¡GUARDIÁN DE RESILIENCIA PARA DESARROLLADORES!**
 * Al consumir un tipo `AssembledTheme`, NUNCA asuma que una propiedad de estilo anidada
 * existe. SIEMPRE utilice encadenamiento opcional (`?.`) o guardias de tipo para
 * acceder a las propiedades y evitar errores de `TypeError` en tiempo de ejecución.
 *
 * @example
 * // ❌ Incorrecto (puede fallar en tiempo de ejecución)
 * const primaryColor = theme.colors.primary;
 *
 * // ✅ Correcto (seguro y resiliente)
 * const primaryColor = theme.colors?.primary;
 */
export const AssembledThemeSchema = z
  .object({
    ...ColorsFragmentSchema.shape,
    ...FontsFragmentSchema.shape,
    ...GeometryFragmentSchema.shape,
  })
  .deepPartial()
  .extend({
    // La propiedad `layout` se mantiene con su contrato estricto.
    layout: LayoutSchema,
  });

/**
 * @type AssembledTheme
 * @description Infiere el tipo TypeScript para un tema ensamblado.
 * @see AssembledThemeSchema para advertencias importantes sobre el consumo seguro de este tipo.
 */
export type AssembledTheme = z.infer<typeof AssembledThemeSchema>;
