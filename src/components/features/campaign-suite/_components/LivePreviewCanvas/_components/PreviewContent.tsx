// RUTA: src/components/features/campaign-suite/_components/LivePreviewCanvas/_components/PreviewContent.tsx
/**
 * @file PreviewContent.tsx
 * @description Componente de presentación puro que delega el renderizado de la previsualización.
 * @version 8.0.0 (Pure & Data-Driven)
 * @author RaZ Podestá - MetaShark Tech
 */
import React from "react";
import { PreviewRenderer } from "./PreviewRenderer";
import type { AssembledTheme } from "@/shared/lib/schemas/theming/assembled-theme.schema";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";
import type { BaviManifest } from "@/shared/lib/schemas/bavi/bavi.manifest.schema";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

// El contrato de props ahora es 100% data-driven.
interface PreviewContentProps {
  draft: CampaignDraft;
  theme: AssembledTheme;
  baviManifest: BaviManifest;
  dictionary: Dictionary;
  focusedSection: string | null;
  sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;
}

export function PreviewContent({
  draft,
  theme,
  baviManifest,
  dictionary,
  focusedSection,
  sectionRefs,
}: PreviewContentProps) {
  // Toda la lógica de fetching ha sido eliminada.
  return (
    <PreviewRenderer
      draft={draft}
      theme={theme}
      baviManifest={baviManifest}
      dictionary={dictionary}
      focusedSection={focusedSection}
      sectionRefs={sectionRefs}
    />
  );
}
