// pnpm tsx scripts/run-with-env.ts scripts/supabase/schema-all.ts
/**
 * @file schema-all.ts
 * @description Guardián de Esquema Holístico para Supabase. Realiza una auditoría
 *              estructural completa de TODAS las tablas, funciones, triggers y
 *              políticas, y genera un único informe de diagnóstico maestro.
 * @version 1.0.0 (Holistic & AI-Consumable)
 * @author RaZ Podestá - MetaShark Tech
 */
import { promises as fs } from "fs";
import * as path from "path";
import { z } from "zod";
import { createScriptClient } from "../_utils/supabaseClient";
import { scriptLogger } from "../_utils/logger";
import type { ScriptActionResult } from "../_utils/types";

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
const FunctionSchema = z.object({
  name: z.string(),
  type: z.enum(["FUNCTION", "PROCEDURE"]),
});

const SystemDiagnosticsSchema = z.object({
  schema_columns: z.array(ColumnSchema),
  table_constraints: z.array(ConstraintSchema),
  indexes: z.array(IndexSchema),
  rls_policies: z.array(RlsPolicySchema),
  triggers: z.array(TriggerSchema),
  functions_and_procedures: z.array(FunctionSchema),
});

type SystemDiagnostics = z.infer<typeof SystemDiagnosticsSchema>;

interface Report {
  reportMetadata: {
    script: string;
    purpose: string;
    generatedAt: string;
  };
  instructionsForAI: string[];
  auditStatus: "SUCCESS" | "FAILED";
  schemaDetails: SystemDiagnostics;
  summary: string;
}

async function diagnoseFullSchema(): Promise<ScriptActionResult<string>> {
  const traceId = scriptLogger.startTrace(`diagnoseSchema:all_v1.0`);
  scriptLogger.startGroup(
    `🔬 Auditando Esquema COMPLETO de la Base de Datos...`
  );

  const reportDir = path.resolve(process.cwd(), "reports", "supabase");
  const reportPath = path.resolve(reportDir, `schema-all.json`);

  const report: Report = {
    reportMetadata: {
      script: `scripts/supabase/schema-all.ts`,
      purpose:
        "Diagnóstico estructural holístico de la base de datos Supabase.",
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      "Este es un informe de diagnóstico estructural COMPLETO de la base de datos.",
      "Analiza la sección 'schemaDetails' que contiene arrays para cada tipo de objeto del esquema: 'schema_columns', 'table_constraints', 'indexes', 'rls_policies', 'triggers', y 'functions_and_procedures'.",
      "Utiliza esta información como la Única Fuente de Verdad (SSoT) para la arquitectura de la base de datos en el momento de la generación del informe.",
      "Realiza análisis cruzados: verifica que las funciones usadas en triggers y políticas RLS existan, que las claves foráneas apunten a tablas existentes, etc.",
      "El 'summary' ofrece una conclusión general de la auditoría.",
    ],
    auditStatus: "FAILED",
    schemaDetails: {
      schema_columns: [],
      table_constraints: [],
      indexes: [],
      rls_policies: [],
      triggers: [],
      functions_and_procedures: [],
    },
    summary: "",
  };

  try {
    const supabase = createScriptClient();
    scriptLogger.info(`Invocando RPC 'get_system_diagnostics'...`);

    const { data, error } = await supabase.rpc("get_system_diagnostics");
    if (error)
      throw new Error(
        `Fallo en RPC 'get_system_diagnostics': ${error.message}`
      );

    const validation = SystemDiagnosticsSchema.safeParse(data);
    if (!validation.success) {
      throw new Error(`Los datos de la RPC no cumplen con el schema esperado.`);
    }
    report.schemaDetails = validation.data;
    scriptLogger.traceEvent(
      traceId,
      "Datos de diagnóstico del sistema obtenidos y validados."
    );

    scriptLogger.info("--- Resumen del Esquema ---");
    console.table({
      Columnas: report.schemaDetails.schema_columns.length,
      Restricciones: report.schemaDetails.table_constraints.length,
      Índices: report.schemaDetails.indexes.length,
      "Políticas RLS": report.schemaDetails.rls_policies.length,
      Triggers: report.schemaDetails.triggers.length,
      Funciones: report.schemaDetails.functions_and_procedures.length,
    });

    report.auditStatus = "SUCCESS";
    report.summary = `Auditoría de esquema completada con éxito. Se analizaron ${Object.keys(report.schemaDetails).length} categorías del esquema.`;
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
    if (report.auditStatus === "FAILED") {
      process.exit(1);
    }
  }

  const success = report.auditStatus === "SUCCESS";
  if (success) {
    return { success: true, data: report.summary };
  } else {
    return { success: false, error: report.summary };
  }
}

diagnoseFullSchema();
