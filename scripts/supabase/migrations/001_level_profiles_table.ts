// scripts/supabase/migrations/001_level_profiles_table.ts

// EJECUTE pnpm tsx scripts/supabase/migrations/001_level_profiles_table.ts

/**
 * @file 001_level_profiles_table.ts
 * @description Script generador de SQL para alinear la tabla `profiles`
 *              con su manifiesto soberano v4.0.
 * @version 2.0.0 (SQL Generator)
 * @author L.I.A. Legacy
 */
import { scriptLogger } from "../../_utils/logger";

function generateLevelingSql() {
  const traceId = scriptLogger.startTrace("generateLevelingSqlForProfiles");
  scriptLogger.startGroup("Generando SQL de nivelación para `profiles`...");

  const migrationQueries = `
-- ============================================================================
-- MIGRACIÓN QUIRÚRGICA PARA LA TABLA 'profiles' (v4.0)
-- Generado: ${new Date().toISOString()}
-- Por favor, revise y ejecute este script en el Editor SQL de Supabase.
-- ============================================================================

-- SENTENCIA 1: Añadir las columnas faltantes para la identidad multi-proveedor.
-- El comando 'ADD COLUMN IF NOT EXISTS' es seguro y no destructivo.
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS provider_name TEXT,
ADD COLUMN IF NOT EXISTS provider_avatar_url TEXT;

-- SENTENCIA 2 (Recomendación de Higiene): Eliminar columnas extrañas.
-- Estas columnas pertenecen al dominio de Visitor Intelligence.
-- Se recomienda migrarlas a 'visitor_sessions' y luego eliminarlas de aquí.
-- ALTER TABLE public.profiles
-- DROP COLUMN IF EXISTS last_sign_in_at,
-- DROP COLUMN IF EXISTS last_sign_in_ip,
-- DROP COLUMN IF EXISTS last_sign_in_location;

-- SENTENCIA 3: Fortalecer la política RLS de INSERT para cerrar la vulnerabilidad.
-- Se elimina la política permisiva y se crea la correcta con la cláusula WITH CHECK.
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile."
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- SENTENCIA 4: Asegurar que el trigger de 'updated_at' exista.
-- moddatetime es una función de extensión de Supabase que debe estar habilitada.
CREATE OR REPLACE TRIGGER on_profile_update
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION moddatetime(updated_at);

-- ============================================================================
-- FIN DE LA MIGRACIÓN
-- ============================================================================
  `;

  // Imprime el SQL generado en la consola para que el desarrollador lo copie.
  console.log(
    "\n\n-- COPIE Y PEGUE EL SIGUIENTE SQL EN EL EDITOR DE SUPABASE --\n"
  );
  console.log(migrationQueries);
  console.log("\n-- FIN DEL SCRIPT SQL --\n\n");

  scriptLogger.success(
    "El script SQL de nivelación ha sido generado en la consola."
  );
  scriptLogger.endGroup();
  scriptLogger.endTrace(traceId);
}

generateLevelingSql();
