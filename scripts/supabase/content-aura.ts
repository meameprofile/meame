// RUTA: scripts/supabase/content-aura.ts
/**
 * @file content-aura.ts
 * @description Guardián de Contenido para el dominio Aura, forjado con observabilidad de élite.
 *              Realiza un censo de registros en las tablas de telemetría.
 * @version 2.0.0 (Elite Observability & Type Safety)
 * @author L.I.A. Legacy
 */
import { promises as fs } from "fs";
import * as path from "path";
import { createScriptClient } from "../_utils/supabaseClient";
import { scriptLogger as logger } from "../_utils/logger";
import type { Database } from "@/shared/lib/supabase/database.types";

// Contrato de tipos para las tablas que vamos a auditar
type AuraTables = Extract<
  keyof Database["public"]["Tables"],
  | "visitor_sessions"
  | "visitor_campaign_events"
  | "user_activity_events"
  | "aura_insights"
>;

interface Report {
  reportMetadata: {
    script: string;
    purpose: string;
    generatedAt: string;
  };
  auditStatus: "SUCCESS" | "FAILED";
  census: Record<AuraTables, number | null>;
  summary: string;
}

async function diagnoseAuraContent() {
  const traceId = logger.startTrace("diagnoseAuraContent_v2.0");
  logger.startGroup(`[Guardián Aura] Realizando censo de contenido...`);

  const reportDir = path.resolve(process.cwd(), "reports", "supabase");
  const reportPath = path.resolve(reportDir, "content-aura.json");
  const report: Report = {
    reportMetadata: {
      script: "scripts/supabase/content-aura.ts",
      purpose:
        "Censo de registros en las tablas de telemetría del dominio Aura.",
      generatedAt: new Date().toISOString(),
    },
    auditStatus: "FAILED",
    census: {
      visitor_sessions: null,
      visitor_campaign_events: null,
      user_activity_events: null,
      aura_insights: null,
    },
    summary: "",
  };

  try {
    const supabase = createScriptClient();
    const tablesToCount: AuraTables[] = [
      "visitor_sessions",
      "visitor_campaign_events",
      "user_activity_events",
      "aura_insights",
    ];

    const countPromises = tablesToCount.map((table) =>
      supabase.from(table).select("id", { count: "exact", head: true })
    );

    logger.traceEvent(
      traceId,
      `Contando registros para ${countPromises.length} tablas...`
    );
    const results = await Promise.all(countPromises);

    results.forEach((result, index) => {
      const tableName = tablesToCount[index];
      if (result.error) {
        throw new Error(`Al contar ${tableName}: ${result.error.message}`);
      }
      report.census[tableName] = result.count ?? 0;
    });

    report.auditStatus = "SUCCESS";
    report.summary = `✅ Censo de Aura completado con éxito.`;
    logger.success("--- Censo de Contenido de Aura ---");
    console.table(report.census);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error desconocido.";
    report.summary = `❌ Censo de Aura fallido: ${msg}`;
    logger.error(report.summary, { traceId });
  } finally {
    await fs.mkdir(reportDir, { recursive: true }).catch(() => {});
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    logger.info(
      `Informe guardado en: ${path.relative(process.cwd(), reportPath)}`
    );
    logger.endGroup();
    logger.endTrace(traceId);
    if (report.auditStatus === "FAILED") process.exit(1);
  }
}

diagnoseAuraContent();
