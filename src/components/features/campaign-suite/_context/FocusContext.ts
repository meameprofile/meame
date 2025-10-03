// RUTA: src/components/features/campaign-suite/_context/FocusContext.ts
/**
 * @file FocusContext.ts
 * @description Store de Zustand y SSoT para gestionar el estado de foco global
 *              entre el editor de contenido y el lienzo de previsualización (EDVI).
 * @version 2.0.0 (Elite Leveling)
 * @author RaZ Podestá - MetaShark Tech
 */
import { create } from "zustand";
import { logger } from "@/shared/lib/logging";

logger.trace("[FocusContext] Módulo de estado de foco cargado.");

interface FocusState {
  focusedSection: string | null;
  focusedField: string | null;
  setFocus: (section: string | null, field: string | null) => void;
  clearFocus: () => void;
}

export const useFocusStore = create<FocusState>((set) => ({
  focusedSection: null,
  focusedField: null,
  setFocus: (section, field) => {
    logger.trace(`[FocusStore] Foco establecido en: ${section}.${field}`);
    set({ focusedSection: section, focusedField: field });
  },
  clearFocus: () => {
    logger.trace("[FocusStore] Foco limpiado.");
    set({ focusedSection: null, focusedField: null });
  },
}));
