// pnpm tsx scripts/run-with-env.ts scripts/supabase/schema-functions.ts
/**
 * @file schema-functions.ts
 * @description Guardián de Esquema para las funciones y procedimientos de Supabase.
 *              Realiza una auditoría completa y genera un informe de diagnóstico.
 * @version 2.0.0 (Logger v20+ Contract Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import { promises as fs } from "fs";
import * as path from "path";

import { z } from "zod";

import { scriptLogger } from "../_utils/logger";
import { createScriptClient } from "../_utils/supabaseClient";
import type { ScriptActionResult } from "../_utils/types";

// --- SSoT de Contratos de Datos ---
const FunctionSchema = z.object({
  name: z.string(),
  type: z.enum(["FUNCTION", "PROCEDURE"]),
});

const SystemDiagnosticsSchema = z.object({
  functions_and_procedures: z.array(FunctionSchema),
});

interface Report {
  reportMetadata: {
    script: string;
    purpose: string;
    generatedAt: string;
  };
  instructionsForAI: string[];
  auditStatus: "SUCCESS" | "FAILED";
  schemaDetails: {
    functions: z.infer<typeof FunctionSchema>[];
  };
  summary: string;
}

async function diagnoseFunctionsSchema(): Promise<ScriptActionResult<string>> {
  const traceId = scriptLogger.startTrace(`diagnoseSchema:functions`);
  const groupId = scriptLogger.startGroup(
    `🔬 Auditando Funciones y Procedimientos de la Base de Datos...`
  );

  const reportDir = path.resolve(process.cwd(), "reports", "supabase");
  const reportPath = path.resolve(reportDir, `schema-functions.json`);

  const report: Report = {
    reportMetadata: {
      script: `scripts/supabase/schema-functions.ts`,
      purpose:
        "Diagnóstico de todas las funciones y procedimientos en la base de datos.",
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      "Este es un informe de diagnóstico de todas las funciones y procedimientos almacenados en la base de datos de Supabase.",
      "Analiza la sección 'schemaDetails.functions' para obtener una lista completa de la lógica que reside en la base de datos.",
      "Es CRÍTICO verificar la existencia de funciones de seguridad como 'is_workspace_member' y 'get_user_role_in_workspace', ya que son la base para las políticas RLS.",
      "El 'summary' ofrece una conclusión general de la auditoría.",
    ],
    auditStatus: "FAILED",
    schemaDetails: { functions: [] },
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
      throw new Error(
        `Los datos de la RPC 'get_system_diagnostics' no cumplen con el schema esperado.`
      );
    }
    const diagnosticsData = validation.data;
    scriptLogger.traceEvent(
      traceId,
      "Datos de diagnóstico del sistema obtenidos y validados."
    );

    report.schemaDetails.functions =
      diagnosticsData.functions_and_procedures || [];

    if (report.schemaDetails.functions.length === 0) {
      scriptLogger.warn(
        "No se encontraron funciones o procedimientos personalizados en la base de datos."
      );
    }

    scriptLogger.info("--- Funciones y Procedimientos ---");
    console.table(report.schemaDetails.functions);

    report.auditStatus = "SUCCESS";
    report.summary = `Auditoría de funciones completada. Se encontraron ${report.schemaDetails.functions.length} funciones/procedimientos.`;
    scriptLogger.success(report.summary);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    report.summary = `Auditoría de funciones fallida: ${errorMessage}`;
    scriptLogger.error(report.summary, { traceId });
  } finally {
    await fs.mkdir(reportDir, { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    scriptLogger.info(
      `Informe de diagnóstico guardado en: ${path.relative(process.cwd(), reportPath)}`
    );
    scriptLogger.endGroup(groupId);
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

diagnoseFunctionsSchema();
