// RUTA: scripts/supabase/schema-aura-insights.ts
/**
 * @file schema-aura-insights.ts
 * @description Guardián de Esquema para la tabla `aura_insights`.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */

import { scriptLogger as logger } from "../_utils/logger";
import { runTableAudit } from "./_utils/runTableAudit";

const TARGET_TABLE = "aura_insights";

async function diagnoseAuraInsightsSchema() {
  const traceId = logger.startTrace(`diagnoseSchema:${TARGET_TABLE}`);
  logger.startGroup(`🔬 Auditando Esquema de la Tabla: '${TARGET_TABLE}'...`);

  const instructionsForAI = [
    `Este es un informe de diagnóstico estructural para la tabla '${TARGET_TABLE}', la bóveda de inteligencia de Temeo AI.`,
    "Analiza 'columns' para verificar la existencia de 'title', 'description', 'severity', 'recommendation', 'related_data' y 'is_resolved'.",
    "'constraints' debe validar que 'id' es PRIMARY KEY y que 'workspace_id' tiene una FOREIGN KEY hacia 'workspaces'.",
    "'rls_policies' debe confirmar que el acceso está gobernado por la membresía al workspace.",
  ];

  await runTableAudit(TARGET_TABLE, instructionsForAI, traceId);

  logger.endGroup();
  logger.endTrace(traceId);
}

diagnoseAuraInsightsSchema();
