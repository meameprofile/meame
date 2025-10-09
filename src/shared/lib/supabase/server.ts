// RUTA: src/shared/lib/supabase/server.ts
/**
 * @file server.ts
 * @description SSoT para la creación del cliente de Supabase en el servidor.
 *              v7.0.0 (Explicit Type Sovereignty): Se fuerza explícitamente el tipo
 *              de retorno para resolver el error de inferencia circular TS7022.
 * @version 7.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import {
  createServerClient as supabaseCreateServerClient,
  type CookieOptions,
} from "@supabase/ssr";
import { cookies } from "next/headers";
import { logger } from "@/shared/lib/logging";
import type { Database } from "./database.types";
import type { SupabaseClient } from "@supabase/supabase-js";

export function createServerClient(): SupabaseClient<Database> {
  // <--- TIPO DE RETORNO EXPLÍCITO
  logger.trace(
    "[Supabase Client] Creando nueva instancia del cliente para el servidor (v7.0 Type-Safe)..."
  );
  const cookieStore = cookies();

  return supabaseCreateServerClient<Database>(
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
