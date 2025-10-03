// app/[locale]/(dev)/dev/campaign-suite/_context/PreviewContext.ts
/**
 * @file PreviewContext.ts
 * @description Store de Zustand para gestionar el estado de previsualización temporal del tema.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { create } from "zustand";
import type { AssembledTheme } from "@/shared/lib/schemas/theming/assembled-theme.schema";

interface PreviewState {
  previewTheme: AssembledTheme | null;
  setPreviewTheme: (theme: AssembledTheme | null) => void;
}

export const usePreviewStore = create<PreviewState>((set) => ({
  previewTheme: null,
  setPreviewTheme: (theme) => set({ previewTheme: theme }),
}));
