// RUTA: src/shared/lib/supabase/server.ts
/**
 * @file server.ts
 * @description SSoT para la creación del cliente de Supabase en el servidor.
 *              Forjado con observabilidad de élite y manejo de errores resiliente
 *              para contextos de solo lectura.
 * @version 5.0.0 (Elite Observability & Resilience)
 *@author RaZ Podestá - MetaShark Tech
 */
import {
  createServerClient as supabaseCreateServerClient,
  type CookieOptions,
} from "@supabase/ssr";
import { cookies } from "next/headers";
import { logger } from "@/shared/lib/logging";

export function createServerClient() {
  logger.trace(
    "[Supabase Client] Creando nueva instancia del cliente para el servidor (v5.0 - Elite)..."
  );
  const cookieStore = cookies();

  return supabaseCreateServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // --- [INICIO DE REFACTORIZACIÓN DE RESILIENCIA Y OBSERVABILIDAD] ---
            // Se captura y registra la advertencia. Esto es esperado en contextos
            // de solo lectura como la generación de páginas estáticas (SSG).
            logger.warn(
              "[Supabase Client] No se pudo establecer la cookie. El contexto puede ser de solo lectura.",
              { error }
            );
            // --- [FIN DE REFACTORIZACIÓN] ---
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // --- [INICIO DE REFACTORIZACIÓN DE RESILIENCIA Y OBSERVABILIDAD] ---
            // Se captura y registra la advertencia por la misma razón que en 'set'.
            logger.warn(
              "[Supabase Client] No se pudo eliminar la cookie. El contexto puede ser de solo lectura.",
              { error }
            );
            // --- [FIN DE REFACTORIZACIÓN] ---
          }
        },
      },
    }
  );
}
