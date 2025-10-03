// lib/schemas/components/content-block.schema.ts
/**
 * @file content-block.schema.ts
 * @description SSoT para el contrato de datos de bloques de contenido genéricos.
 *              Este es el schema reutilizable para cualquier contenido textual estructurado.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

/**
 * @const ContentBlockSchema
 * @description Valida un único bloque de contenido, que puede ser de varios tipos.
 */
export const ContentBlockSchema = z.object({
  type: z.enum(["h2", "p"]), // Ampliable en el futuro (ej. "blockquote", "ul")
  text: z
    .string()
    .min(1, "El texto de un bloque de contenido no puede estar vacío."),
});

/**
 * @type ContentBlock
 * @description Infiere el tipo TypeScript para un único bloque de contenido.
 */
export type ContentBlock = z.infer<typeof ContentBlockSchema>;

/**
 * @const ContentBlocksSchema
 * @description Valida un array de bloques de contenido.
 */
export const ContentBlocksSchema = z.array(ContentBlockSchema);

/**
 * @type ContentBlocks
 * @description Infiere el tipo TypeScript para un array de bloques de contenido.
 *              Este es el tipo que consumirán los componentes renderizadores.
 */
export type ContentBlocks = z.infer<typeof ContentBlocksSchema>;
