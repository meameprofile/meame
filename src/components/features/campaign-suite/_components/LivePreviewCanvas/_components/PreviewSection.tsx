// RUTA: src/components/features/campaign-suite/_components/LivePreviewCanvas/_components/PreviewSection.tsx
/**
 * @file PreviewSection.tsx
 * @description Componente hiper-atómico para renderizar una única sección validada
 *              dentro del lienzo de previsualización.
 * @version 3.0.0 (ACS Path & Build Integrity Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
import React from "react";
import { livePreviewComponentMap } from "@/components/features/dev-tools/config/live-previews.config";
import { sectionsConfig } from "@/shared/lib/config/sections.config";
import { ValidationError } from "@/components/ui/ValidationError";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import type { LayoutConfigItem } from "@/shared/lib/types/campaigns/draft.types";

interface PreviewSectionProps {
  section: LayoutConfigItem;
  dictionary: Dictionary;
  getPublicId: (assetId: string | null | undefined) => string | undefined;
  isFocused: boolean;
  sectionRef: (el: HTMLElement | null) => void;
}

export function PreviewSection({
  section,
  dictionary,
  getPublicId,
  isFocused,
  sectionRef,
}: PreviewSectionProps) {
  const Component = livePreviewComponentMap[section.name];
  const config = sectionsConfig[section.name as keyof typeof sectionsConfig];

  if (!Component || !config) return null;

  const contentData = (dictionary as Record<string, unknown>)[
    config.dictionaryKey
  ];
  const validation = config.schema.safeParse(contentData);

  if (!validation.success) {
    return (
      <ValidationError
        sectionName={section.name}
        error={validation.error}
        content={dictionary.validationError!}
      />
    );
  }

  const enrichedContent = { ...validation.data };
  const extraProps: { backgroundImageUrl?: string } = {};

  if (
    "backgroundImageAssetId" in enrichedContent &&
    typeof enrichedContent.backgroundImageAssetId === "string"
  ) {
    const publicId = getPublicId(enrichedContent.backgroundImageAssetId);
    if (publicId) {
      extraProps.backgroundImageUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,w_1920/${publicId}`;
    }
  }

  const componentProps = {
    content: enrichedContent,
    locale: "it-IT",
    ...extraProps,
  };

  return (
    <div ref={sectionRef} className={isFocused ? "ring-2 ring-primary" : ""}>
      <Component {...componentProps} />
    </div>
  );
}
