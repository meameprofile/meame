// RUTA: src/components/features/dev-tools/ComponentCanvas.tsx
/**
 * @file ComponentCanvas.tsx
 * @description Orquestador soberano para el Dev Component Canvas.
 *              v9.0.0 (API Contract Synchronization): Se alinea la llamada a
 *              loadComponentAndProps y la desestructuración de su resultado con
 *              el contrato de API de élite de ComponentLoader v7.0+, resolviendo
 *              errores críticos de build TS2339 y TS2554.
 * @version 9.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import Link from "next/link";
import React from "react";

import { loadComponentAndProps } from "@/shared/lib/dev/ComponentLoader";
import { logger } from "@/shared/lib/logging";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

import { ComponentCanvasHeader } from "./ComponentCanvasHeader";
import { ComponentMetadataPanel } from "./ComponentMetadataPanel";
import { DeveloperErrorDisplay } from "./DeveloperErrorDisplay";

type CanvasContent = NonNullable<Dictionary["componentCanvas"]>;
type HeaderContent = NonNullable<Dictionary["componentCanvasHeader"]>;

interface ComponentCanvasProps {
  componentName?: string;
  locale: string;
  content: CanvasContent;
  headerContent: HeaderContent;
}

export async function ComponentCanvas({
  componentName,
  locale,
  content,
  headerContent,
}: ComponentCanvasProps): Promise<React.ReactElement> {
  logger.info(
    `[CanvasOrchestrator] Orquestando renderizado v9.0 para: ${
      componentName || "Indefinido"
    }`
  );

  if (!componentName) {
    return (
      <div className="text-center text-muted-foreground p-8">
        <h2 className="text-2xl font-bold text-foreground">
          {content.errorNoComponentTitle}
        </h2>
        <p>{content.errorNoComponentDescription}</p>
        <p className="text-sm mt-4">
          <Link href={`/${locale}/dev`} className="underline text-primary">
            {content.errorNoComponentLink}
          </Link>
        </p>
      </div>
    );
  }

  try {
    // --- [INICIO DE REFACTORIZACIÓN DE API] ---
    // Se corrige la llamada a la función y la desestructuración del resultado.
    const { ComponentToRender, componentProps, entry } =
      await loadComponentAndProps(componentName);
    // --- [FIN DE REFACTORIZACIÓN DE API] ---

    if (!headerContent) {
      throw new Error(
        "El contenido para 'componentCanvasHeader' no se encontró en el diccionario."
      );
    }

    return (
      <div className="border border-primary/50 rounded-lg p-6 bg-background/50 shadow-lg relative">
        <ComponentCanvasHeader entryName={entry.name} content={headerContent} />

        {/* Se elimina la prop 'appliedTheme' que ya no existe */}
        <ComponentMetadataPanel
          componentProps={componentProps}
          content={{
            metadataPanelPropsLabel: content.metadataPanelPropsLabel,
          }}
        />

        <div className="relative z-10 p-4 border border-dashed border-primary/40 rounded-md min-h-[300px] flex items-center justify-center">
          <ComponentToRender {...componentProps} />
        </div>
      </div>
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(
      `[CanvasOrchestrator] Falla crítica al cargar "${componentName}":`,
      { error: errorMessage }
    );
    return (
      <DeveloperErrorDisplay
        context="ComponentCanvas"
        errorMessage={`${content.errorLoadingDescription} "${componentName}".`}
        errorDetails={error instanceof Error ? error : errorMessage}
      />
    );
  }
}
// RUTA: src/components/features/dev-tools/ComponentCanvas.tsx
