// RUTA: src/middleware.ts
/**
 * @file middleware.ts
 * @description Guardián de la puerta de entrada, completamente alineado con
 *              el contrato de observabilidad de élite del logger v20+.
 * @version 21.0.0 (Observability Contract Compliance)
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
  // --- [INICIO DE NIVELACIÓN DE OBSERVABILIDAD v21.0.0] ---
  const groupId = logger.startGroup(
    `[Middleware v21.0] Procesando: ${request.method} ${request.nextUrl.pathname}`
  );
  // --- [FIN DE NIVELACIÓN DE OBSERVABILIDAD v21.0.0] ---

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
    // --- [INICIO DE NIVELACIÓN DE OBSERVABILIDAD v21.0.0] ---
    logger.endGroup(groupId);
    logger.endTrace(traceId);
    // --- [FIN DE NIVELACIÓN DE OBSERVABILIDAD v21.0.0] ---
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
