// Ruta correcta: src/shared/lib/utils/cn.ts
/**
 * @file cn.ts
 * @description Aparato de utilidad y SSoT para la fusión de clases de Tailwind CSS.
 *              Combina la flexibilidad de `clsx` para clases condicionales con la
 *              inteligencia de `tailwind-merge` para resolver conflictos de utilidad.
 *              v1.1.0 (Module Load Observability): Se añade un log de traza
 *              al inicio del módulo para confirmar su carga, cumpliendo con el
 *              Pilar III de Observabilidad.
 * @version 1.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { logger } from "@/shared/lib/logging"; // Importa el logger

// --- INICIO DE MEJORA: OBSERVABILIDAD DE CARGA DE MÓDULO ---
logger.trace("[cn.ts] Módulo de utilidad 'cn' cargado y listo para usar.");
// --- FIN DE MEJORA: OBSERVABILIDAD DE CARGA DE MÓDULO ---

/**
 * @function cn
 * @description Fusiona inteligentemente clases de Tailwind CSS.
 * @param {...ClassValue[]} inputs - Una secuencia de valores de clase.
 * @returns {string} Una cadena de texto con las clases finales y sin conflictos.
 */
export function cn(...inputs: ClassValue[]): string {
  // No se añade logging aquí para evitar ruido excesivo, ya que es una función de alta frecuencia.
  return twMerge(clsx(inputs));
}
