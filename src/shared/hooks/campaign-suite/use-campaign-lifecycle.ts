// RUTA: src/shared/hooks/campaign-suite/use-campaign-lifecycle.ts
/**
 * @file use-campaign-lifecycle.ts
 * @description Hook "cerebro" y orquestador soberano para el ciclo de vida final de una campaña.
 *              Este aparato gestiona las acciones de mayor impacto: publicar, empaquetar
 *              y eliminar un borrador de campaña.
 *
 * @version 6.0.0 (Hyper-Granular Action Tracing & Elite Resilience)
 * @author L.I.A. Legacy
 *
 * @architecture_notes
 * - **Pilar I (Hiper-Atomización)**: Encapsula la lógica de las acciones finales,
 *   desacoplándolas completamente del componente de presentación `Step5Form`.
 * - **Pilar III (Observabilidad Profunda)**: Implementa un sistema de tracing de doble capa.
 *   Una traza principal monitorea el ciclo de vida del hook, mientras que cada acción
 *   (onPublish, onPackage, onDelete) genera su propia traza atómica, permitiendo un
 *   diagnóstico forense de cada operación individual.
 * - **Pilar VI (Documentación Soberana)**: Documentación exhaustiva que clarifica el rol
 *   crítico de cada función y su impacto en el estado de la aplicación.
 * - **Pilar VIII (Resiliencia)**: Utiliza `try/finally` dentro de las transiciones
 *   para garantizar el cierre correcto de las trazas de log, incluso en caso de error.
 */
"use client";

import { useTransition, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { useCampaignDraft } from "./use-campaign-draft.hook";

/**
 * @function useCampaignLifecycle
 * @description Hook orquestador para las acciones finales del ciclo de vida de una campaña.
 * @param {Locale} locale - El locale actual para construir las URLs de redirección.
 * @param {CampaignDraft} draft - El objeto de borrador de campaña actual y completo.
 * @returns Un objeto con los manejadores de acciones y sus estados de carga.
 */
export function useCampaignLifecycle(locale: Locale, draft: CampaignDraft) {
  const lifecycleTraceId = useMemo(() => logger.startTrace("useCampaignLifecycle_Lifecycle_v6.0"), []);
  useEffect(() => {
    const groupId = logger.startGroup(`[Hook] useCampaignLifecycle montado.`);
    logger.info("Hook de ciclo de vida listo para orquestar acciones finales.", { traceId: lifecycleTraceId });
    return () => {
      logger.endGroup(groupId);
      logger.endTrace(lifecycleTraceId);
    };
  }, [lifecycleTraceId]);

  const router = useRouter();
  const { resetDraft } = useCampaignDraft();
  const celebrate = useCelebrationStore((state) => state.celebrate);
  const [isPublishing, startPublishTransition] = useTransition();
  const [isPackaging, startPackageTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  const onPublish = useCallback(() => {
    startPublishTransition(async () => {
      const actionTraceId = logger.startTrace("lifecycle.onPublish");
      const groupId = logger.startGroup("[Action Flow] Publicando campaña...", actionTraceId);
      try {
        const result = await publishCampaignAction(draft);
        if (result.success) {
          celebrate();
          toast.success("¡Campaña Publicada con Éxito!", {
            description: `La variante '${result.data.variantId}' ha sido generada y está lista.`,
          });
          logger.success("[Action Flow] Publicación completada.", { traceId: actionTraceId });
        } else {
          toast.error("Fallo en la Publicación", { description: result.error });
          logger.error("[Action Flow] Fallo al publicar.", { error: result.error, traceId: actionTraceId });
        }
      } finally {
        logger.endGroup(groupId);
        logger.endTrace(actionTraceId);
      }
    });
  }, [draft, celebrate]);

  const onPackage = useCallback(() => {
    startPackageTransition(async () => {
      const actionTraceId = logger.startTrace("lifecycle.onPackage");
      const groupId = logger.startGroup("[Action Flow] Empaquetando campaña...", actionTraceId);
      try {
        const result = await packageCampaignAction(draft);
        if (result.success) {
          toast.info("Descarga del Paquete Iniciada", {
            description: "Tu artefacto de campaña .zip se está descargando en una nueva pestaña.",
          });
          window.open(result.data.downloadUrl, "_blank");
          logger.success("[Action Flow] Empaquetado completado.", { traceId: actionTraceId, url: result.data.downloadUrl });
        } else {
          toast.error("Fallo en el Empaquetado", { description: result.error });
          logger.error("[Action Flow] Fallo al empaquetar.", { error: result.error, traceId: actionTraceId });
        }
      } finally {
        logger.endGroup(groupId);
        logger.endTrace(actionTraceId);
      }
    });
  }, [draft]);

  const onDelete = useCallback(() => {
    startDeleteTransition(async () => {
      const actionTraceId = logger.startTrace("lifecycle.onDelete");
      const groupId = logger.startGroup("[Action Flow] Eliminando borrador...", actionTraceId);
      try {
        if (!draft.draftId) {
          toast.error("Error de Borrador", { description: "No se puede eliminar un borrador que no ha sido guardado." });
          logger.warn("[Guardián] Intento de eliminar un borrador sin ID.", { traceId: actionTraceId });
          return;
        }
        const result = await deleteDraftAction(draft.draftId);
        if (result.success) {
          resetDraft();
          toast.info("Borrador eliminado permanentemente.");
          router.push(routes.creatorCampaignSuite.path({ locale }));
          router.refresh();
          logger.success("[Action Flow] Eliminación completada.", { traceId: actionTraceId });
        } else {
          toast.error("Error al Eliminar Borrador", { description: result.error });
          logger.error("[Action Flow] Fallo al eliminar.", { error: result.error, traceId: actionTraceId });
        }
      } finally {
        logger.endGroup(groupId);
        logger.endTrace(actionTraceId);
      }
    });
  }, [draft.draftId, resetDraft, router, locale]);

  return {
    /**
     * @property onPublish - Orquesta la publicación de los activos de la campaña.
     */
    onPublish,
    /**
     * @property onPackage - Orquesta el empaquetado de la campaña como un sitio estático .zip.
     */
    onPackage,
    /**
     * @property onDelete - Orquesta la eliminación permanente del borrador actual.
     */
    onDelete,
    /**
     * @property isPublishing - `true` si la acción de publicación está en progreso.
     */
    isPublishing,
    /**
     * @property isPackaging - `true` si la acción de empaquetado está en progreso.
     */
    isPackaging,
    /**
     * @property isDeleting - `true` si la acción de eliminación está en progreso.
     */
    isDeleting,
  };
}
