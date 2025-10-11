// RUTA: scripts/supabase/schema-i18n_content_entries.ts
/**
 * @file schema-i18n_content_entries.ts
 * @description Guardián de Esquema para la tabla de internacionalización.
 * @version 1.0.0
 * @author L.I.A. Legacy
 */
import { scriptLogger as logger } from "../_utils/logger";
import { runTableAudit } from "./_utils/runTableAudit";

const TARGET_TABLE = "i18n_content_entries";

async function diagnoseI18nSchema() {
  const traceId = logger.startTrace(`diagnoseSchema:${TARGET_TABLE}_v1.0`);
  const groupId = logger.startGroup(
    `🔬 Auditando Esquema de la Tabla: '${TARGET_TABLE}'...`
  );

  const instructionsForAI = [
    `Este es un informe de diagnóstico estructural para la tabla '${TARGET_TABLE}'.`,
    "Analiza 'columns' para verificar la existencia y tipo de 'entry_key' (text), 'translations' (jsonb), y 'domain' (text).",
    "Verifica en 'constraints' que 'entry_key' sea la PRIMARY KEY.",
    "'rls_policies' debe confirmar que existe una política de LECTURA PÚBLICA ('SELECT' con 'USING (true)').",
  ];

  await runTableAudit(TARGET_TABLE, instructionsForAI, traceId);

  logger.endGroup(groupId);
  logger.endTrace(traceId);
}

diagnoseI18nSchema();
