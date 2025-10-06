// RUTA: src/shared/hooks/use-cogniread-cache.ts
/**
 * @file use-cogniread-cache.ts
 * @description Hook "cerebro" para la gestión de la caché de CogniRead.
 * @version 6.0.0 (Elite Observability & Resilience)
 * @author L.I.A. Legacy
 */
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
  const traceId = useMemo(
    () => logger.startTrace("useCogniReadCache_v6.0"),
    []
  );
  const [articles, setArticles] = useState<CogniReadArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const syncCache = useCallback(async () => {
    const syncTraceId = logger.startTrace("useCogniReadCache.sync");
    logger.startGroup(
      "[CogniRead Cache] Iniciando sincronización...",
      syncTraceId
    );

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
          syncTraceId,
          `Se cargaron ${localArticles.length} artículos desde caché local.`
        );
      } catch (e) {
        logger.warn("[Guardián] No se pudo cargar la caché local.", {
          error: e,
          traceId: syncTraceId,
        });
      } finally {
        setIsLoading(false);
      }

      const remoteIndexResult = await getArticlesIndexAction();
      if (!remoteIndexResult.success) throw new Error(remoteIndexResult.error);
      const remoteIndex = remoteIndexResult.data;
      logger.traceEvent(
        syncTraceId,
        `Índice remoto obtenido con ${Object.keys(remoteIndex).length} artículos.`
      );

      const idsToFetch = Object.keys(remoteIndex).filter(
        (id) =>
          !localIndex[id] ||
          new Date(remoteIndex[id]) > new Date(localIndex[id])
      );
      const idsToDelete = Object.keys(localIndex).filter(
        (id) => !remoteIndex[id]
      );
      logger.traceEvent(syncTraceId, "Índices comparados.", {
        toFetch: idsToFetch.length,
        toDelete: idsToDelete.length,
      });

      if (idsToFetch.length > 0) {
        const articlesToFetchResult = await getArticlesByIdsAction(idsToFetch);
        if (!articlesToFetchResult.success)
          throw new Error(articlesToFetchResult.error);
        const newArticles = articlesToFetchResult.data.articles;

        setArticles((prevArticles) => {
          const articlesMap = new Map(
            prevArticles.map((a) => [a.articleId, a])
          );
          newArticles.forEach((newArticle) => {
            articlesMap.set(newArticle.articleId, newArticle);
            localStorage.setItem(
              `${ARTICLE_CACHE_PREFIX}${newArticle.articleId}`,
              JSON.stringify(newArticle)
            );
          });
          return Array.from(articlesMap.values());
        });
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
        traceId: syncTraceId,
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Error desconocido.";
      logger.error("[Guardián] Fallo durante la sincronización de caché.", {
        error: msg,
        traceId: syncTraceId,
      });
    } finally {
      logger.endGroup();
      logger.endTrace(syncTraceId);
    }
  }, []);

  useEffect(() => {
    logger.info("[useCogniReadCache] Hook montado.", { traceId });
    if (typeof window !== "undefined") syncCache();
    return () => logger.endTrace(traceId);
  }, [syncCache, traceId]);

  return { articles, isLoading };
}
