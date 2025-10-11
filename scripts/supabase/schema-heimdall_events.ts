// RUTA: scripts/supabase/schema-heimdall_events.ts
/**
 * @file schema-heimdall_events.ts
 * @description Guardián de Esquema SOBERANO para la tabla 'heimdall_events',
 *              nivelado para cumplir con el contrato del logger v20+.
 * @version 2.1.0 (Logger Contract Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import { promises as fs } from "fs";
import * as path from "path";

import { z } from "zod";

import { scriptLogger as logger } from "../_utils/logger";
import { createScriptClient } from "../_utils/supabaseClient";
import type { ScriptActionResult } from "../_utils/types";

const ColumnSchema = z.object({
  table: z.string(),
  column: z.string(),
  type: z.string(),
});
const SystemDiagnosticsSchema = z.object({
  schema_columns: z.array(ColumnSchema),
});

interface Report {
  reportMetadata: {
    script: string;
    targetTable: string;
    purpose: string;
    generatedAt: string;
  };
  instructionsForAI: string[];
  auditStatus: "SUCCESS" | "FAILED";
  schemaDetails: { columns: z.infer<typeof ColumnSchema>[] };
  summary: string;
}

const TARGET_TABLE = "heimdall_events";

async function diagnoseHeimdallSchema(): Promise<ScriptActionResult<string>> {
  const traceId = logger.startTrace(`diagnoseSchema:${TARGET_TABLE}_v2.1`);
  // --- [INICIO DE CORRECCIÓN DE CONTRATO v2.1.0] ---
  const groupId = logger.startGroup(
    `🔬 Auditando Esquema de la Tabla: '${TARGET_TABLE}'...`
  );
  // --- [FIN DE CORRECCIÓN DE CONTRATO v2.1.0] ---

  const reportDir = path.resolve(process.cwd(), "reports", "telemetry");
  const reportPath = path.resolve(reportDir, `schema-${TARGET_TABLE}.json`);

  const report: Report = {
    reportMetadata: {
      script: `scripts/supabase/schema-${TARGET_TABLE}.ts`,
      targetTable: TARGET_TABLE,
      purpose: `Diagnóstico estructural de la tabla '${TARGET_TABLE}'.`,
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      `Este es un informe estructural para la tabla '${TARGET_TABLE}', el corazón del Protocolo Heimdall.`,
      "Verifica que las columnas 'event_id', 'trace_id', 'status', 'timestamp', 'duration_ms', 'payload', 'context' existan con los tipos correctos.",
      "Confirma que las columnas 'payload' y 'context' son de tipo 'jsonb'.",
    ],
    auditStatus: "FAILED",
    schemaDetails: { columns: [] },
    summary: "",
  };

  try {
    const supabase = createScriptClient();
    const { data, error } = await supabase.rpc("get_system_diagnostics");
    if (error) throw new Error(`Fallo en RPC: ${error.message}`);

    const validation = SystemDiagnosticsSchema.safeParse(data);
    if (!validation.success)
      throw new Error("Los datos de la RPC no cumplen con el schema esperado.");

    report.schemaDetails.columns = validation.data.schema_columns.filter(
      (c) => c.table === TARGET_TABLE
    );

    if (report.schemaDetails.columns.length === 0) {
      throw new Error(
        `La tabla '${TARGET_TABLE}' no fue encontrada en el esquema.`
      );
    }

    console.table(report.schemaDetails.columns);
    report.auditStatus = "SUCCESS";
    report.summary = `Auditoría de esquema para '${TARGET_TABLE}' completada con éxito.`;
    logger.success(report.summary);
    return { success: true, data: report.summary };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error desconocido.";
    report.summary = `Auditoría de esquema fallida: ${msg}`;
    logger.error(report.summary, { traceId });
    return { success: false, error: msg };
  } finally {
    await fs.mkdir(reportDir, { recursive: true }).catch(() => {});
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    logger.info(
      `Informe guardado en: ${path.relative(process.cwd(), reportPath)}`
    );
    // --- [INICIO DE CORRECCIÓN DE CONTRATO v2.1.0] ---
    logger.endGroup(groupId);
    logger.endTrace(traceId);
    // --- [FIN DE CORRECCIÓN DE CONTRATO v2.1.0] ---
    if (report.auditStatus === "FAILED") process.exit(1);
  }
}

diagnoseHeimdallSchema();
