// RUTA: src/shared/lib/supabase/middleware.ts
/**
 * @file middleware.ts
 * @description SSoT para la lógica de middleware de gestión de sesión de Supabase.
 *              v8.1.0 (Elite Hygiene & Type Safety): Se corrigen violaciones de
 *              linting y un error de tipo crítico en el manejador de cookies para
 *              garantizar una higiene de código y una seguridad de tipos de élite.
 * @version 8.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { logger } from "@/shared/lib/logging";

export async function updateSession(
  request: NextRequest
): Promise<NextResponse> {
  const traceId = logger.startTrace("supabase.updateSession_v8.1");
  // --- [INICIO DE REFACTORIZACIÓN DE HIGIENE DE CÓDIGO] ---
  // Se cambia 'let' por 'const' ya que la referencia a 'response' no se reasigna.
  const response = NextResponse.next({
    request: { headers: request.headers },
  });
  // --- [FIN DE REFACTORIZACIÓN DE HIGIENE DE CÓDIGO] ---

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({ name, value, ...options });
            response.cookies.set({ name, value, ...options });
          },
          // --- [INICIO DE CORRECCIÓN DE ERROR DE TIPO (TS18004)] ---
          // La firma es `remove(name, options)`, no hay un parámetro 'value'.
          // La forma correcta de eliminar es establecer un valor vacío.
          remove(name: string, options: CookieOptions) {
            request.cookies.set({ name, value: "", ...options });
            response.cookies.set({ name, value: "", ...options });
          },
          // --- [FIN DE CORRECCIÓN DE ERROR DE TIPO] ---
        },
      }
    );

    // Esta llamada es crucial. Intenta obtener el usuario y, si el token de acceso
    // ha expirado, utiliza el token de refresco para obtener uno nuevo.
    await supabase.auth.getUser();

    logger.traceEvent(
      traceId,
      "Refresco de sesión de Supabase completado (si fue necesario)."
    );
    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Supabase Middleware] Fallo al actualizar la sesión.", {
      error: errorMessage,
      traceId,
    });
    // Devuelve la respuesta original sin modificar para no interrumpir el flujo.
    return response;
  } finally {
    logger.endTrace(traceId);
  }
}
