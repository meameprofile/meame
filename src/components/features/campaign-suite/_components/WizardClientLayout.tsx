// RUTA: src/components/features/campaign-suite/_components/WizardClientLayout.tsx
/**
 * @file WizardClientLayout.tsx
 * @description Layout orquestador de cliente para la SDC, con una frontera Cliente-Servidor blindada.
 * @version 18.0.0 (Client-Mounted Rendering Guard)
 * @author L.I.A. Legacy
 */
"use client";

import React, { useState, useEffect } from "react"; // Se añaden useState y useEffect
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { DynamicIcon, Skeleton } from "@/components/ui";
import { LivePreviewCanvas } from "./LivePreviewCanvas";
import { logger } from "@/shared/lib/logging";
import type { LoadedFragments } from "@/shared/lib/schemas/theme-fragments/theme-fragments.contracts";
import type { BaviManifest } from "@/shared/lib/schemas/bavi/bavi.manifest.schema";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import { DeveloperErrorDisplay } from "../../dev-tools";

// La importación dinámica se mantiene como una buena práctica.
const Aether = dynamic(
  () => import("@/components/features/aether/Aether").then((mod) => mod.Aether),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-full" />,
  }
);

interface WizardClientLayoutProps {
  children: React.ReactNode;
  previewContent: {
    loadingTheme: string;
    errorLoadingTheme: string;
  };
  isLoadingDraft: boolean;
  loadedFragments: LoadedFragments;
  baviManifest: BaviManifest;
  dictionary: Dictionary;
}

export function WizardClientLayout({
  children,
  previewContent,
  isLoadingDraft,
  loadedFragments,
  baviManifest,
  dictionary,
}: WizardClientLayoutProps): React.ReactElement {
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const stepSegment = pathSegments[pathSegments.length - 1];
  const currentStepId = isNaN(parseInt(stepSegment))
    ? 0
    : parseInt(stepSegment);
  const showCanvas = currentStepId > 0;

  // --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA v18.0.0] ---
  // Guardián de Montaje: Este estado asegura que los componentes que dependen
  // fuertemente del navegador solo se rendericen después del montaje inicial.
  const [isClientMounted, setIsClientMounted] = useState(false);
  useEffect(() => {
    setIsClientMounted(true);
  }, []);
  // --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA v18.0.0] ---

  logger.info(
    "[WizardClientLayout] Renderizando layout de presentación v18.0.",
    { currentStepId, showCanvas, isClientMounted }
  );

  // ... (resto de la lógica como `isLoadingDraft` y `dictionary.aetherControls` sin cambios) ...
  if (isLoadingDraft) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <DynamicIcon
          name="LoaderCircle"
          className="w-12 h-12 animate-spin text-primary"
        />
        <p className="mt-4 text-lg font-semibold text-foreground">
          Cargando tu borrador...
        </p>
        <p className="text-muted-foreground">
          Sincronizando con la base de datos.
        </p>
      </div>
    );
  }

  if (!showCanvas && !dictionary.aetherControls) {
    const errorMsg =
      "Falta el contenido i18n para el reproductor Aether ('aetherControls').";
    logger.error(`[Guardián] ${errorMsg}`);
    return (
      <DeveloperErrorDisplay
        context="WizardClientLayout"
        errorMessage={errorMsg}
        errorDetails="Asegúrate de que el archivo 'src/messages/features/aether/aether.i18n.json' exista y esté correctamente poblado."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="lg:col-span-1">{children}</div>
      <div className="lg:col-span-1 h-[calc(100vh-12rem)] hidden lg:block sticky top-24">
        {showCanvas ? (
          <LivePreviewCanvas
            content={previewContent}
            loadedFragments={loadedFragments}
            baviManifest={baviManifest}
            dictionary={dictionary}
          />
        ) : (
          <div className="h-full bg-card border rounded-lg p-4 flex flex-col justify-center text-center">
            {/* El renderizado de Aether ahora está protegido por el guardián de montaje */}
            {isClientMounted ? (
              <Aether
                src="/videos/cinematic-placeholder.mp4"
                audioSrc="/audio/cinematic-ambient.mp3"
                content={dictionary.aetherControls!}
              />
            ) : (
              <Skeleton className="w-full h-full" />
            )}
            <div className="mt-4 p-4">
              <h3 className="font-bold text-lg text-foreground">
                Bienvenido a la Forja Creativa
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Este es tu centro de comando para crear campañas de alta
                conversión. Sigue los pasos a la izquierda para forjar tu
                próxima obra maestra.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
