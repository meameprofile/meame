// RUTA: src/shared/hooks/campaign-suite/use-campaign-lifecycle.ts
/**
 * @file use-campaign-lifecycle.ts
 * @description Hook soberano para gestionar el ciclo de vida de la campaña.
 * @version 4.1.0 (Elite Code Hygiene & Dependency Pruning)
 * @author L.I.A. Legacy
 */
"use client";

import { useTransition, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCampaignDraftStore } from "@/shared/hooks/campaign-suite/use-campaign-draft-context.store";
import { routes } from "@/shared/lib/navigation";
import {
  publishCampaignAction,
  packageCampaignAction,
  deleteDraftAction,
} from "@/shared/lib/actions/campaign-suite";
import { useCelebrationStore } from "@/shared/lib/stores/use-celebration.store";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";
import { logger } from "@/shared/lib/logging";

export function useCampaignLifecycle(locale: Locale, draft: CampaignDraft) {
  const traceId = useMemo(
    () => logger.startTrace("useCampaignLifecycle_v4.1"),
    []
  );
  useEffect(() => {
    logger.info("[Lifecycle Hook] Montado y listo para orquestar acciones.", {
      traceId,
    });
    return () => {
      logger.info("[Lifecycle Hook] Desmontado. Finalizando traza.", {
        traceId,
      });
      logger.endTrace(traceId);
    };
  }, [traceId]);

  const router = useRouter();
  const resetDraft = useCampaignDraftStore((s) => s.resetDraft);
  const celebrate = useCelebrationStore((s) => s.celebrate);
  const [isPublishing, startPublishTransition] = useTransition();
  const [isPackaging, startPackageTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  const onPublish = useCallback(() => {
    const actionTraceId = logger.startTrace("lifecycle.onPublish");
    logger.startGroup(
      "[Lifecycle Action] Iniciando publicación...",
      actionTraceId
    );
    startPublishTransition(async () => {
      const result = await publishCampaignAction(draft);
      if (result.success) {
        celebrate();
        toast.success("¡Campaña Publicada!", {
          description: `Variante ${result.data.variantId} está en vivo.`,
        });
        logger.success("[Lifecycle] Publicación completada.", {
          traceId: actionTraceId,
          result: result.data,
        });
      } else {
        toast.error("Fallo en la Publicación", { description: result.error });
        logger.error("[Lifecycle] Fallo en la publicación.", {
          error: result.error,
          traceId: actionTraceId,
        });
      }
      logger.endGroup();
      logger.endTrace(actionTraceId);
    });
  }, [draft, celebrate]);

  const onPackage = useCallback(() => {
    const actionTraceId = logger.startTrace("lifecycle.onPackage");
    logger.startGroup(
      "[Lifecycle Action] Iniciando empaquetado...",
      actionTraceId
    );
    startPackageTransition(async () => {
      const result = await packageCampaignAction(draft);
      if (result.success) {
        toast.info("Descarga iniciada", {
          description: "Tu paquete .zip se está descargando.",
        });
        window.open(result.data.downloadUrl, "_blank");
        logger.success("[Lifecycle] Empaquetado completado.", {
          traceId: actionTraceId,
        });
      } else {
        toast.error("Fallo en el Empaquetado", { description: result.error });
        logger.error("[Lifecycle] Fallo en el empaquetado.", {
          error: result.error,
          traceId: actionTraceId,
        });
      }
      logger.endGroup();
      logger.endTrace(actionTraceId);
    });
  }, [draft]);

  const onDelete = useCallback(() => {
    const actionTraceId = logger.startTrace("lifecycle.onDelete");
    logger.startGroup(
      "[Lifecycle Action] Iniciando eliminación...",
      actionTraceId
    );
    startDeleteTransition(async () => {
      if (!draft.draftId) {
        const errorMsg = "No se puede eliminar un borrador sin ID.";
        toast.error("Error", { description: errorMsg });
        logger.error(`[Lifecycle] ${errorMsg}`, { traceId: actionTraceId });
        logger.endGroup();
        logger.endTrace(actionTraceId);
        return;
      }
      const result = await deleteDraftAction(draft.draftId);
      if (result.success) {
        resetDraft();
        toast.info("Borrador eliminado con éxito.");
        router.push(routes.creatorCampaignSuite.path({ locale }));
        router.refresh();
        logger.success(`[Lifecycle] Borrador ${draft.draftId} eliminado.`, {
          traceId: actionTraceId,
        });
      } else {
        toast.error("Error al eliminar el borrador", {
          description: result.error,
        });
        logger.error("[Lifecycle] Fallo al eliminar.", {
          error: result.error,
          traceId: actionTraceId,
        });
      }
      logger.endGroup();
      logger.endTrace(actionTraceId);
    });
  }, [draft.draftId, resetDraft, router, locale]);

  return {
    onPublish,
    onPackage,
    onDelete,
    isPublishing,
    isPackaging,
    isDeleting,
  };
}
