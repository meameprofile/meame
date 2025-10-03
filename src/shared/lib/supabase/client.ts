// Ruta correcta: src/shared/lib/supabase/client.ts
/**
 * @file client.ts
 * @description SSoT para la creación del cliente de Supabase del lado del navegador.
 *              Este cliente es un Singleton, asegurando que se cree una única
 *              instancia para toda la aplicación del lado del cliente.
 * @version 2.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { createBrowserClient } from "@supabase/ssr";
import { logger } from "@/shared/lib/logging";

// Inyección de Observabilidad: Se registra la creación del cliente Singleton.
logger.info(
  "[Supabase Client] Creando instancia Singleton del cliente de navegador."
);

/**
 * @function createClient
 * @description Función de fábrica que devuelve la instancia Singleton del
 *              cliente de Supabase para el navegador. Utiliza `createBrowserClient`
 *              del paquete `@supabase/ssr` que está diseñado para manejar la
 *              autenticación en entornos de cliente de forma segura. [1, 2, 3]
 * @returns La instancia del cliente de Supabase.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
// Ruta correcta: src/shared/lib/supabase/client.ts
