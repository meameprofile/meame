// pnpm tsx scripts/_utils/supabaseClient.ts
/**
 * @file supabaseClient.ts
 * @description SSoT para la creación de un cliente de Supabase aislado y
 *              seguro, para uso EXCLUSIVO en scripts del lado del servidor (Node.js).
 *              Ubicado en _utils/ por directiva explícita.
 * @version 7.0.0 (Sovereign & Singleton)
 * @author L.I.A. Legacy
 */
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { scriptLogger } from "./logger";
import { loadEnvironment } from "./env";

// Cargar las variables de entorno al iniciar el módulo.
loadEnvironment(["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

let supabaseAdminClient: ReturnType<typeof createSupabaseClient> | null = null;

/**
 * @function createScriptClient
 * @description Crea y devuelve una instancia Singleton del cliente de Supabase
 *              autenticada con la clave de rol de servicio para operaciones de backend.
 * @returns Una instancia del cliente de Supabase.
 */
export function createScriptClient() {
  if (supabaseAdminClient) {
    scriptLogger.trace(
      "[Supabase Client] Reutilizando instancia Singleton del cliente para script."
    );
    return supabaseAdminClient;
  }

  scriptLogger.info(
    "[Supabase Client] Creando nueva instancia Singleton del cliente para script (v7.0)."
  );
  supabaseAdminClient = createSupabaseClient(supabaseUrl, supabaseServiceKey);
  return supabaseAdminClient;
}
