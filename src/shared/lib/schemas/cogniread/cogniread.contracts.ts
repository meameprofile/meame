// RUTA: src/shared/lib/schemas/cogniread/cogniread.contracts.ts
/**
 * @file cogniread.contracts.ts
 * @description Contrato de Tipos Atómico y Soberano para el Dominio CogniRead.
 *              Esta es la SSoT para todas las formas de datos de la base de
 *              datos relacionadas con CogniRead y la comunidad.
 * @version 3.0.0 (Structural Integrity Restoration)
 * @author L.I.A. Legacy
 */
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/shared/lib/supabase/database.types";

// --- CONTRATOS PARA LA TABLA 'cogniread_articles' ---

/**
 * @type CogniReadArticleRow
 * @description Representa la forma de una fila completa de la tabla `cogniread_articles`.
 *              Es el contrato para los datos en crudo que se leen de la base de datos.
 */
export type CogniReadArticleRow = Tables<"cogniread_articles">;

/**
 * @type CogniReadArticleInsert
 * @description Representa la forma de un objeto para crear un nuevo artículo.
 *              Es el contrato para las operaciones de `insert()`.
 */
export type CogniReadArticleInsert = TablesInsert<"cogniread_articles">;

/**
 * @type CogniReadArticleUpdate
 * @description Representa la forma de un objeto para actualizar un artículo existente.
 *              Es el contrato para las operaciones de `update()`.
 */
export type CogniReadArticleUpdate = TablesUpdate<"cogniread_articles">;

// --- CONTRATOS PARA LA TABLA 'community_comments' ---

/**
 * @type CommunityCommentRow
 * @description Representa la forma de una fila completa de la tabla `community_comments`.
 */
export type CommunityCommentRow = Tables<"community_comments">;

/**
 * @type CommunityCommentInsert
 * @description Representa la forma de un objeto para crear un nuevo comentario.
 */
export type CommunityCommentInsert = TablesInsert<"community_comments">;

/**
 * @type CommunityCommentUpdate
 * @description Representa la forma de un objeto para actualizar un comentario existente.
 */
export type CommunityCommentUpdate = TablesUpdate<"community_comments">;
