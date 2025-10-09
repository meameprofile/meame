// RUTA: src/middleware.ts
/**
 * @file middleware.ts
 * @description Guardián de la puerta de entrada, ahora con gestión de sesión soberana de Supabase.
 *              v22.0.0 (Supabase Session Integrity): Se integra el manejador `updateSession`
 *              al inicio del pipeline para centralizar el refresco de sesión, resolviendo
 *              el error crítico "Body has already been consumed".
 * @version 22.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { type NextRequest, type NextResponse } from "next/server";
import { logger } from "./shared/lib/logging";
import { createPipeline } from "./shared/lib/middleware/engine";
import {
  visitorIntelligenceHandler,
  i18nHandler,
  authHandler,
} from "./shared/lib/middleware/handlers";
// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA v22.0.0] ---
import { updateSession } from "./shared/lib/supabase/middleware";
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA v22.0.0] ---

export const runtime = "nodejs";

const pipeline = createPipeline([
  visitorIntelligenceHandler,
  i18nHandler,
  authHandler,
]);

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const traceId = logger.startTrace(`middleware:${request.nextUrl.pathname}`);
  const groupId = logger.startGroup(
    `[Middleware v22.0] Procesando: ${request.method} ${request.nextUrl.pathname}`
  );

  try {
    // --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA v22.0.0] ---
    // 1. Se invoca primero el manejador de sesión de Supabase. Este leerá las cookies
    //    y devolverá una respuesta con las cookies de sesión actualizadas.
    const responseWithSession = await updateSession(request);

    // 2. La respuesta del manejador de sesión se pasa como la base para el resto del pipeline.
    const finalResponse = await pipeline(request, responseWithSession);
    // --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA v22.0.0] ---
    return finalResponse;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Middleware] Error no controlado en el runtime de Node.js.", {
      error: errorMessage,
      traceId,
    });
    // En caso de un error inesperado, se crea una nueva respuesta para evitar conflictos.
    const errorResponse = new Response("Internal Server Error", {
      status: 500,
    });
    return errorResponse as NextResponse;
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
