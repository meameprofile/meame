// RUTA: src/components/features/campaign-suite/_components/LivePreviewCanvas.tsx
/**
 * @file LivePreviewCanvas.tsx
 * @description Orquestador de élite para el lienzo de previsualización (EDVI),
 *              ahora con cumplimiento estricto de las Reglas de los Hooks de React
 *              y alineado con la arquitectura de "Forja Centralizada".
 * @version 22.0.0 (React Hooks & Centralized Forge Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useMemo } from "react";
import { createPortal } from "react-dom";
import { usePreviewTheme } from "@/shared/hooks/campaign-suite/use-preview-theme";
import { useIframe } from "@/shared/hooks/campaign-suite/use-iframe";
import { usePreviewFocus } from "@/shared/hooks/campaign-suite/use-preview-focus";
import { sectionsConfig } from "@/shared/lib/config/sections.config";
import { buildPreviewDictionary } from "@/shared/lib/utils/campaign-suite/preview.utils";
import {
  PreviewContent,
  PreviewErrorOverlay,
} from "./LivePreviewCanvas/_components";
import { useCampaignDraft } from "@/shared/hooks/campaign-suite/use-campaign-draft.hook";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import { logger } from "@/shared/lib/logging";
import type { LoadedFragments } from "@/shared/lib/actions/campaign-suite";
import type { BaviManifest } from "@/shared/lib/schemas/bavi/bavi.manifest.schema";
import { DeveloperErrorDisplay } from "../../dev-tools";

interface LivePreviewCanvasProps {
  content: {
    errorLoadingTheme: string;
  };
  loadedFragments: LoadedFragments;
  baviManifest: BaviManifest;
  dictionary: Dictionary;
}

export function LivePreviewCanvas({
  content,
  loadedFragments,
  baviManifest,
  dictionary,
}: LivePreviewCanvasProps) {
  const traceId = useMemo(
    () => logger.startTrace("LivePreviewCanvas_Render_v22.0"),
    []
  );
  const groupId = logger.startGroup(
    `[LivePreviewCanvas] Renderizando orquestador v22.0...`,
    traceId
  );

  const { draft } = useCampaignDraft();
  const { theme, error: themeError } = usePreviewTheme(loadedFragments);
  const { iframeRef, iframeBody } = useIframe();
  const { focusedSection, sectionRefs } = usePreviewFocus();

  try {
    logger.traceEvent(traceId, "Hooks de estado y efectos inicializados.");

    const draftDictionary = buildPreviewDictionary(
      draft.contentData,
      draft.layoutConfig,
      "it-IT",
      sectionsConfig
    );
    const finalDictionary = {
      ...dictionary,
      ...draftDictionary,
    } as Dictionary;
    logger.traceEvent(traceId, "Diccionario de previsualización ensamblado.");

    logger.traceEvent(traceId, "Procediendo a renderizar JSX final...");
    return (
      <div className="h-full bg-muted/20 p-2 rounded-lg sticky top-24">
        <iframe
          ref={iframeRef}
          className="w-full h-full bg-background rounded-md border"
          title="Live Preview"
          sandbox="allow-scripts allow-same-origin"
        />
        {iframeBody &&
          createPortal(
            <>
              {themeError && (
                <PreviewErrorOverlay
                  title={content.errorLoadingTheme}
                  details={themeError}
                />
              )}
              {theme && !themeError && (
                <PreviewContent
                  draft={draft}
                  theme={theme}
                  baviManifest={baviManifest}
                  dictionary={finalDictionary}
                  focusedSection={focusedSection}
                  sectionRefs={sectionRefs}
                />
              )}
            </>,
            iframeBody
          )}
      </div>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(
      "[Guardián] Fallo crítico irrecuperable en LivePreviewCanvas.",
      {
        error: errorMessage,
        traceId,
      }
    );
    return (
      <div className="h-full bg-destructive/10 p-4 rounded-lg sticky top-24">
        <DeveloperErrorDisplay
          context="LivePreviewCanvas"
          errorMessage="No se pudo renderizar el lienzo de previsualización."
          errorDetails={error instanceof Error ? error : errorMessage}
        />
      </div>
    );
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
