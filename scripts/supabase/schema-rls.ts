// pnpm tsx scripts/run-with-env.ts scripts/supabase/schema-rls.ts
/**
 * @file schema-rls.ts
 * @description Guardián de Seguridad para las políticas RLS de Supabase.
 *              Realiza una auditoría completa de todas las reglas de seguridad
 *              a nivel de fila y genera un informe de diagnóstico.
 * @version 1.0.0 (Granular & AI-Consumable Reports)
 * @author L.I.A. Legacy
 */
import { promises as fs } from "fs";
import * as path from "path";
import { z } from "zod";
import { createScriptClient } from "../_utils/supabaseClient";
import { scriptLogger } from "../_utils/logger";
import type { ScriptActionResult } from "../_utils/types";

// --- SSoT de Contratos de Datos ---
const RlsPolicySchema = z.object({
  table: z.string(),
  policy_name: z.string(),
  command: z.string(),
  definition: z.string().nullable(),
});
type RlsPolicy = z.infer<typeof RlsPolicySchema>;

const SystemDiagnosticsSchema = z.object({
  rls_policies: z.array(RlsPolicySchema),
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
    rls_policies: RlsPolicy[];
  };
  summary: string;
}

async function diagnoseRlsSchema(): Promise<ScriptActionResult<string>> {
  const traceId = scriptLogger.startTrace(`diagnoseSchema:rls`);
  scriptLogger.startGroup(
    `🛡️  Auditando Políticas de Seguridad (RLS) de la Base de Datos...`
  );

  const reportDir = path.resolve(process.cwd(), "reports", "supabase");
  const reportPath = path.resolve(reportDir, `schema-rls.json`);

  const report: Report = {
    reportMetadata: {
      script: `scripts/supabase/schema-rls.ts`,
      purpose:
        "Diagnóstico de todas las políticas de Seguridad a Nivel de Fila (RLS).",
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      "Este es un informe de diagnóstico de seguridad que detalla TODAS las políticas RLS activas en la base de datos.",
      "Para cada política, analiza la 'table', el 'command' (SELECT, INSERT, UPDATE, DELETE) y la 'definition'.",
      "La 'definition' es la LÓGICA DE LA REGLA. Es CRÍTICO verificar que las políticas de escritura (INSERT, UPDATE, DELETE) siempre contengan una cláusula de autorización (ej. `auth.uid() = user_id` o `is_workspace_member(...)`).",
      "Una 'definition' con valor 'true' para SELECT en tablas públicas es aceptable, pero para escritura es una VULNERABILIDAD CRÍTICA.",
      "Una 'definition' con valor `null` para INSERT en `razprompts_entries` es la VULNERABILIDAD que se necesita confirmar y corregir.",
      "El 'summary' ofrece una conclusión general de la auditoría de seguridad.",
    ],
    auditStatus: "FAILED",
    schemaDetails: { rls_policies: [] },
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

    report.schemaDetails.rls_policies = diagnosticsData.rls_policies || [];

    if (report.schemaDetails.rls_policies.length === 0) {
      scriptLogger.warn(
        "¡ALERTA DE SEGURIDAD! No se encontraron políticas RLS. Tus datos podrían estar expuestos."
      );
    }

    scriptLogger.info("--- Políticas de Seguridad a Nivel de Fila (RLS) ---");
    console.table(report.schemaDetails.rls_policies);

    report.auditStatus = "SUCCESS";
    report.summary = `Auditoría RLS completada. Se encontraron ${report.schemaDetails.rls_policies.length} políticas.`;
    scriptLogger.success(report.summary);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    report.summary = `Auditoría RLS fallida: ${errorMessage}`;
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

diagnoseRlsSchema();
