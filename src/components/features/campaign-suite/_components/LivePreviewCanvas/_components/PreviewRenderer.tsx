// RUTA: src/components/features/campaign-suite/_components/LivePreviewCanvas/_components/PreviewRenderer.tsx
/**
 * @file PreviewRenderer.tsx
 * @description Componente de presentación puro que ensambla la estructura visual
 *              del lienzo de previsualización, ahora con logging granular y resiliencia.
 * @version 3.0.0 (Elite Observability & Resilience)
 * @author RaZ Podestá - MetaShark Tech
 */
import { motion, AnimatePresence } from "framer-motion";
import React, { useMemo } from "react";

import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { CampaignThemeProvider } from "@/components/layout/CampaignThemeProvider";
import { livePreviewComponentMap } from "@/shared/lib/dev/live-previews.config";
import { logger } from "@/shared/lib/logging";
import type {
  BaviManifest,
  BaviAsset,
  BaviVariant,
} from "@/shared/lib/schemas/bavi/bavi.manifest.schema";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import type { AssembledTheme } from "@/shared/lib/schemas/theming/assembled-theme.schema";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";
import { generateCssVariablesFromTheme } from "@/shared/lib/utils/theming/theme-utils";

import { PreviewSection } from "./PreviewSection";

interface PreviewRendererProps {
  draft: CampaignDraft;
  theme: AssembledTheme;
  baviManifest: BaviManifest;
  dictionary: Dictionary;
  focusedSection: string | null;
  sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;
}

export function PreviewRenderer({
  draft,
  theme,
  baviManifest,
  dictionary,
  focusedSection,
  sectionRefs,
}: PreviewRendererProps) {
  const traceId = useMemo(
    () => logger.startTrace("PreviewRenderer_Render_v3.0"),
    []
  );
  const groupId = logger.startGroup(
    `[PreviewRenderer] Ensamblando previsualización...`,
    traceId
  );

  try {
    const getPublicId = (
      assetId: string | null | undefined
    ): string | undefined => {
      if (!assetId) return undefined;
      const asset = baviManifest.assets.find(
        (a: BaviAsset) => a.assetId === assetId
      );
      const publicId = asset?.variants.find(
        (v: BaviVariant) => v.state === "orig"
      )?.publicId;
      logger.traceEvent(
        traceId,
        `Resolviendo BAVI assetId: ${assetId} -> ${publicId || "No encontrado"}`
      );
      return publicId;
    };

    const HeaderComponent =
      draft.headerConfig.useHeader && draft.headerConfig.componentName
        ? livePreviewComponentMap[draft.headerConfig.componentName]
        : null;
    logger.traceEvent(
      traceId,
      `Componente de Header seleccionado: ${draft.headerConfig.componentName || "Ninguno"}`
    );

    const FooterComponent =
      draft.footerConfig.useFooter && draft.footerConfig.componentName
        ? livePreviewComponentMap[draft.footerConfig.componentName]
        : null;
    logger.traceEvent(
      traceId,
      `Componente de Footer seleccionado: ${draft.footerConfig.componentName || "Ninguno"}`
    );

    const headerContent = {
      ...dictionary.header,
      ...dictionary.toggleTheme,
      ...dictionary.languageSwitcher,
      ...dictionary.cart,
      ...dictionary.userNav,
      ...dictionary.notificationBell,
    };

    logger.success(
      "[PreviewRenderer] Ensamblaje visual completado con éxito.",
      { traceId }
    );

    return (
      <CampaignThemeProvider theme={theme}>
        <style>{generateCssVariablesFromTheme(theme)}</style>
        <AnimatePresence>
          {HeaderComponent && (
            <motion.div>
              <HeaderComponent
                content={headerContent}
                currentLocale="it-IT"
                supportedLocales={["it-IT"]}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {draft.layoutConfig.map((section, index) => {
          logger.traceEvent(traceId, `Renderizando sección: ${section.name}`);
          return (
            <PreviewSection
              key={`${section.name}-${index}`}
              section={section}
              dictionary={dictionary}
              getPublicId={(assetId) => getPublicId(assetId)}
              isFocused={focusedSection === section.name}
              sectionRef={(el) => {
                if (sectionRefs) sectionRefs.current[section.name] = el;
              }}
            />
          );
        })}

        <AnimatePresence>
          {FooterComponent && (
            <motion.div>
              <FooterComponent content={dictionary.footer} />
            </motion.div>
          )}
        </AnimatePresence>
      </CampaignThemeProvider>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Guardián] Fallo crítico irrecuperable en PreviewRenderer.", {
      error: errorMessage,
      traceId,
    });
    return (
      <DeveloperErrorDisplay
        context="PreviewRenderer"
        errorMessage="No se pudo renderizar una o más secciones de la previsualización."
        errorDetails={error instanceof Error ? error : errorMessage}
      />
    );
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
