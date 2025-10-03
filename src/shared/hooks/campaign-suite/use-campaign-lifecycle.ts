// RUTA: src/shared/hooks/campaign-suite/use-campaign-lifecycle.ts
/**
 * @file use-campaign-lifecycle.ts
 * @description Hook soberano para gestionar el ciclo de vida de la campaña.
 *              Forjado con observabilidad de élite, resiliencia y cumplimiento
 *              de los 8 Pilares de Calidad.
 * @version 4.0.0 (Elite Observability & Resilience)
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useTransition, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCampaignDraftStore } from "@/shared/lib/stores/campaign-draft.store";
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
    () => logger.startTrace("useCampaignLifecycle_v4.0"),
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
    logger.startGroup("[Lifecycle Action] Iniciando publicación...");
    startPublishTransition(async () => {
      logger.traceEvent(traceId, "Invocando publishCampaignAction...");
      const result = await publishCampaignAction(draft);
      if (result.success) {
        celebrate();
        toast.success("¡Campaña Publicada!", {
          description: `La variante con ID ${result.data.variantId} está ahora en vivo.`,
        });
        logger.success("[Lifecycle Action] Publicación completada con éxito.", {
          traceId,
          resultData: result.data,
        });
      } else {
        toast.error("Fallo en la Publicación", { description: result.error });
        logger.error("[Lifecycle Action] Fallo en la publicación.", {
          error: result.error,
          traceId,
        });
      }
      logger.endGroup();
    });
  }, [draft, celebrate, traceId]);

  const onPackage = useCallback(() => {
    logger.startGroup("[Lifecycle Action] Iniciando empaquetado...");
    startPackageTransition(async () => {
      logger.traceEvent(traceId, "Invocando packageCampaignAction...");
      const result = await packageCampaignAction(draft);
      if (result.success) {
        toast.info("Descarga iniciada", {
          description: "Tu paquete .zip se está descargando.",
        });
        window.open(result.data.downloadUrl, "_blank");
        logger.success("[Lifecycle Action] Empaquetado completado con éxito.", {
          traceId,
          downloadUrl: result.data.downloadUrl,
        });
      } else {
        toast.error("Fallo en el Empaquetado", { description: result.error });
        logger.error("[Lifecycle Action] Fallo en el empaquetado.", {
          error: result.error,
          traceId,
        });
      }
      logger.endGroup();
    });
  }, [draft, traceId]);

  const onDelete = useCallback(() => {
    logger.startGroup(
      "[Lifecycle Action] Iniciando eliminación de borrador..."
    );
    startDeleteTransition(async () => {
      if (!draft.draftId) {
        const errorMsg = "No se puede eliminar un borrador sin ID.";
        toast.error("Error", { description: errorMsg });
        logger.error(`[Lifecycle Action] ${errorMsg}`, { traceId });
        logger.endGroup();
        return;
      }
      logger.traceEvent(
        traceId,
        `Invocando deleteDraftAction para draft: ${draft.draftId}`
      );
      const result = await deleteDraftAction(draft.draftId);
      if (result.success) {
        resetDraft();
        toast.info("Borrador eliminado con éxito.");
        router.push(routes.creatorCampaignSuite.path({ locale }));
        router.refresh();
        logger.success(
          `[Lifecycle Action] Borrador ${draft.draftId} eliminado.`,
          { traceId }
        );
      } else {
        toast.error("Error al eliminar el borrador", {
          description: result.error,
        });
        logger.error("[Lifecycle Action] Fallo al eliminar el borrador.", {
          error: result.error,
          traceId,
        });
      }
      logger.endGroup();
    });
  }, [draft.draftId, resetDraft, router, locale, traceId]);

  return {
    onPublish,
    onPackage,
    onDelete,
    isPublishing,
    isPackaging,
    isDeleting,
  };
}
