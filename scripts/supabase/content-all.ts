// pnpm tsx scripts/run-with-env.ts scripts/supabase/content-all.ts
/**
 * @file content-all.ts
 * @description Guardián de Contenido Holístico para Supabase. Realiza un volcado completo
 *              de todas las tablas públicas y genera un informe de diagnóstico maestro.
 * @version 2.2.0 (Elite Observability & Linter Compliance)
 * @author L.I.A. Legacy
 */
import { promises as fs } from "fs";
import * as path from "path";
import { z } from "zod";
import { createScriptClient } from "../_utils/supabaseClient";
import { scriptLogger } from "../_utils/logger"; // <-- El alias correcto es 'scriptLogger'
import type { ScriptActionResult } from "../_utils/types";
import type { Database } from "../../src/shared/lib/supabase/database.types";

// --- SSoT de Contratos de Datos ---
const TableNameSchema = z.object({ table_name: z.string() });
const RpcResponseSchema = z.array(TableNameSchema);

interface Report {
  reportMetadata: {
    script: string;
    purpose: string;
    generatedAt: string;
  };
  instructionsForAI: string[];
  dumpStatus: "SUCCESS" | "FAILED";
  data: Record<
    string,
    { count: number; records: unknown[] } | { error: string }
  >;
  summary: string;
}

type TableName = keyof Database["public"]["Tables"];

async function diagnoseSupabaseContentAll(): Promise<
  ScriptActionResult<string>
> {
  // --- [INICIO DE CORRECCIÓN DE ALIAS] ---
  const traceId = scriptLogger.startTrace(`diagnoseContent:all_v2.2`);
  scriptLogger.startGroup(
    `💾 Realizando volcado de contenido completo de Supabase...`
  );
  // --- [FIN DE CORRECCIÓN DE ALIAS] ---

  const reportDir = path.resolve(process.cwd(), "reports", "supabase");
  const reportPath = path.resolve(reportDir, `content-all-diagnostics.json`);

  const report: Report = {
    reportMetadata: {
      script: `scripts/supabase/content-all.ts`,
      purpose:
        "Volcado de contenido COMPLETO de todas las tablas públicas de Supabase.",
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      "Este es un informe de volcado de contenido completo de la base de datos.",
      "La sección 'data' contiene una clave por cada tabla pública encontrada.",
      "Para cada tabla, se proporciona un 'count' del total de registros y un array 'records' con los datos completos.",
      "Utiliza esta información como una SSoT del estado de los datos para análisis y depuración.",
    ],
    dumpStatus: "FAILED",
    data: {},
    summary: "",
  };

  try {
    const supabase = createScriptClient();
    // --- [INICIO DE CORRECCIÓN DE ALIAS] ---
    scriptLogger.info(`Invocando RPC 'get_public_table_names'...`);
    // --- [FIN DE CORRECCIÓN DE ALIAS] ---

    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "get_public_table_names"
    );
    if (rpcError)
      throw new Error(
        `Fallo en RPC 'get_public_table_names': ${rpcError.message}`
      );

    const validation = RpcResponseSchema.safeParse(rpcData);
    if (!validation.success) {
      throw new Error(
        `La respuesta de la RPC 'get_public_table_names' no cumple con el schema esperado.`
      );
    }
    const tablesData = validation.data;

    const tableNames = tablesData.map((t) => t.table_name);
    // --- [INICIO DE CORRECCIÓN DE ALIAS] ---
    scriptLogger.info(
      `Se encontraron ${tableNames.length} tablas públicas para volcar.`
    );
    // --- [FIN DE CORRECCIÓN DE ALIAS] ---

    for (const tableName of tableNames) {
      // --- [INICIO DE CORRECCIÓN DE ALIAS] ---
      scriptLogger.trace(`Volcando contenido de la tabla: '${tableName}'...`);
      // --- [FIN DE CORRECCIÓN DE ALIAS] ---
      const { data: tableData, error: tableError } = await supabase
        .from(tableName as TableName)
        .select("*");

      if (tableError) {
        report.data[tableName] = { error: tableError.message };
        // --- [INICIO DE CORRECCIÓN DE ALIAS] ---
        scriptLogger.warn(
          `Error al leer la tabla '${tableName}': ${tableError.message}`
        );
        // --- [FIN DE CORRECCIÓN DE ALIAS] ---
      } else {
        report.data[tableName] = {
          count: tableData.length,
          records: tableData,
        };
      }
    }

    report.dumpStatus = "SUCCESS";
    report.summary = `Volcado de contenido completado. Se procesaron ${tableNames.length} tablas.`;
    scriptLogger.success(report.summary);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    report.summary = `Volcado de contenido fallido: ${errorMessage}`;
    scriptLogger.error(report.summary, { traceId });
  } finally {
    await fs.mkdir(reportDir, { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    scriptLogger.info(
      `Informe de volcado de contenido guardado en: ${path.relative(process.cwd(), reportPath)}`
    );
    scriptLogger.endGroup();
    scriptLogger.endTrace(traceId);
    if (report.dumpStatus === "FAILED") process.exit(1);
  }

  if (report.dumpStatus === "SUCCESS") {
    return { success: true, data: report.summary };
  } else {
    return { success: false, error: report.summary };
  }
}

diagnoseSupabaseContentAll();
