// RUTA: scripts/supabase/content-aura.ts
/**
 * @file content-aura.ts
 * @description Guardián de Contenido para el dominio Aura, forjado con una lógica de censo
 *              "consciente del esquema" para una resiliencia y precisión de élite.
 * @version 4.0.0 (Schema-Aware & Definitive)
 * @author RaZ Podestá - MetaShark Tech
 */
import { promises as fs } from "fs";
import * as path from "path";

import type { Database } from "@/shared/lib/supabase/database.types";

import { scriptLogger as logger } from "../_utils/logger";
import { createScriptClient } from "../_utils/supabaseClient";

type AuraTables = Extract<
  keyof Database["public"]["Tables"],
  | "visitor_sessions"
  | "visitor_campaign_events"
  | "user_activity_events"
  | "aura_insights"
>;

// SSoT para las claves primarias de las tablas de Aura.
// Esto hace que el script sea resiliente a cambios de esquema.
const primaryKeyMap: Record<AuraTables, string> = {
  visitor_sessions: "session_id",
  visitor_campaign_events: "event_id",
  user_activity_events: "id",
  aura_insights: "id",
};

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
  const traceId = logger.startTrace("diagnoseAuraContent_v4.0");
  const groupId = logger.startGroup(
    `[Guardián Aura] Realizando censo de contenido consciente del esquema...`
  );

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

    const countPromises = tablesToCount.map(async (table) => {
      const primaryKey = primaryKeyMap[table];
      const { data, error } = await supabase.from(table).select(primaryKey);
      if (error) {
        throw new Error(`Al contar ${table}: ${error.message}`);
      }
      return { table, count: data?.length ?? 0 };
    });

    logger.traceEvent(
      traceId,
      `Contando registros para ${countPromises.length} tablas...`
    );
    const results = await Promise.all(countPromises);

    results.forEach((result) => {
      report.census[result.table as AuraTables] = result.count;
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
    logger.endGroup(groupId);
    logger.endTrace(traceId);
    if (report.auditStatus === "FAILED") process.exit(1);
  }
}

diagnoseAuraContent();
