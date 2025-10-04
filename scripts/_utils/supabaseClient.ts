// RUTA: scripts/_utils/supabaseClient.ts
/**
 * @file supabaseClient.ts
 * @description SSoT para la creación de un cliente de Supabase aislado,
 *              seguro y con seguridad de tipos para scripts del lado del servidor.
 * @version 8.1.0 (Resilient Path Resolution)
 * @author L.I.A. Legacy
 */
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { scriptLogger } from "./logger";
import { loadEnvironment } from "./env";
// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
// Se reemplaza el alias '@/' por una ruta relativa para resolver el error TS2307
// en el contexto de ejecución de los scripts.
import type { Database } from "../../src/shared/lib/supabase/database.types";
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA] ---

loadEnvironment(["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

let supabaseAdminClient: ReturnType<
  typeof createSupabaseClient<Database>
> | null = null;

export function createScriptClient() {
  if (supabaseAdminClient) {
    scriptLogger.trace(
      "[Supabase Client] Reutilizando instancia Singleton del cliente para script."
    );
    return supabaseAdminClient;
  }

  scriptLogger.info(
    "[Supabase Client] Creando nueva instancia Singleton del cliente para script (v8.1 Type-Aware)."
  );
  // Se aplica el tipo 'Database' al crear el cliente
  supabaseAdminClient = createSupabaseClient<Database>(
    supabaseUrl,
    supabaseServiceKey
  );
  return supabaseAdminClient;
}
