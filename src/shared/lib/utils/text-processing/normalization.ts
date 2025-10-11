// RUTA: src/shared/lib/utils/text-processing/normalization.ts
/**
 * @file normalization.ts
 * @description SSoT y motor de utilidades puras para la normalización y sanitización de texto.
 * @version 2.0.0 (Resilient Algorithm)
 * @author RaZ Podestá - MetaShark Tech
 * @see _docs/PROTOCOLO DE NORMALIZACION_Y_SANITIZACION_DE_DATOS.md
 */
import { logger } from "@/shared/lib/logging";

logger.trace(
  "[normalization.ts] Módulo de normalización de texto cargado (v2.0)."
);

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

  // --- [INICIO DE REFACTORIZACIÓN DE ALGORITMO v2.0.0] ---
  return (
    input
      .toLowerCase() // 1. Convertir a minúsculas
      .trim() // Eliminar espacios al inicio y final
      // 2. Reemplazar cualquier secuencia de uno o más caracteres no alfanuméricos por un único guion.
      .replace(/[^a-z0-9]+/g, "-")
      // 3. Recortar guiones que puedan haber quedado en los extremos.
      .replace(/^-+|-+$/g, "")
  );
  // --- [FIN DE REFACTORIZACIÓN DE ALGORITMO v2.0.0] ---
}
