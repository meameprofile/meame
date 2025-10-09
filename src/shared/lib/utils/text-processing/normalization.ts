// RUTA: src/shared/lib/utils/text-processing/normalization.ts
/**
 * @file normalization.ts
 * @description SSoT y motor de utilidades puras para la normalización y sanitización de texto.
 * @version 1.0.0 (Sovereign & Elite)
 * @author RaZ Podestá - MetaShark Tech
 * @see _docs/supabase/008_MANIFIESTO_NORMALIZACION_Y_SANITIZACION.md
 */
import { logger } from "@/shared/lib/logging";

logger.trace("[normalization.ts] Módulo de normalización de texto cargado.");

/**
 * @function normalizeStringForId
 * @description Aplica el protocolo de normalización y sanitización soberano a una cadena de texto.
 * @param {string | undefined | null} input - La cadena de entrada a procesar.
 * @returns {string} La cadena normalizada, sanitizada y segura.
 */
export function normalizeStringForId(input: string | undefined | null): string {
  if (!input) {
    return "";
  }

  return input
    .toLowerCase() // 1. Convertir a minúsculas
    .trim() // Eliminar espacios al inicio y final
    .replace(/[\s_]+/g, "-") // 2. Reemplazar espacios y guiones bajos por guiones
    .replace(/[^a-z0-9-]/g, "") // 2. Sanitizar: eliminar caracteres no seguros
    .replace(/-+/g, "-") // 3. Colapsar guiones múltiples
    .replace(/^-+|-+$/g, ""); // 4. Recortar guiones en los extremos
}
