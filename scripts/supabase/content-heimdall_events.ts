// RUTA: scripts/supabase/content-heimdall_events.ts
/**
 * @file content-heimdall_events.ts
 * @description Guardián de Contenido para la tabla 'heimdall_events'.
 * @version 2.1.0 (Type Safety & Contract Integrity)
 * @author RaZ Podestá - MetaShark Tech
 */
import { promises as fs } from "fs";
import path from "path";

import type { HeimdallEventRow } from "@/shared/lib/telemetry/heimdall.contracts";

import { scriptLogger as logger } from "../_utils/logger";
import { createScriptClient } from "../_utils/supabaseClient";
import type { ScriptActionResult } from "../_utils/types";

// --- [INICIO DE REFACTORIZACIÓN DE TIPO v2.1.0] ---
interface Report {
  reportMetadata: { script: string; purpose: string; generatedAt: string };
  instructionsForAI: string[];
  censusStatus: "SUCCESS" | "FAILED";
  data: { count: number; records: HeimdallEventRow[] }; // <-- TIPO EXPLÍCITO
  summary: string;
}
// --- [FIN DE REFACTORIZACIÓN DE TIPO v2.1.0] ---

async function diagnoseHeimdallContent(): Promise<ScriptActionResult<string>> {
  const traceId = logger.startTrace("diagnoseContent:heimdall_events_v2.1");
  const groupId = logger.startGroup(
    "📊 Realizando censo de eventos en 'heimdall_events'..."
  );

  const reportDir = path.resolve(process.cwd(), "reports", "telemetry");
  const reportPath = path.resolve(reportDir, "content-heimdall_events.json");

  const report: Report = {
    reportMetadata: {
      script: "scripts/supabase/content-heimdall_events.ts",
      purpose: "Censo de los 50 eventos de telemetría más recientes.",
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      "Este es un censo de los 50 eventos de telemetría más recientes.",
      "Verifica que se estén registrando eventos con diferentes 'trace_id' y 'event_name'.",
      "Analiza el campo 'status' para identificar la proporción de éxitos ('SUCCESS') vs. fallos ('FAILURE').",
    ],
    censusStatus: "FAILED",
    data: { count: 0, records: [] }, // Inicialización segura
    summary: "",
  };

  try {
    const supabase = createScriptClient();
    const { data, error, count } = await supabase
      .from("heimdall_events")
      .select("*", { count: "exact" })
      .order("timestamp", { ascending: false })
      .limit(50);

    if (error) throw error;

    report.data = { count: count ?? 0, records: data };
    report.censusStatus = "SUCCESS";
    report.summary = `Censo completado. Se recuperaron ${data.length} de un total de ${count} eventos.`;

    console.table(
      data.map((d) => ({
        event: d.event_name,
        status: d.status,
        trace_id: d.trace_id,
        timestamp: d.timestamp,
      }))
    );
    logger.success(report.summary);

    return { success: true, data: report.summary };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error desconocido.";
    report.summary = `Censo fallido: ${msg}`;
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
    if (report.censusStatus === "FAILED") process.exit(1);
  }
}

diagnoseHeimdallContent();
