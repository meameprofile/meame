// RUTA: supabase/functions/_shared/supabase-client.ts
/**
 * @file supabase-client.ts
 * @description SSoT para la creación de un cliente de Supabase seguro
 *              y de servicio para el entorno de las Edge Functions (Deno).
 * @version 1.0.0
 * @author L.I.A. Legacy
 */

// Las importaciones utilizan los alias de 'import_map.json'
import { createClient } from "@supabase/supabase-js";
import { corsHeaders } from "@/cors.ts";

/**
 * @function createSupabaseAdminClient
 * @description Crea una instancia del cliente de Supabase utilizando la clave de rol de servicio.
 * @returns Instancia del cliente Supabase.
 * @throws {Error} Si las variables de entorno no están configuradas.
 */
export function createSupabaseAdminClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Las variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no están definidas."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    global: {
      headers: {
        ...corsHeaders,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    },
  });
}
