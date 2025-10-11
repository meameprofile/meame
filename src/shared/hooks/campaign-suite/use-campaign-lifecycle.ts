// RUTA: src/shared/hooks/campaign-suite/use-campaign-lifecycle.ts
/**
 * @file use-campaign-lifecycle.ts
 * @description Hook "cerebro" para el ciclo de vida final de una campaña.
 * @version 7.2.0 (Routing Type Contract Restoration): Se alinea la llamada de
 *              redirección con el contrato de tipo estricto de la SSoT de 'navigation.ts',
 *              resolviendo un error crítico de tipo TS2345.
 * @author L.I.A. Legacy
 */
"use client";

import { useRouter } from "next/navigation";
import { useTransition, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";

import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import { routes } from "@/shared/lib/navigation";
import { useCelebrationStore } from "@/shared/lib/stores/use-celebration.store";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";

import { useCampaignDraft } from "./use-campaign-draft.hook";

interface LifecycleActions {
  publish: (
    draft: CampaignDraft
  ) => Promise<ActionResult<{ message: string; variantId: string }>>;
  package: (
    draft: CampaignDraft
  ) => Promise<ActionResult<{ downloadUrl: string }>>;
  delete: (draftId: string) => Promise<ActionResult<{ deletedCount: number }>>;
}

export function useCampaignLifecycle(
  locale: Locale,
  actions: LifecycleActions
) {
  const lifecycleTraceId = useMemo(
    () => logger.startTrace("useCampaignLifecycle_Lifecycle_v7.2"),
    []
  );
  useEffect(() => {
    const groupId = logger.startGroup(`[Hook] useCampaignLifecycle montado.`);
    logger.info(
      "Hook de ciclo de vida listo para orquestar acciones finales.",
      { traceId: lifecycleTraceId }
    );
    return () => {
      logger.endGroup(groupId);
      logger.endTrace(lifecycleTraceId);
    };
  }, [lifecycleTraceId]);

  const router = useRouter();
  const { draft, resetDraft } = useCampaignDraft();
  const celebrate = useCelebrationStore((state) => state.celebrate);
  const [isPublishing, startPublishTransition] = useTransition();
  const [isPackaging, startPackageTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  const onPublish = useCallback(() => {
    startPublishTransition(async () => {
      const result = await actions.publish(draft);
      if (result.success) {
        celebrate();
        toast.success("¡Campaña Publicada con Éxito!", {
          description: `La variante '${result.data.variantId}' ha sido generada y está lista.`,
        });
      } else {
        toast.error("Fallo en la Publicación", { description: result.error });
      }
    });
  }, [draft, celebrate, actions]);

  const onPackage = useCallback(() => {
    startPackageTransition(async () => {
      const result = await actions.package(draft);
      if (result.success) {
        toast.info("Descarga del Paquete Iniciada", {
          description:
            "Tu artefacto de campaña .zip se está descargando en una nueva pestaña.",
        });
        window.open(result.data.downloadUrl, "_blank");
      } else {
        toast.error("Fallo en el Empaquetado", { description: result.error });
      }
    });
  }, [draft, actions]);

  const onDelete = useCallback(() => {
    startDeleteTransition(async () => {
      if (!draft.draftId) {
        toast.error("Error de Borrador", {
          description:
            "No se puede eliminar un borrador que no ha sido guardado.",
        });
        return;
      }
      const result = await actions.delete(draft.draftId);
      if (result.success) {
        resetDraft();
        toast.info("Borrador eliminado permanentemente.");
        // --- [INICIO DE REFACTORIZACIÓN DE CONTRATO DE TIPO v7.2.0] ---
        // Se añade la propiedad 'stepId' con un array vacío para cumplir
        // el contrato de tipo y generar la URL base correcta.
        router.push(
          routes.creatorCampaignSuiteWithStepId.path({ locale, stepId: [] })
        );
        // --- [FIN DE REFACTORIZACIÓN DE CONTRATO DE TIPO v7.2.0] ---
        router.refresh();
      } else {
        toast.error("Error al Eliminar Borrador", {
          description: result.error,
        });
      }
    });
  }, [draft.draftId, resetDraft, router, locale, actions]);

  return {
    onPublish,
    onPackage,
    onDelete,
    isPublishing,
    isPackaging,
    isDeleting,
  };
}
