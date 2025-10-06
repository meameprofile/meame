// RUTA: src/shared/hooks/campaign-suite/useCampaignDraftSync.ts
/**
 * @file useCampaignDraftSync.ts
 * @description Hook de efecto para sincronizar los stores atómicos de la SDC.
 *              Activa el guardado automático en respuesta a cualquier cambio.
 * @version 1.0.0
 * @author L.I.A. Legacy
 */
"use client";

import { useEffect } from "react";
import { logger } from "@/shared/lib/logging";
import { useCampaignDraftStore } from "./use-campaign-draft-context.store";
import { useDraftMetadataStore } from "./use-draft-metadata.store";
import { useStep0IdentityStore } from "./use-step0-identity.store";
import { useStep1StructureStore } from "./use-step1-structure.store";
import { useStep2LayoutStore } from "./use-step2-layout.store";
import { useStep3ThemeStore } from "./use-step3-theme.store";
import { useStep4ContentStore } from "./use-step4-content.store";

export function useCampaignDraftSync() {
  useEffect(() => {
    const { triggerDebouncedSave } = useCampaignDraftStore.getState();

    const onChange = () => {
      // Solo guardar si la hidratación inicial desde la DB ha terminado
      if (useCampaignDraftStore.getState().isHydrated) {
        triggerDebouncedSave();
      }
    };

    logger.info("[Sync Hook] Suscribiéndose a los stores atómicos de la SDC.");
    const unsubMetadata = useDraftMetadataStore.subscribe(onChange);
    const unsubStep0 = useStep0IdentityStore.subscribe(onChange);
    const unsubStep1 = useStep1StructureStore.subscribe(onChange);
    const unsubStep2 = useStep2LayoutStore.subscribe(onChange);
    const unsubStep3 = useStep3ThemeStore.subscribe(onChange);
    const unsubStep4 = useStep4ContentStore.subscribe(onChange);

    return () => {
      logger.info("[Sync Hook] Desuscribiéndose de los stores de la SDC.");
      unsubMetadata();
      unsubStep0();
      unsubStep1();
      unsubStep2();
      unsubStep3();
      unsubStep4();
    };
  }, []); // Se ejecuta solo una vez, al montar el componente que lo usa.
}
