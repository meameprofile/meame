// RUTA: scripts/supabase/schema-aura-functions.ts
/**
 * @file schema-aura-functions.ts
 * @description Guardián de Esquema soberano para las funciones de base de datos
 *              del dominio Aura y de Inteligencia de Visitantes.
 * @version 2.0.0 (Elite Compliance & Bug Fix)
 * @author RaZ Podestá - MetaShark Tech
 */

import { promises as fs } from "fs";
import * as path from "path";
import { z } from "zod";
import { createScriptClient } from "../_utils/supabaseClient";
import { scriptLogger as logger } from "../_utils/logger";
import type { ScriptActionResult } from "../_utils/types";

// --- SSoT de Contratos de Datos ---
const FunctionSchema = z.object({
  name: z.string(),
  type: z.enum(["FUNCTION", "PROCEDURE"]),
});
type FunctionData = z.infer<typeof FunctionSchema>;

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
    functions: FunctionData[];
  };
  summary: string;
}

const AURA_RELATED_FUNCTION_KEYWORDS = [
  "aura",
  "analytics",
  "profile",
  "visitor",
  "session",
  "link_fingerprint",
];

async function diagnoseAuraFunctionsSchema(): Promise<
  ScriptActionResult<string>
> {
  const traceId = logger.startTrace("diagnoseAuraFunctionsSchema_v2.0");
  // --- [INICIO DE CORRECCIÓN TS2554] ---
  // La función `startGroup` en `scriptLogger` solo acepta un argumento.
  logger.startGroup(`[Guardián Aura] Auditando funciones de BD...`);
  // --- [FIN DE CORRECCIÓN TS2554] ---

  const reportDir = path.resolve(process.cwd(), "reports", "supabase");
  const reportPath = path.resolve(reportDir, "schema-aura-functions.json");

  const report: Report = {
    reportMetadata: {
      script: "scripts/supabase/schema-aura-functions.ts",
      purpose:
        "Diagnóstico de las funciones de base de datos relacionadas con Aura.",
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      "Este es un informe de las funciones de base de datos del dominio Aura.",
      "Analiza 'schemaDetails.functions' para verificar la existencia y el nombre de las funciones clave.",
      "Funciones críticas a verificar: 'get_campaign_analytics', 'analyze_behavior_patterns', 'update_user_profile_summaries', 'link_fingerprint_to_user'.",
    ],
    auditStatus: "FAILED",
    schemaDetails: { functions: [] },
    summary: "",
  };

  try {
    const supabase = createScriptClient();
    logger.traceEvent(traceId, "Invocando RPC 'get_system_diagnostics'...");

    const { data, error } = await supabase.rpc("get_system_diagnostics");
    if (error) throw new Error(`Fallo en RPC: ${error.message}`);

    const validation = SystemDiagnosticsSchema.safeParse(data);
    if (!validation.success) {
      throw new Error("Los datos de la RPC no cumplen con el schema esperado.");
    }
    const allFunctions = validation.data.functions_and_procedures;
    logger.traceEvent(
      traceId,
      `Se encontraron ${allFunctions.length} funciones en total.`
    );

    report.schemaDetails.functions = allFunctions.filter((fn) =>
      AURA_RELATED_FUNCTION_KEYWORDS.some((keyword) =>
        fn.name.includes(keyword)
      )
    );
    logger.info("--- Funciones del Dominio Aura Encontradas ---");
    console.table(report.schemaDetails.functions);

    report.auditStatus = "SUCCESS";
    report.summary = `Auditoría completada. Se encontraron ${report.schemaDetails.functions.length} funciones relacionadas con Aura.`;
    logger.success(report.summary);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    report.summary = `Auditoría de funciones de Aura fallida: ${errorMessage}`;
    logger.error(report.summary, { traceId }); // Inyección de traceId para observabilidad
  } finally {
    await fs.mkdir(reportDir, { recursive: true }).catch(() => {});
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    logger.info(
      `Informe de diagnóstico guardado en: ${path.relative(
        process.cwd(),
        reportPath
      )}`
    );
    logger.endGroup();
    logger.endTrace(traceId);
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

diagnoseAuraFunctionsSchema();
