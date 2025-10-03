// Ruta correcta: src/shared/lib/utils/index.ts
/**
 * @file index.ts (Barrel File)
 * @description Fachada pública para las utilidades del proyecto.
 *              Refactorizado para reflejar la estructura de archivos soberana y
 *              actuar como una Single Source of Truth (SSoT) para la importación
 *              de utilidades comunes.
 *              v1.0.0 (Module Load Observability & Version Sync): Se añade un log de traza
 *              al inicio del módulo para confirmar su carga y se sincroniza la versión.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */

import { logger } from "@/shared/lib/logging"; // Importa el logger

// --- INICIO DE MEJORA: OBSERVABILIDAD DE CARGA DE MÓDULO ---
logger.trace(
  "[index.ts] Módulo de utilidades generales cargado y listo para usar."
);
// --- FIN DE MEJORA: OBSERVABILIDAD DE CARGA DE MÓDULO ---

// Exporta desde la SSoT canónica de cada utilidad.
export * from "./cn";
export * from "./merge";
export * from "./constants";
