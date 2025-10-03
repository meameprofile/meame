// RUTA: src/shared/hooks/use-cogniread-cache.ts
/**
 * @file use-cogniread-cache.ts
 * @description Hook "cerebro" para la gestión de la caché de CogniRead.
 *              v5.1.0 (Elite Code Hygiene): Se corrige la declaración de
 *              'updatedLocalArticles' a 'const' para cumplir con las reglas
 *              de inmutabilidad y satisfacer el linter.
 * @version 5.1.0
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  getArticlesIndexAction,
  getArticlesByIdsAction,
} from "@/shared/lib/actions/cogniread";
import type { CogniReadArticle } from "@/shared/lib/schemas/cogniread/article.schema";
import { logger } from "@/shared/lib/logging";

const ARTICLE_CACHE_PREFIX = "cogniread_article_";
const INDEX_CACHE_KEY = "cogniread_articles_index";

type ArticleIndex = Record<string, string>; // articleId -> updatedAt

export function useCogniReadCache() {
  const [articles, setArticles] = useState<CogniReadArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const syncCache = useCallback(async () => {
    const traceId = logger.startTrace("useCogniReadCache.sync_v5.1");
    logger.startGroup("[CogniRead Cache] Iniciando sincronización v5.1...");

    try {
      let localIndex: ArticleIndex = {};
      const localArticles: CogniReadArticle[] = [];
      try {
        const storedIndex = localStorage.getItem(INDEX_CACHE_KEY);
        if (storedIndex) localIndex = JSON.parse(storedIndex);

        Object.keys(localIndex).forEach((id) => {
          const articleStr = localStorage.getItem(
            `${ARTICLE_CACHE_PREFIX}${id}`
          );
          if (articleStr) localArticles.push(JSON.parse(articleStr));
        });
        setArticles(localArticles);
        logger.traceEvent(
          traceId,
          `Se cargaron ${localArticles.length} artículos desde caché.`
        );
      } catch (e) {
        logger.warn("[Guardián] No se pudo cargar la caché local.", {
          error: e,
          traceId,
        });
      } finally {
        setIsLoading(false);
      }

      const remoteIndexResult = await getArticlesIndexAction();
      if (!remoteIndexResult.success) {
        throw new Error(
          `Fallo al obtener el índice remoto: ${remoteIndexResult.error}`
        );
      }
      const remoteIndex = remoteIndexResult.data;

      const idsToFetch: string[] = [];
      const allRemoteIds = new Set(Object.keys(remoteIndex));

      for (const id of allRemoteIds) {
        if (
          !localIndex[id] ||
          new Date(remoteIndex[id]) > new Date(localIndex[id])
        ) {
          idsToFetch.push(id);
        }
      }

      const idsToDelete = Object.keys(localIndex).filter(
        (id) => !allRemoteIds.has(id)
      );
      logger.traceEvent(traceId, "Índices comparados.", {
        toFetch: idsToFetch.length,
        toDelete: idsToDelete.length,
      });

      if (idsToFetch.length > 0) {
        const articlesToFetchResult = await getArticlesByIdsAction(idsToFetch);
        if (!articlesToFetchResult.success) {
          throw new Error(
            `Fallo al obtener artículos por ID: ${articlesToFetchResult.error}`
          );
        }
        const newArticles = articlesToFetchResult.data.articles;

        // --- [INICIO DE CORRECCIÓN DE HIGIENE DE CÓDIGO] ---
        // Se declara como 'const' ya que la referencia al array no se reasigna.
        // La lógica de actualización ya era inmutable.
        const updatedLocalArticles = [...localArticles];
        // --- [FIN DE CORRECCIÓN DE HIGIENE DE CÓDIGO] ---

        newArticles.forEach((newArticle) => {
          localStorage.setItem(
            `${ARTICLE_CACHE_PREFIX}${newArticle.articleId}`,
            JSON.stringify(newArticle)
          );
          const existingIndex = updatedLocalArticles.findIndex(
            (a) => a.articleId === newArticle.articleId
          );
          if (existingIndex > -1) {
            updatedLocalArticles[existingIndex] = newArticle;
          } else {
            updatedLocalArticles.push(newArticle);
          }
        });
        setArticles(updatedLocalArticles);
        toast.info(
          `Se han cargado ${newArticles.length} artículos nuevos o actualizados.`
        );
      }

      if (idsToDelete.length > 0) {
        idsToDelete.forEach((id) =>
          localStorage.removeItem(`${ARTICLE_CACHE_PREFIX}${id}`)
        );
        setArticles((prev) =>
          prev.filter((a) => !idsToDelete.includes(a.articleId))
        );
      }

      localStorage.setItem(INDEX_CACHE_KEY, JSON.stringify(remoteIndex));
      logger.success("[CogniRead Cache] Sincronización completada.", {
        traceId,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido.";
      logger.error("[Guardián] Fallo durante la sincronización de caché.", {
        error: errorMessage,
        traceId,
      });
    } finally {
      logger.endGroup();
      logger.endTrace(traceId);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      syncCache();
    }
  }, [syncCache]);

  return { articles, isLoading };
}
