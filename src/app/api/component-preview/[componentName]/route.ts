// RUTA: src/app/api/component-preview/[componentName]/route.ts
/**
 * @file route.ts
 * @description Endpoint de API para generar vistas previas de componentes.
 *              v5.0.0 (Runtime Integrity Restoration): Se elimina la directiva 'edge'
 *              para restaurar la compatibilidad con el runtime de Node.js,
 *              necesario para las operaciones de sistema de archivos (fs).
 * @version 5.0.0
 * @author L.I.A. Legacy
 */
import { ImageResponse } from "@vercel/og";
import React from "react";
import { renderPreviewComponent } from "@/shared/lib/dev/preview-renderer";
import { ErrorPreview } from "@/components/features/dev-tools/ErrorPreview";
import { logger } from "@/shared/lib/logging";

// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
// La directiva 'export const runtime = "edge";' ha sido eliminada.
// La ruta ahora se ejecutará en el entorno Serverless de Node.js por defecto.
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA] ---

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
    const renderResult = await renderPreviewComponent(componentName);

    const { jsx, width, height } = renderResult || {
      jsx: React.createElement(ErrorPreview, { componentName }),
      width: 600,
      height: 338,
    };
    logger.success(
      `[API Preview] Previsualización generada para: ${componentName}`,
      { traceId }
    );
    return new ImageResponse(jsx, {
      width,
      height,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(
      `[API Preview] Fallo crítico al generar previsualización para: ${componentName}`,
      { error: errorMessage, traceId }
    );
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
