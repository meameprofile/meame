// RUTA: scripts/supabase/schema-user-profile-summary.ts
/**
 * @file schema-user-profile-summary.ts
 * @description Guardián de Esquema para la tabla `user_profile_summary`.
 * @version 2.0.0 (Logger v20+ Contract Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import { scriptLogger as logger } from "../_utils/logger";
import { runTableAudit } from "./_utils/runTableAudit";

const TARGET_TABLE = "user_profile_summary";

async function diagnoseUserProfileSummarySchema() {
  const traceId = logger.startTrace(`diagnoseSchema:${TARGET_TABLE}`);
  const groupId = logger.startGroup(
    `🔬 Auditando Esquema de la Tabla: '${TARGET_TABLE}'...`
  );

  const instructionsForAI = [
    `Este es un informe de diagnóstico estructural para la tabla '${TARGET_TABLE}', el Data Mart de perfiles de usuario.`,
    "Verifica que las columnas de métricas como 'total_sessions', 'total_events', 'first_seen_at', 'last_seen_at' existan.",
    "'constraints' debe validar que 'id' es una PRIMARY KEY y FOREIGN KEY hacia 'auth.users'.",
    "Esta tabla no debería tener políticas RLS, ya que solo es accesible por roles de servicio y funciones de base de datos.",
  ];

  await runTableAudit(TARGET_TABLE, instructionsForAI, traceId);

  logger.endGroup(groupId);
  logger.endTrace(traceId);
}

diagnoseUserProfileSummarySchema();
