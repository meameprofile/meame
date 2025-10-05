// pnpm tsx scripts/run-with-env.ts scripts/supabase/schema-triggers.ts
/**
 * @file schema-triggers.ts
 * @description Guardián de Esquema para los triggers de la base de datos Supabase.
 *              Realiza una auditoría completa y genera un informe de diagnóstico.
 * @version 1.0.0 (Granular & AI-Consumable Reports)
 * @author RaZ Podestá - MetaShark Tech
 */
import { promises as fs } from "fs";
import * as path from "path";
import { z } from "zod";
import { createScriptClient } from "../_utils/supabaseClient";
import { scriptLogger } from "../_utils/logger";
import type { ScriptActionResult } from "../_utils/types";

// --- SSoT de Contratos de Datos ---
const TriggerSchema = z.object({
  trigger_name: z.string(),
  table: z.string(),
  timing: z.string(),
  event: z.string(),
});
type Trigger = z.infer<typeof TriggerSchema>;

const SystemDiagnosticsSchema = z.object({
  triggers: z.array(TriggerSchema),
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
    triggers: Trigger[];
  };
  summary: string;
}

async function diagnoseTriggersSchema(): Promise<ScriptActionResult<string>> {
  const traceId = scriptLogger.startTrace(`diagnoseSchema:triggers`);
  scriptLogger.startGroup(`🔬 Auditando Triggers de la Base de Datos...`);

  const reportDir = path.resolve(process.cwd(), "reports", "supabase");
  const reportPath = path.resolve(reportDir, `schema-triggers.json`);

  const report: Report = {
    reportMetadata: {
      script: `scripts/supabase/schema-triggers.ts`,
      purpose: "Diagnóstico de todos los triggers en la base de datos.",
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      "Este es un informe de diagnóstico de todos los triggers automáticos en la base de datos de Supabase.",
      "Analiza la sección 'schemaDetails.triggers' para entender qué eventos (INSERT, UPDATE, DELETE) en qué tablas ('table') disparan acciones automáticas.",
      "Es CRÍTICO verificar que el trigger 'on_cogniread_content_change' está asociado a la tabla 'cogniread_articles' en los eventos 'INSERT' y 'UPDATE'.",
      "Verifica la existencia de triggers como 'on_profile_update' que mantienen la consistencia de los timestamps ('updated_at').",
      "El 'summary' ofrece una conclusión general de la auditoría.",
    ],
    auditStatus: "FAILED",
    schemaDetails: { triggers: [] },
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

    report.schemaDetails.triggers = diagnosticsData.triggers || [];

    if (report.schemaDetails.triggers.length === 0) {
      scriptLogger.warn(
        "No se encontraron triggers personalizados en la base de datos."
      );
    }

    scriptLogger.info("--- Triggers de Base de Datos ---");
    console.table(report.schemaDetails.triggers);

    report.auditStatus = "SUCCESS";
    report.summary = `Auditoría de triggers completada. Se encontraron ${report.schemaDetails.triggers.length} triggers.`;
    scriptLogger.success(report.summary);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    report.summary = `Auditoría de triggers fallida: ${errorMessage}`;
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

diagnoseTriggersSchema();
