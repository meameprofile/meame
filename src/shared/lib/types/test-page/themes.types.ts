// RUTA: shared/lib/types/test-page/themes.types.ts
/**
 * @file themes.types.ts
 * @description SSoT para los tipos de datos compartidos entre los componentes
 *              de servidor y cliente de la página de prueba de temas.
 *              v1.1.0 (Module Load Observability): Se añade un log de traza
 *              al inicio del módulo para confirmar su carga, cumpliendo con el
 *              Pilar III de Observabilidad.
 * @version 1.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { logger } from "@/shared/lib/logging"; // Importa el logger
import type { AssembledTheme } from "@/shared/lib/schemas/theming/assembled-theme.schema";

// --- INICIO DE MEJORA: OBSERVABILIDAD DE CARGA DE MÓDULO ---
logger.trace(
  "[themes.types.ts] Módulo de tipos de temas de página de prueba cargado y listo para usar."
);
// --- FIN DE MEJORA: OBSERVABILIDAD DE CARGA DE MÓDULO ---

export interface AvailableTheme {
  id: string;
  name: string;
  themeData: AssembledTheme;
}
