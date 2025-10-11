// RUTA: src/app/[locale]/login/page.tsx
/**
 * @file page.tsx
 * @description Página "Server Shell" para el login, que delega la lógica al orquestador de cliente.
 * @version 10.0.0 (Client Orchestrator Pattern & Elite Leveling)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { getBaviManifest } from "@/shared/lib/bavi";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import type {
  BaviAsset,
  BaviVariant,
} from "@/shared/lib/schemas/bavi/bavi.manifest.schema";

import { LoginClientOrchestrator } from "./_components/LoginClientOrchestrator";

interface DevLoginPageProps {
  params: { locale: Locale };
}

export default async function DevLoginPage({
  params: { locale },
}: DevLoginPageProps) {
  const traceId = logger.startTrace("DevLoginPage_Render_v10.0");
  const groupId = logger.startGroup(
    `[DevLoginPage Shell] Renderizando v10.0 para locale: ${locale}`
  );

  // Se define una URL de fallback robusta como guardián inicial.
  let backgroundImageUrl = "/img/dev/login/bg-1.png";

  try {
    logger.traceEvent(
      traceId,
      "Iniciando obtención de datos en paralelo (i18n y BAVI)..."
    );
    const [{ dictionary, error: dictError }, baviManifest] = await Promise.all([
      getDictionary(locale),
      getBaviManifest(),
    ]);
    logger.traceEvent(traceId, "Obtención de datos completada.");

    const { devLoginPage: content, oAuthButtons: oAuthContent } = dictionary;

    // Guardián de Resiliencia de Contenido
    if (dictError || !content || !oAuthContent) {
      const missingKeys = [
        !content && "devLoginPage",
        !oAuthContent && "oAuthButtons",
      ]
        .filter(Boolean)
        .join(", ");
      throw new Error(
        `Faltan claves de i18n esenciales. Ausentes: ${missingKeys}`
      );
    }
    logger.traceEvent(traceId, "Contenido i18n validado.");

    // Lógica de Resolución de Activo en Servidor
    if (content.backgroundImageAssetId) {
      logger.traceEvent(
        traceId,
        `Buscando assetId '${content.backgroundImageAssetId}' en BAVI...`
      );
      const asset = baviManifest.assets.find(
        (a: BaviAsset) => a.assetId === content.backgroundImageAssetId
      );
      const publicId = asset?.variants.find(
        (v: BaviVariant) => v.state === "orig"
      )?.publicId;

      if (publicId) {
        backgroundImageUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,w_1920/${publicId}`;
        logger.success(
          `[DevLoginPage Shell] URL de fondo de BAVI resuelta con éxito.`,
          { traceId }
        );
      } else {
        logger.warn(
          `[DevLoginPage Shell] Asset ID '${content.backgroundImageAssetId}' no encontrado en BAVI. Usando fallback estático.`,
          { traceId }
        );
      }
    }

    logger.success(
      "[DevLoginPage Shell] Ensamblaje de datos completado. Delegando al orquestador de cliente...",
      { traceId }
    );

    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-background flex flex-col items-center justify-center p-4">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src={backgroundImageUrl}
            alt="Fondo decorativo de login"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>
        <main className="relative z-10 flex w-full max-w-sm flex-col items-center">
          <LoginClientOrchestrator
            content={content}
            oAuthContent={oAuthContent}
            locale={locale}
          />
        </main>
      </div>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[DevLoginPage Shell] Fallo crítico durante el renderizado.", {
      error: errorMessage,
      traceId,
    });
    if (process.env.NODE_ENV === "production") return notFound();
    return (
      <DeveloperErrorDisplay
        context="DevLoginPage Server Shell"
        errorMessage="No se pudo renderizar la página de login."
        errorDetails={error instanceof Error ? error : errorMessage}
      />
    );
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
