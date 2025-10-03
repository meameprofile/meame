// RUTA: shared/lib/types/object-hash.d.ts
/**
 * @file object-hash.d.ts
 * @description Archivo de declaración de módulo local para la librería `object-hash`.
 *              Resolución final del error `TS7016` y advertencia de `no-explicit-any`,
 *              proporcionando un tipado robusto para su uso en scripts.
 *              v1.2.0 (Corrected Typing & Module Load Observability): Se corrige el tipado
 *              para reflejar la API real de `object-hash` y se añade un log de traza
 *              al inicio del módulo para confirmar su carga.
 * @version 1.2.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { logger } from "@/shared/lib/logging"; // Importa el logger

// --- INICIO DE MEJORA: OBSERVABILIDAD DE CARGA DE MÓDULO ---
logger.trace(
  "[object-hash.d.ts] Módulo de declaración de tipos 'object-hash' cargado y listo para usar."
);
// --- FIN DE MEJORA: OBSERVABILIDAD DE CARGA DE MÓDULO ---

declare module "object-hash" {
  /**
   * Genera un hash consistente para cualquier objeto JavaScript.
   * @param object El objeto a hashear. Se usa `unknown` para permitir cualquier tipo.
   * @param options Opciones de configuración para el hashing. Se usa `Record<string, unknown>`
   *                para permitir opciones arbitrarias de forma segura.
   * @returns El hash del objeto como una cadena de texto.
   */
  function objectHash(
    object: unknown,
    options?: {
      algorithm?: string;
      encoding?: string;
      excludeKeys?: (key: string) => boolean | RegExp;
      respectType?: boolean;
      unorderedArrays?: boolean;
      unorderedSets?: boolean;
      unorderedObjects?: boolean;
      replacer?: (key: string, value: unknown) => unknown;
    }
  ): string;
  export = objectHash;
}
