// RUTA: scripts/supabase/schema-visitor-sessions.ts
/**
 * @file schema-visitor-sessions.ts
 * @description Guardián de Esquema para la tabla `visitor_sessions`.
 * @version 2.0.0 (Logger v20+ Contract Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import { scriptLogger as logger } from "../_utils/logger";

import { runTableAudit } from "./_utils/runTableAudit";

const TARGET_TABLE = "visitor_sessions";

async function diagnoseVisitorSessionsSchema() {
  const traceId = logger.startTrace(`diagnoseSchema:${TARGET_TABLE}`);
  const groupId = logger.startGroup(
    `🔬 Auditando Esquema de la Tabla: '${TARGET_TABLE}'...`
  );

  const instructionsForAI = [
    `Este es un informe para la tabla '${TARGET_TABLE}', la SSoT de sesiones de visitantes.`,
    "Verifica la existencia de 'session_id' (PK), 'fingerprint_id', 'user_id' (FK a auth.users), y las columnas encriptadas.",
    "Confirma que no hay políticas RLS, ya que esta tabla es de acceso exclusivo para el backend.",
  ];

  await runTableAudit(TARGET_TABLE, instructionsForAI, traceId);

  logger.endGroup(groupId);
  logger.endTrace(traceId);
}

diagnoseVisitorSessionsSchema();
