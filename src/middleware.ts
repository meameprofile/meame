// RUTA: src/middleware.ts
/**
 * @file middleware.ts
 * @description Guardián de la puerta de entrada, ahora completamente alineado con
 *              el Protocolo Heimdall v2.0 para una observabilidad de élite.
 * @version 20.0.0 (Heimdall Protocol Compliant)
 * @author L.I.A. Legacy
 */
import { type NextRequest, NextResponse } from "next/server";
import { logger } from "./shared/lib/logging";
import { createPipeline } from "./shared/lib/middleware/engine";
import {
  visitorIntelligenceHandler,
  i18nHandler,
  authHandler,
} from "./shared/lib/middleware/handlers";

export const runtime = "nodejs";

const pipeline = createPipeline([
  visitorIntelligenceHandler,
  i18nHandler,
  authHandler,
]);

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const traceId = logger.startTrace(`middleware:${request.nextUrl.pathname}`);
  // --- [INICIO DE REFACTORIZACIÓN DE CONTRATO V20.0.0] ---
  // Se captura el groupId devuelto por startGroup.
  const groupId = logger.startGroup(
    `[Middleware v20.0] Procesando: ${request.method} ${request.nextUrl.pathname}`
  );
  // --- [FIN DE REFACTORIZACIÓN DE CONTRATO V20.0.0] ---

  try {
    const initialResponse = NextResponse.next({
      request: { headers: request.headers },
    });
    const finalResponse = await pipeline(request, initialResponse);
    return finalResponse;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Middleware] Error no controlado en el runtime de Node.js.", {
      error: errorMessage,
      traceId,
    });
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    // --- [INICIO DE REFACTORIZACIÓN DE CONTRATO V20.0.0] ---
    // Se pasa el groupId requerido a endGroup.
    logger.endGroup(groupId);
    logger.endTrace(traceId);
    // --- [FIN DE REFACTORIZACIÓN DE CONTRATO V20.0.0] ---
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
