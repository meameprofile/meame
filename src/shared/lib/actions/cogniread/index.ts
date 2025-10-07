// RUTA: src/shared/lib/actions/cogniread/index.ts
/**
 * @file index.ts (Barrel File)
 * @description Fachada pública para las Server Actions del dominio Cogniread.
 *              v5.0.0 (Explicit Export Refactor): Refactorizado para usar importaciones
 *              y exportaciones nombradas explícitas, resolviendo el error crítico de build
 *              "Only async functions are allowed to be exported in a 'use server' file".
 * @version 5.0.0
 * @author L.I.A. Legacy
 */
"use server";

// Se importan explícitamente SOLO las funciones de acción de cada módulo.
// Cualquier tipo o constante exportada desde estos archivos será ignorada.
import { createOrUpdateArticleAction } from "./createOrUpdateArticle.action";
import { getAllArticlesAction } from "./getAllArticles.action";
import { getArticleByIdAction } from "./getArticleById.action";
import { getArticleBySlugAction } from "./getArticleBySlug.action";
import { getCommentsByArticleIdAction } from "./getCommentsByArticleId.action";
import { postCommentAction } from "./postComment.action";
import { getArticlesIndexAction } from "./getArticlesIndex.action";
import { getArticlesByIdsAction } from "./getArticlesByIds.action";
import { extractStudyDnaAction } from "./extractStudyDna.action";
import { getPublishedArticlesAction } from "./getPublishedArticles.action";

// Se re-exportan las funciones importadas en un único objeto.
// Esto cumple con el contrato de "use server" al exportar solo funciones.
export {
  createOrUpdateArticleAction,
  getAllArticlesAction,
  getArticleByIdAction,
  getArticleBySlugAction,
  getCommentsByArticleIdAction,
  postCommentAction,
  getArticlesIndexAction,
  getArticlesByIdsAction,
  extractStudyDnaAction,
  getPublishedArticlesAction,
};
