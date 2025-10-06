// RUTA: src/shared/lib/actions/cogniread/index.ts
/**
 * @file index.ts (Barrel File)
 * @description Fachada pública para las Server Actions del dominio Cogniread.
 * @version 4.0.0 (Holistic & Correct Export)
 * @author L.I.A. Legacy
 */
"use server";

// Se importan TODAS las acciones soberanas del dominio
export * from "./createOrUpdateArticle.action";
export * from "./getAllArticles.action";
export * from "./getArticleById.action";
export * from "./getArticleBySlug.action";
export * from "./getCommentsByArticleId.action";
export * from "./postComment.action";
export * from "./getArticlesIndex.action";
export * from "./getArticlesByIds.action";
export * from "./extractStudyDna.action";

// --- [INICIO DE CORRECCIÓN DE EXPORTACIÓN SOBERANA] ---
// Se exporta la función correcta desde su propio módulo.
export * from "./getPublishedArticles.action";
// --- [FIN DE CORRECCIÓN DE EXPORTACIÓN SOBERANA] ---
