// RUTA: src/shared/lib/ssg/engine/types.ts
/**
 * @file types.ts
 * @description SSoT para los contratos de tipos del Motor de Forja.
 *              v2.0.0 (Theming Sovereignty): Se enriquece el BuildContext para
 *              incluir el tema ya ensamblado, centralizando la lógica de theming.
 * @version 2.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { logger } from "@/shared/lib/logging";
import type { AssembledTheme } from "@/shared/lib/schemas/theming/assembled-theme.schema";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";

logger.trace(
  "[ssg/engine/types.ts] Módulo de tipos del motor SSG v2.0 cargado."
);

/**
 * @interface BuildContext
 * @description El objeto de estado que fluye a través del pipeline de build.
 *              Contiene todos los datos necesarios para cada tarea.
 */
export interface BuildContext {
  draft: CampaignDraft;
  theme: AssembledTheme; // <-- APARATO NIVELADO: El tema ensamblado es ahora parte del contrato.
  tempDir: string;
  buildDir: string;
  zipPath: string;
}

/**
 * @interface BuildTask
 * @description El contrato para una tarea atómica dentro del pipeline.
 */
export interface BuildTask {
  name: string;
  execute: (context: BuildContext) => Promise<void>;
}
