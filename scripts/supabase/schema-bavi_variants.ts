// pnpm tsx scripts/run-with-env.ts scripts/supabase/schema-bavi_variants.ts
/**
 * @file schema-bavi_variants.ts
 * @description Guardián de Esquema para la tabla `bavi_variants`. Realiza una
 *              auditoría estructural completa, enfocándose en su relación con `bavi_assets`.
 * @version 1.0.0 (Granular & AI-Consumable Reports)
 * @author L.I.A. Legacy
 */
import { promises as fs } from "fs";
import * as path from "path";
import { z } from "zod";
import { createScriptClient } from "../_utils/supabaseClient";
import { scriptLogger } from "../_utils/logger";
import type { ScriptActionResult } from "../_utils/types";

// SSoT de Contratos de Datos
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

const SystemDiagnosticsSchema = z.object({
  schema_columns: z.array(ColumnSchema),
  table_constraints: z.array(ConstraintSchema),
  indexes: z.array(IndexSchema),
  rls_policies: z.array(RlsPolicySchema),
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
  };
  summary: string;
}

async function diagnoseBaviVariantsSchema(): Promise<
  ScriptActionResult<string>
> {
  const TARGET_TABLE = "bavi_variants";
  const traceId = scriptLogger.startTrace(`diagnoseSchema:${TARGET_TABLE}`);
  scriptLogger.startGroup(
    `🔬 Auditando Esquema de la Tabla: '${TARGET_TABLE}'...`
  );

  const reportDir = path.resolve(process.cwd(), "reports", "supabase");
  const reportPath = path.resolve(reportDir, `schema-${TARGET_TABLE}.json`);

  const report: Report = {
    reportMetadata: {
      script: `scripts/supabase/schema-${TARGET_TABLE}.ts`,
      targetTable: TARGET_TABLE,
      purpose: `Diagnóstico estructural completo de la tabla '${TARGET_TABLE}'.`,
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      `Este informe detalla la estructura de la tabla '${TARGET_TABLE}', que contiene las manifestaciones físicas de los activos BAVI.`,
      "Analiza 'columns' para verificar la existencia de 'variant_id', 'asset_id', 'public_id', 'width', 'height'.",
      "'constraints' es CRÍTICO: valida que 'asset_id' tenga una FOREIGN KEY hacia 'bavi_assets' con 'ON DELETE CASCADE'. Esto previene los activos huérfanos.",
      "Valida que la PRIMARY KEY sea una clave compuesta de ('asset_id', 'variant_id').",
      "'rls_policies' debe confirmar que el acceso está gobernado por la membresía al workspace del activo padre.",
      "El 'summary' ofrece una conclusión general de la auditoría.",
    ],
    auditStatus: "FAILED",
    schemaDetails: {
      columns: [],
      constraints: [],
      indexes: [],
      rls_policies: [],
    },
    summary: "",
  };

  try {
    const supabase = createScriptClient();
    scriptLogger.info(
      `Invocando RPC 'get_system_diagnostics' para filtrar por '${TARGET_TABLE}'...`
    );

    const { data, error } = await supabase.rpc("get_system_diagnostics");
    if (error)
      throw new Error(
        `Fallo en RPC 'get_system_diagnostics': ${error.message}`
      );

    const validation = SystemDiagnosticsSchema.safeParse(data);
    if (!validation.success) {
      throw new Error(
        `Los datos de la RPC 'get_system_diagnostics' no cumplen con el schema esperado.`
      );
    }
    const diagnosticsData = validation.data;
    scriptLogger.traceEvent(
      traceId,
      "Datos de diagnóstico del sistema obtenidos y validados."
    );

    report.schemaDetails.columns = diagnosticsData.schema_columns.filter(
      (c) => c.table === TARGET_TABLE
    );
    report.schemaDetails.constraints = diagnosticsData.table_constraints.filter(
      (c) => c.table === TARGET_TABLE
    );
    report.schemaDetails.indexes = diagnosticsData.indexes.filter(
      (i) => i.table === TARGET_TABLE
    );
    report.schemaDetails.rls_policies = diagnosticsData.rls_policies.filter(
      (p) => p.table === TARGET_TABLE
    );

    if (report.schemaDetails.columns.length === 0) {
      throw new Error(
        `La tabla '${TARGET_TABLE}' no fue encontrada en el esquema de la base de datos.`
      );
    }

    scriptLogger.info("--- Columnas ---");
    console.table(report.schemaDetails.columns);
    scriptLogger.info("--- Restricciones ---");
    console.table(report.schemaDetails.constraints);
    scriptLogger.info("--- Índices ---");
    console.table(report.schemaDetails.indexes);
    scriptLogger.info("--- Políticas RLS ---");
    console.table(report.schemaDetails.rls_policies);

    report.auditStatus = "SUCCESS";
    report.summary = `Auditoría de esquema para la tabla '${TARGET_TABLE}' completada con éxito.`;
    scriptLogger.success(report.summary);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    report.summary = `Auditoría de esquema fallida: ${errorMessage}`;
    scriptLogger.error(report.summary, { traceId });
  } finally {
    await fs.mkdir(reportDir, { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    scriptLogger.info(
      `Informe de diagnóstico guardado en: ${path.relative(process.cwd(), reportPath)}`
    );
    scriptLogger.endGroup();
    scriptLogger.endTrace(traceId);
    if (report.auditStatus === "FAILED") process.exit(1);
  }

  const success = report.auditStatus === "SUCCESS";
  if (success) {
    return { success: true, data: report.summary };
  } else {
    return { success: false, error: report.summary };
  }
}

diagnoseBaviVariantsSchema();
