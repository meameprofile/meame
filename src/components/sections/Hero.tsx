// RUTA: src/components/sections/Hero.tsx
/**
 * @file Hero.tsx
 * @description Aparato "Server Shell" para la sección Hero, ahora Focus-Aware.
 * @version 13.0.0 (Focus-Aware & Elite Resilience)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import React from "react";
import { logger } from "@/shared/lib/logging";
import { getBaviManifest } from "@/shared/lib/bavi";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { HeroClient } from "./HeroClient";
import type { SectionProps } from "@/shared/lib/types/sections.types";
import type {
  BaviAsset,
  BaviVariant,
} from "@/shared/lib/schemas/bavi/bavi.manifest.schema";

interface HeroProps extends SectionProps<"hero"> {
  isFocused?: boolean;
}

export async function Hero({
  content,
  locale,
  isFocused,
}: HeroProps): Promise<React.ReactElement | null> {
  const traceId = logger.startTrace("Hero_Shell_v13.0");
  logger.info("[Hero Shell] Iniciando obtención de datos para Hero.", {
    traceId,
  });

  if (!content) {
    logger.error("[Guardián] Prop 'content' no proporcionada a Hero.", {
      traceId,
    });
    logger.endTrace(traceId);
    return (
      <DeveloperErrorDisplay
        context="Hero Server Shell"
        errorMessage="Contrato de UI violado: La prop 'content' es requerida."
      />
    );
  }

  let backgroundImageUrl = "";

  if (content.backgroundImageAssetId) {
    try {
      const baviManifest = await getBaviManifest();
      const asset = baviManifest.assets.find(
        (a: BaviAsset) => a.assetId === content.backgroundImageAssetId
      );
      const publicId = asset?.variants.find(
        (v: BaviVariant) => v.state === "orig"
      )?.publicId;

      if (publicId) {
        backgroundImageUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,w_1920/${publicId}`;
        logger.traceEvent(
          traceId,
          "URL de imagen de fondo resuelta desde BAVI."
        );
      } else {
        logger.warn(
          `[Hero Shell] Asset ID '${content.backgroundImageAssetId}' no encontrado en BAVI.`,
          { traceId }
        );
      }
    } catch (error) {
      logger.error("[Hero Shell] Fallo crítico al cargar datos de BAVI.", {
        error: error instanceof Error ? error.message : String(error),
        traceId,
      });
    }
  }

  logger.endTrace(traceId);

  return (
    <HeroClient
      content={content}
      locale={locale}
      backgroundImageUrl={backgroundImageUrl}
      isFocused={isFocused}
    />
  );
}
