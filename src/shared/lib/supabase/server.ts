// RUTA: src/shared/lib/supabase/server.ts
/**
 * @file server.ts
 * @description SSoT para la creación del cliente de Supabase en el servidor.
 *              Forjado con conciencia de tipos de la base de datos, observabilidad de élite
 *              y manejo de errores resiliente para contextos de solo lectura.
 * @version 6.0.0 (Database Type-Aware & Elite Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import {
  createServerClient as supabaseCreateServerClient,
  type CookieOptions,
} from "@supabase/ssr";
import { cookies } from "next/headers";
import { logger } from "@/shared/lib/logging";
import type { Database } from "./database.types"; // <-- ¡CONCIENCIA DE TIPOS SOBERANA!

export function createServerClient() {
  logger.trace(
    "[Supabase Client] Creando nueva instancia del cliente para el servidor (v6.0 Type-Aware)..."
  );
  const cookieStore = cookies();

  return supabaseCreateServerClient<Database>( // <-- TIPO DE DATABASE APLICADO
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
            // Guardián de Resiliencia: Se espera en contextos de solo lectura como SSG.
            logger.warn(
              "[Supabase Client] No se pudo establecer la cookie. El contexto puede ser de solo lectura.",
              { error }
            );
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // Guardián de Resiliencia: Se espera en contextos de solo lectura.
            logger.warn(
              "[Supabase Client] No se pudo eliminar la cookie. El contexto puede ser de solo lectura.",
              { error }
            );
          }
        },
      },
    }
  );
}
// FIN DEL APARATO
