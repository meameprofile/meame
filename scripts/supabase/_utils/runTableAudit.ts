// scripts/supabase/_utils/runTableAudit.ts
/**
 * @file runTableAudit.ts
 * @description Motor de auditoría soberano y reutilizable para esquemas de tablas de Supabase.
 * @version 1.1.0 (Elite Code Hygiene)
 * @author RaZ Podestá - MetaShark Tech
 */

import { promises as fs } from "fs";
import * as path from "path";

import { z } from "zod";

import { scriptLogger as logger } from "../../_utils/logger";
import { createScriptClient } from "../../_utils/supabaseClient";
import type { ScriptActionResult } from "../../_utils/types";

// --- SSoT de Contratos de Datos para la Respuesta COMPLETA de la RPC ---
const ColumnSchema = z.object({
  table: z.string(),
  column: z.string(),
  type: z.string(),
});
const ConstraintSchema = z.object({
  table: z.string(),
  constraint_name: z.string(),
  type: z.string(),
});
const IndexSchema = z.object({ table: z.string(), index_name: z.string() });
const RlsPolicySchema = z.object({
  table: z.string(),
  policy_name: z.string(),
  command: z.string(),
  definition: z.string().nullable(),
});
const TriggerSchema = z.object({
  trigger_name: z.string(),
  table: z.string(),
  timing: z.string(),
  event: z.string(),
});

const SystemDiagnosticsSchema = z.object({
  schema_columns: z.array(ColumnSchema),
  table_constraints: z.array(ConstraintSchema),
  indexes: z.array(IndexSchema),
  rls_policies: z.array(RlsPolicySchema),
  triggers: z.array(TriggerSchema),
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
  schemaDetails: {
    columns: z.infer<typeof ColumnSchema>[];
    constraints: z.infer<typeof ConstraintSchema>[];
    indexes: z.infer<typeof IndexSchema>[];
    rls_policies: z.infer<typeof RlsPolicySchema>[];
    triggers: z.infer<typeof TriggerSchema>[];
  };
  summary: string;
}

export async function runTableAudit(
  targetTable: string,
  instructionsForAI: string[],
  traceId: string
): Promise<ScriptActionResult<string>> {
  const reportDir = path.resolve(process.cwd(), "reports", "supabase");
  const reportPath = path.resolve(reportDir, `schema-${targetTable}.json`);

  const report: Report = {
    reportMetadata: {
      script: `scripts/supabase/schema-${targetTable}.ts`,
      targetTable: targetTable,
      purpose: `Diagnóstico estructural completo de la tabla '${targetTable}'.`,
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI,
    auditStatus: "FAILED",
    schemaDetails: {
      columns: [],
      constraints: [],
      indexes: [],
      rls_policies: [],
      triggers: [],
    },
    summary: "",
  };

  try {
    const supabase = createScriptClient();
    logger.traceEvent(
      traceId,
      `Invocando RPC 'get_system_diagnostics' para filtrar por '${targetTable}'...`
    );

    const { data, error } = await supabase.rpc("get_system_diagnostics");
    if (error) {
      throw new Error(
        `Fallo en RPC 'get_system_diagnostics': ${error.message}`
      );
    }

    const validation = SystemDiagnosticsSchema.safeParse(data);
    if (!validation.success) {
      throw new Error(`Los datos de la RPC no cumplen con el schema esperado.`);
    }
    const diagnosticsData = validation.data;
    logger.traceEvent(
      traceId,
      "Datos de diagnóstico del sistema obtenidos y validados."
    );

    report.schemaDetails.columns = diagnosticsData.schema_columns.filter(
      (c) => c.table === targetTable
    );
    report.schemaDetails.constraints = diagnosticsData.table_constraints.filter(
      (c) => c.table === targetTable
    );
    report.schemaDetails.indexes = diagnosticsData.indexes.filter(
      (i) => i.table === targetTable
    );
    report.schemaDetails.rls_policies = diagnosticsData.rls_policies.filter(
      (p) => p.table === targetTable
    );
    report.schemaDetails.triggers = diagnosticsData.triggers.filter(
      (t) => t.table === targetTable
    );

    if (report.schemaDetails.columns.length === 0) {
      throw new Error(
        `La tabla '${targetTable}' no fue encontrada en el esquema de la base de datos.`
      );
    }

    logger.info("--- Columnas ---");
    console.table(report.schemaDetails.columns);
    logger.info("--- Restricciones ---");
    console.table(report.schemaDetails.constraints);
    logger.info("--- Índices ---");
    console.table(report.schemaDetails.indexes);
    logger.info("--- Políticas RLS ---");
    console.table(report.schemaDetails.rls_policies);
    logger.info("--- Triggers ---");
    console.table(report.schemaDetails.triggers);

    report.auditStatus = "SUCCESS";
    report.summary = `Auditoría de esquema para la tabla '${targetTable}' completada con éxito.`;
    logger.success(report.summary);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    report.summary = `Auditoría de esquema fallida: ${errorMessage}`;
    logger.error(report.summary, { traceId });
  } finally {
    await fs.mkdir(reportDir, { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    logger.info(
      `Informe de diagnóstico guardado en: ${path.relative(process.cwd(), reportPath)}`
    );
    if (report.auditStatus === "FAILED") {
      process.exit(1);
    }
  }

  if (report.auditStatus === "SUCCESS") {
    return { success: true, data: report.summary };
  } else {
    return { success: false, error: report.summary };
  }
}
