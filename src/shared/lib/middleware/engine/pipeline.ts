// RUTA: src/shared/lib/middleware/engine/pipeline.ts
/**
 * @file pipeline.ts
 * @description Orquestador de middleware atómico, soberano y encadenable.
 * @version 4.0.0 (Chainable Response Architecture): Refactorizado para aceptar
 *              una respuesta inicial, permitiendo que se integre en cadenas de
 *              procesamiento de middleware más complejas y restaurando la
 *              integridad del contrato de API.
 * @version 4.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import type { NextRequest, NextResponse } from "next/server";

import { logger } from "@/shared/lib/logging";

export type MiddlewareHandler = (
  req: NextRequest,
  res: NextResponse
) => NextResponse | Promise<NextResponse>;

export function createPipeline(
  handlers: MiddlewareHandler[]
): (req: NextRequest, initialResponse: NextResponse) => Promise<NextResponse> {
  return async function (
    req: NextRequest,
    initialResponse: NextResponse
  ): Promise<NextResponse> {
    let currentResponse = initialResponse;

    for (const handler of handlers) {
      const handlerName = handler.name || "anonymousHandler";
      logger.trace(`[Pipeline] -> Ejecutando manejador: ${handlerName}...`);

      const result = await handler(req, currentResponse);
      currentResponse = result;

      if (
        (result.status >= 300 && result.status < 400) ||
        result.headers.get("x-middleware-rewrite")
      ) {
        logger.info(
          `[Pipeline] Manejador '${handlerName}' ha cortocircuitado el pipeline.`
        );
        return result;
      }
    }
    logger.trace(
      "[Pipeline] <- Todos los manejadores ejecutados sin cortocircuito."
    );
    return currentResponse;
  };
}
