// RUTA: src/shared/lib/actions/cogniread/index.ts
/**
 * @file index.ts (Barrel File)
 * @description Fachada pública para las Server Actions del dominio Cogniread.
 *              v3.0.0 (Holistic Export & Naming Convention Fix): Se alinea la
 *              exportación con el nombre de función refactorizado `getAllArticlesAction`
 *              y se re-exportan todos los miembros para una integridad modular completa.
 * @version 3.0.0
 * @author L.I.A. Legacy
 */
"use server";

import { createOrUpdateArticleAction } from "./createOrUpdateArticle.action";
import { getAllArticlesAction } from "./getAllArticles.action";
import { getArticleByIdAction } from "./getArticleById.action";
import { getArticleBySlugAction } from "./getArticleBySlug.action";
import { getCommentsByArticleIdAction } from "./getCommentsByArticleId.action";
import { postCommentAction } from "./postComment.action";
import { getArticlesIndexAction } from "./getArticlesIndex.action";
import { getArticlesByIdsAction } from "./getArticlesByIds.action";
import { extractStudyDnaAction } from "./extractStudyDna.action";

// Se re-exportan todas las acciones del dominio para proporcionar una única
// fuente de verdad para los consumidores de esta API.
export {
  createOrUpdateArticleAction,
  getAllArticlesAction, // <-- CORRECCIÓN APLICADA AQUÍ
  getArticleByIdAction,
  getArticleBySlugAction,
  getCommentsByArticleIdAction,
  postCommentAction,
  getArticlesIndexAction,
  getArticlesByIdsAction,
  extractStudyDnaAction,
  getAllArticlesAction as getPublishedArticlesAction,
};
