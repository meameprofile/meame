// RUTA: src/middleware.ts
/**
 * @file middleware.ts
 * @description Guardián de la puerta de entrada, ahora completamente agnóstico al runtime de Supabase.
 * @version 16.0.0 (Runtime Agnostic)
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

const pipeline = createPipeline([
  visitorIntelligenceHandler,
  i18nHandler,
  authHandler,
]);

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const traceId = logger.startTrace(`middleware:${request.nextUrl.pathname}`);
  logger.startGroup(
    `[Middleware v16.0] Procesando: ${request.method} ${request.nextUrl.pathname}`
  );

  try {
    const initialResponse = NextResponse.next({
      request: { headers: request.headers },
    });
    const finalResponse = await pipeline(request, initialResponse);
    return finalResponse;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Middleware] Error no controlado.", {
      error: errorMessage,
      traceId,
    });
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
