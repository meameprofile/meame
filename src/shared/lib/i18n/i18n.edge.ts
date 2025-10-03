// shared/lib/i18n/i18n.edge.ts
/**
 * @file i18n.edge.ts
 * @description SSoT de carga de activos JSON para el Vercel Edge Runtime.
 * @version 3.0.0 (Holistic Elite Compliance & Observability Fix)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import { type Locale } from "@/shared/lib/i18n/i18n.config";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import { logger } from "@/shared/lib/logging";

/**
 * @function loadEdgeJsonAsset
 * @description Utilidad genérica y reutilizable para cargar cualquier activo JSON
 *              desde /public usando fetch. Es Edge-compatible.
 * @template T - El tipo esperado del contenido del JSON.
 * @param {...string[]} pathSegments - Los segmentos de ruta del archivo dentro de /public.
 * @returns {Promise<T>} El contenido del archivo JSON, parseado y tipado.
 * @throws {Error} Si la petición fetch falla o el parseo JSON es incorrecto.
 */
export async function loadEdgeJsonAsset<T>(
  ...pathSegments: string[]
): Promise<T> {
  const finalPath = pathSegments.join("/");
  const traceId = logger.startTrace(`loadEdgeJsonAsset:${finalPath}`);
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    const response = await fetch(`${baseUrl}/${finalPath}`);

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} for path: ${finalPath}`
      );
    }
    logger.traceEvent(
      traceId,
      "Activo JSON cargado exitosamente desde el Edge."
    );
    return (await response.json()) as T;
  } catch (error) {
    logger.error(`[loadEdgeJsonAsset] Fallo al hacer fetch del activo.`, {
      path: finalPath,
      error,
      traceId,
    });
    throw error;
  } finally {
    logger.endTrace(traceId);
  }
}

/**
 * @function getEdgeDictionary
 * @description Obtiene un diccionario, consumiendo la utilidad genérica.
 *              Es resiliente: en caso de error, devuelve un objeto vacío.
 * @param {Locale} locale - El locale a obtener.
 * @returns {Promise<{ dictionary: Partial<Dictionary> }>}
 */
export async function getEdgeDictionary(
  locale: Locale
): Promise<{ dictionary: Partial<Dictionary> }> {
  try {
    const dictionary = await loadEdgeJsonAsset<Dictionary>(
      "locales",
      `${locale}.json`
    );
    return { dictionary };
  } catch (error) {
    // --- [INICIO DE CORRECCIÓN DE OBSERVABILIDAD Y LINTING] ---
    // El objeto de error capturado ahora se pasa al logger.
    logger.error(
      `[i18n.edge] Fallo al obtener el diccionario para '${locale}'. Se devolverá un objeto vacío.`,
      { error }
    );
    // --- [FIN DE CORRECCIÓN DE OBSERVABILIDAD Y LINTING] ---
    return { dictionary: {} };
  }
}
// shared/lib/i18n/i18n.edge.ts
