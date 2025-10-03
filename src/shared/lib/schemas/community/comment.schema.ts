// shared/lib/schemas/community/comment.schema.ts
/**
 * @file comment.schema.ts
 * @description SSoT para el contrato de datos de la entidad Comentario.
 *              Define la estructura para un documento en la colección 'comments' de MongoDB.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

/**
 * @const CommentSchema
 * @description El schema principal y soberano para un comentario en nuestro ecosistema.
 */
export const CommentSchema = z.object({
  // --- Metadatos de Identificación ---
  commentId: z.string().cuid2(),
  articleId: z
    .string()
    .cuid2()
    .describe("ID del artículo de CogniRead al que pertenece."),

  // --- Datos del Autor (Denormalizados para performance) ---
  userId: z
    .string()
    .describe("ID del usuario de Supabase que creó el comentario."),
  authorName: z.string().min(1, "El nombre del autor es requerido."),
  authorAvatarUrl: z
    .string()
    .url()
    .optional()
    .describe("URL del avatar del autor."),

  // --- Contenido y Estructura ---
  commentText: z
    .string()
    .min(1, "El comentario no puede estar vacío.")
    .max(2000),
  parentId: z
    .string()
    .cuid2()
    .nullable()
    .default(null)
    .describe("ID del comentario padre para respuestas anidadas."),

  // --- Timestamps ---
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/**
 * @type Comment
 * @description Infiere el tipo TypeScript para un comentario completo.
 */
export type Comment = z.infer<typeof CommentSchema>;
// shared/lib/schemas/community/comment.schema.ts
