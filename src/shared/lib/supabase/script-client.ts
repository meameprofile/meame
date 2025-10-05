// RUTA: src/shared/lib/supabase/script-client.ts
/**
 * @file script-client.ts
 * @description SSoT para la creación de un cliente de Supabase aislado y
 *              seguro, para uso EXCLUSIVO en scripts del lado del servidor (Node.js).
 *              v5.0.0 (Runtime Agnostic): Se elimina la directiva 'server-only' para
 *              garantizar la compatibilidad con el entorno de ejecución de Node.js.
 * @version 5.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import chalk from "chalk";

// Guardia de configuración a nivel de módulo para fallar rápido.
try {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    throw new Error(
      "Las variables de entorno de Supabase (URL y SERVICE_ROLE_KEY) no están definidas."
    );
  }
} catch (error) {
  const errorMessage =
    error instanceof Error ? error.message : "Error desconocido.";
  console.error(
    chalk.red.bold(
      `[Supabase Script Client] CRÍTICO: Fallo de configuración inicial. ${errorMessage}`
    )
  );
  throw error;
}

/**
 * @function createScriptClient
 * @description Crea y devuelve una instancia del cliente de Supabase autenticada
 *              con la clave de rol de servicio para operaciones de backend.
 * @returns Una instancia del cliente de Supabase.
 */
export function createScriptClient() {
  console.log(
    chalk.gray(
      "[Supabase] Creando instancia de cliente para SCRIPT (v5.0 - Runtime Agnostic)..."
    )
  );
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
