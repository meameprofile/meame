// RUTA: src/shared/lib/ssg/engine/pipeline.ts
/**
 * @file pipeline.ts
 * @description Orquestador de middleware atómico y compatible con Vercel Edge Runtime.
 *              v1.3.0 (Module Load Observability & Route Correction): Se añade un log de traza
 *              al inicio del módulo para confirmar su carga y se corrige el comentario de ruta
 *              para alinearse con la arquitectura SSG.
 * @version 1.3.0
 * @author RaZ Podestá - MetaShark Tech
 */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { logger } from "@/shared/lib/logging"; // Corregido: ruta relativa a logging

// --- INICIO DE MEJORA: OBSERVABILIDAD DE CARGA DE MÓDULO ---
logger.trace(
  "[ssg/engine/pipeline.ts] Módulo de pipeline del motor SSG cargado y listo para usar."
);
// --- FIN DE MEJORA: OBSERVABILIDAD DE CARGA DE MÓDULO ---

export type MiddlewareHandler = (
  req: NextRequest,
  res: NextResponse
) => NextResponse | Promise<NextResponse>;

export function createPipeline(
  handlers: MiddlewareHandler[]
): (req: NextRequest) => Promise<NextResponse> {
  return async function (req: NextRequest): Promise<NextResponse> {
    let currentResponse = NextResponse.next();

    for (const handler of handlers) {
      try {
        logger.trace(
          `[Pipeline] Ejecutando manejador: ${handler.name || "anonymous handler"}...`
        );
        const result = await handler(req, currentResponse);
        currentResponse = result;

        if (
          result.headers.get("x-middleware-rewrite") ||
          result.headers.get("Location")
        ) {
          logger.trace(
            `[Pipeline] Manejador '${handler.name || "anonymous handler"}' ha cortocircuitado el pipeline.`
          );
          return result;
        }
      } catch (error) {
        logger.error(
          `[Pipeline] Error en el manejador '${handler.name || "anonymous handler"}':`,
          {
            error,
          }
        );
        return new NextResponse("Internal Server Error", { status: 500 });
      }
    }
    return currentResponse;
  };
}
