// RUTA: src/components/sections/SocialProofLogos.tsx
/**
 * @file SocialProofLogos.tsx
 * @description Aparato "Server Shell" para la sección de prueba social,
 *              ahora Focus-Aware y con contrato soberano.
 * @version 9.0.0 (Sovereign Contract & Focus-Aware)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import React from "react";
import { getBaviManifest } from "@/shared/lib/bavi";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/";
import { SocialProofLogosClient } from "./SocialProofLogosClient";
import type { SectionProps } from "@/shared/lib/types/sections.types";
import type {
  BaviAsset,
  BaviVariant,
} from "@/shared/lib/schemas/bavi/bavi.manifest.schema";

interface SocialProofLogosProps extends SectionProps<"socialProofLogos"> {
  isFocused?: boolean;
}

type ResolvedLogo = {
  alt: string;
  publicId: string;
  width: number;
  height: number;
};

export async function SocialProofLogos({
  content,
  isFocused,
}: SocialProofLogosProps): Promise<React.ReactElement | null> {
  const traceId = logger.startTrace("SocialProofLogos_Shell_v9.0");
  logger.info("[SocialProofLogos Shell] Iniciando obtención de datos.", {
    traceId,
  });

  if (!content || !content.logos || content.logos.length === 0) {
    logger.warn(
      "[Guardián] Contenido inválido o ausente para SocialProofLogos.",
      { traceId }
    );
    logger.endTrace(traceId);
    return null;
  }

  try {
    const baviManifest = await getBaviManifest();
    const resolvedLogos: ResolvedLogo[] = content.logos
      .map((logo) => {
        const baviAsset = baviManifest.assets.find(
          (asset: BaviAsset) => asset.assetId === logo.assetId
        );
        const variant = baviAsset?.variants.find(
          (v: BaviVariant) => v.state === "orig"
        );
        if (!baviAsset || !variant) {
          logger.warn(
            `[SocialProofLogos Shell] Logo assetId '${logo.assetId}' no encontrado en BAVI.`,
            { traceId }
          );
          return null;
        }
        return {
          alt: logo.alt,
          publicId: variant.publicId,
          width: variant.dimensions.width,
          height: variant.dimensions.height,
        };
      })
      .filter((logo): logo is ResolvedLogo => logo !== null);

    logger.endTrace(traceId);
    return (
      <SocialProofLogosClient
        title={content.title}
        logos={resolvedLogos}
        isFocused={isFocused}
      />
    );
  } catch (error) {
    const errorMessage =
      "No se pudo cargar o procesar el manifiesto de la BAVI.";
    logger.error("[SocialProofLogos Shell] Fallo crítico al renderizar.", {
      error: error instanceof Error ? error.message : String(error),
      traceId,
    });
    logger.endTrace(traceId);

    if (process.env.NODE_ENV === "development") {
      return (
        <DeveloperErrorDisplay
          context="SocialProofLogos Server Shell"
          errorMessage={errorMessage}
          errorDetails={error instanceof Error ? error : String(error)}
        />
      );
    }
    return null;
  }
}
