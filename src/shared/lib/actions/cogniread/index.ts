// RUTA: src/shared/lib/actions/cogniread/index.ts
/**
 * @file index.ts (Barrel File)
 * @description Fachada pública para las Server Actions del dominio Cogniread.
 * @version 5.0.0 (Explicit Export Refactor): Refactorizado para usar importaciones
 *              y exportaciones nombradas explícitas, resolviendo el error crítico de build.
 * @version 5.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

// Se importan explícitamente SOLO las funciones de acción de cada módulo.
import { createOrUpdateArticleAction } from "./createOrUpdateArticle.action";
import { extractStudyDnaAction } from "./extractStudyDna.action";
import { getAllArticlesAction } from "./getAllArticles.action";
import { getArticleByIdAction } from "./getArticleById.action";
import { getArticleBySlugAction } from "./getArticleBySlug.action";
import { getArticlesByIdsAction } from "./getArticlesByIds.action";
import { getArticlesIndexAction } from "./getArticlesIndex.action";
import { getCommentsByArticleIdAction } from "./getCommentsByArticleId.action";
import { getPublishedArticlesAction } from "./getPublishedArticles.action";
import { postCommentAction } from "./postComment.action";

// Se re-exportan las funciones importadas en un único objeto.
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
