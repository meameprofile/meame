// RUTA: src/shared/hooks/campaign-suite/use-campaign-lifecycle.ts
/**
 * @file use-campaign-lifecycle.ts
 * @description Hook soberano para gestionar el ciclo de vida de la campaña, ahora
 *              alineado con la arquitectura de "Forja Centralizada".
 * @version 5.0.0 (Centralized Forge Compliance)
 * @author RaZ Podestá - MetaShark Tech
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

export function useCampaignLifecycle(locale: Locale, draft: CampaignDraft) {
  const traceId = useMemo(
    () => logger.startTrace("useCampaignLifecycle_v5.0"),
    []
  );
  useEffect(() => {
    logger.info("[Lifecycle Hook] Montado y listo para orquestar acciones.", {
      traceId,
    });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const router = useRouter();
  const { resetDraft } = useCampaignDraft(); // <-- REFACTORIZACIÓN ARQUITECTÓNICA
  const celebrate = useCelebrationStore((s) => s.celebrate);
  const [isPublishing, startPublishTransition] = useTransition();
  const [isPackaging, startPackageTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  const onPublish = useCallback(() => {
    startPublishTransition(async () => {
      const result = await publishCampaignAction(draft);
      if (result.success) {
        celebrate();
        toast.success("¡Campaña Publicada!", {
          description: `Variante ${result.data.variantId} está en vivo.`,
        });
      } else {
        toast.error("Fallo en la Publicación", { description: result.error });
      }
    });
  }, [draft, celebrate]);

  const onPackage = useCallback(() => {
    startPackageTransition(async () => {
      const result = await packageCampaignAction(draft);
      if (result.success) {
        toast.info("Descarga iniciada", {
          description: "Tu paquete .zip se está descargando.",
        });
        window.open(result.data.downloadUrl, "_blank");
      } else {
        toast.error("Fallo en el Empaquetado", { description: result.error });
      }
    });
  }, [draft]);

  const onDelete = useCallback(() => {
    startDeleteTransition(async () => {
      if (!draft.draftId) {
        toast.error("Error", {
          description: "No se puede eliminar un borrador sin ID.",
        });
        return;
      }
      const result = await deleteDraftAction(draft.draftId);
      if (result.success) {
        resetDraft(); // <-- USA LA ACCIÓN DEL NUEVO HOOK
        toast.info("Borrador eliminado con éxito.");
        router.push(routes.creatorCampaignSuite.path({ locale }));
        router.refresh();
      } else {
        toast.error("Error al eliminar el borrador", {
          description: result.error,
        });
      }
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
