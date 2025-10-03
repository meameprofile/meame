// RUTA: src/shared/lib/stores/use-celebration.store.ts
/**
 * @file use-celebration.store.ts
 * @description Store de Zustand y SSoT para gestionar el estado de los
 *              efectos de celebración globales (MEA/UX), como el confeti.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { create } from "zustand";
import { logger } from "@/shared/lib/logging";

interface CelebrationState {
  isCelebrating: boolean;
  celebrate: () => void;
  endCelebration: () => void;
}

export const useCelebrationStore = create<CelebrationState>((set) => ({
  isCelebrating: false,
  celebrate: () => {
    logger.info("[MEA/UX Store] ¡Activando celebración global!");
    set({ isCelebrating: true });
  },
  endCelebration: () => {
    logger.trace("[MEA/UX Store] Finalizando celebración.");
    set({ isCelebrating: false });
  },
}));
