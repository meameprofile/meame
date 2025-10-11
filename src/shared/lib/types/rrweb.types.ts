// RUTA: shared/lib/types/rrweb.types.ts
/**
 * @file rrweb.types.ts
 * @description SSoT interna para los contratos de tipos de la librería rrweb.
 *              Esta abstracción nos hace resilientes a problemas de resolución
 *              del paquete externo `@rrweb/types`, eliminando una fuente
 *              crítica de inestabilidad del build.
 *              v1.1.0 (Module Load Observability): Se añade un log de traza
 *              al inicio del módulo para confirmar su carga, cumpliendo con el
 *              Pilar III de Observabilidad.
 * @version 1.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { logger } from "@/shared/lib/logging"; // Importa el logger

// --- INICIO DE MEJORA: OBSERVABILIDAD DE CARGA DE MÓDULO ---
logger.trace(
  "[rrweb.types.ts] Módulo de tipos 'rrweb' cargado y listo para usar."
);
// --- FIN DE MEJORA: OBSERVABILIDAD DE CARGA DE MÓDULO ---

/**
 * @type eventWithTime
 * @description Contrato de datos para un evento de rrweb. La propiedad `data`
 *              se define como `unknown` para coincidir con la salida real de
 *              la librería y garantizar la seguridad de tipos. Cualquier consumidor
 *              de este dato deberá realizar una validación o aserción de tipo explícita.
 */
export interface eventWithTime {
  type: number;
  data: unknown;
  timestamp: number;
  delay?: number;
}
