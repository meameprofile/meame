// RUTA: src/app/api/component-preview/[componentName]/route.ts
/**
 * @file route.ts
 * @description Endpoint de API para generar vistas previas de componentes.
 * @version 6.0.0 (Sovereign Contract Alignment & Pure Passthrough)
 * @author RaZ Podestá - MetaShark Tech
 */
import { ImageResponse } from "@vercel/og";
import React from "react";

import { ErrorPreview } from "@/components/features/dev-tools/ErrorPreview";
import { renderPreviewComponent } from "@/shared/lib/dev/preview-renderer";
import { logger } from "@/shared/lib/logging";

export async function GET(
  request: Request,
  { params }: { params: { componentName: string } }
) {
  const componentName = params.componentName;
  const traceId = logger.startTrace(`component-preview:${componentName}`);
  logger.info(
    `[API Preview] Solicitud de previsualización para: ${componentName}`,
    { traceId }
  );

  try {
    // --- [INICIO DE REFACTORIZACIÓN DE CONTRATO] ---
    // La función ahora devuelve directamente la ImageResponse, incluyendo el manejo de errores.
    const imageResponse = await renderPreviewComponent(componentName);
    logger.success(
      `[API Preview] Previsualización generada para: ${componentName}`,
      { traceId }
    );
    return imageResponse;
    // --- [FIN DE REFACTORIZACIÓN DE CONTRATO] ---
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(
      `[API Preview] Fallo crítico en la orquestación de ${componentName}`,
      { error: errorMessage, traceId }
    );
    // Fallback de emergencia si el propio renderizador falla catastróficamente.
    return new ImageResponse(
      React.createElement(ErrorPreview, { componentName }),
      {
        width: 600,
        height: 338,
        status: 500,
      }
    );
  } finally {
    logger.endTrace(traceId);
  }
}
