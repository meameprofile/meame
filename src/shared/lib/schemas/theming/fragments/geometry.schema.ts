// lib/schemas/theming/fragments/geometry.schema.ts
/**
 * @file geometry.schema.ts
 * @description SSoT para el contrato de datos de un fragmento de geometría.
 *              Expandido para incluir grosor de bordes y espaciado general.
 * @version 2.0.0 (Granular Geometry & Spacing)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import { logger } from "@/shared/lib/logging";

logger.trace(
  "[Schema] Definiendo el contrato para fragmentos de geometría (v2.0 - Granular)..."
);

/**
 * @const GeometryObjectSchema
 * @description Valida el objeto `geometry` interno. Ahora incluye más propiedades de geometría y espaciado.
 */
const GeometryObjectSchema = z.object({
  "--radius": z.string().optional(),
  "--border-width": z.string().optional(), // <-- NUEVO: Grosor de borde
  "--space": z.string().optional(), // <-- NUEVO: Unidad base de espaciado (ej. 0.25rem)
  "--input-height": z.string().optional(), // <-- NUEVO: Altura de inputs
  // Podemos añadir más aquí si es necesario (shadow-offset, etc.)
  "--border": z.string().optional(), // Para compatibilidad con algunos componentes
  "--input": z.string().optional(), // Para compatibilidad con algunos componentes
  "--ring": z.string().optional(), // Para compatibilidad con algunos componentes
});

/**
 * @const GeometryFragmentSchema
 * @description El schema principal para un archivo de fragmento de geometría.
 */
export const GeometryFragmentSchema = z.object({
  geometry: GeometryObjectSchema,
});

/**
 * @type GeometryFragment
 * @description Tipo inferido a partir del schema, representa un fragmento de
 *              geometría validado.
 */
export type GeometryFragment = z.infer<typeof GeometryFragmentSchema>;
