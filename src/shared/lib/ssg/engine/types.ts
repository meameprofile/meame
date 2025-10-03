// RUTA: shared/lib/ssg/engine/types.ts
/**
 * @file types.ts
 * @description SSoT para los contratos de tipos del Motor de Forja.
 *              v1.1.0 (Module Load Observability): Se añade un log de traza
 *              al inicio del módulo para confirmar su carga, cumpliendo con el
 *              Pilar III de Observabilidad.
 * @version 1.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types"; // Correcto: se mantiene la ruta de importación desde @shared
import { logger } from "@/shared/lib/logging"; // Importa el logger

// --- INICIO DE MEJORA: OBSERVABILIDAD DE CARGA DE MÓDULO ---
logger.trace(
  "[ssg/engine/types.ts] Módulo de tipos del motor SSG cargado y listo para usar."
);
// --- FIN DE MEJORA: OBSERVABILIDAD DE CARGA DE MÓDULO ---

/**
 * @interface BuildContext
 * @description El objeto de estado que fluye a través del pipeline de build.
 *              Contiene todos los datos necesarios para cada tarea.
 */
export interface BuildContext {
  draft: CampaignDraft;
  tempDir: string; // Directorio temporal principal para el build
  buildDir: string; // Directorio de salida de Next.js (`/out`)
  zipPath: string; // Ruta final del archivo .zip
}

/**
 * @interface BuildTask
 * @description El contrato para una tarea atómica dentro del pipeline.
 */
export interface BuildTask {
  name: string;
  execute: (context: BuildContext) => Promise<void>;
}
