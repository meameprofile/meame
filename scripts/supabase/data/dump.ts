// RUTA: scripts/data/dump-all-tables-content.ts
/**
 * @file dump-all-tables-content.ts
 * @description Script de volcado de contenido, ahora arquitectónicamente puro y funcional.
 * @version 10.0.0 (Functional Restoration & Elite Observability)
 * @author L.I.A. Legacy
 */
import { promises as fs } from "fs";
import * as path from "path";
import chalk from "chalk";
import { createScriptClient } from "../supabase/script-client";
import { scriptLogger, type ScriptActionResult } from "../_utils/script-logger";

interface ContentDumpReport {
  metadata: { generatedAt: string };
  data: Record<string, unknown>;
}

async function dumpAllTablesContent(): Promise<ScriptActionResult<string>> {
  const traceId = scriptLogger.startTrace("dumpAllTablesContent_v10.0");
  scriptLogger.startGroup(
    "[DB Dumper] Iniciando volcado de contenido de Supabase (v10.0)..."
  );
  const supabase = createScriptClient();
  const reportDir = path.resolve(process.cwd(), "reports", "supabase");
  const reportPath = path.resolve(reportDir, "latest-full-content-dump.json");
  const relativePath = path.relative(process.cwd(), reportPath);

  try {
    const { data: tablesData, error: rpcError } = await supabase.rpc(
      "get_public_table_names"
    );
    if (rpcError) throw rpcError;

    const tableNames = tablesData.map(
      (t: { table_name: string }) => t.table_name
    );
    const report: ContentDumpReport = {
      metadata: { generatedAt: new Date().toISOString() },
      data: {},
    };

    for (const tableName of tableNames) {
      const { data: tableData, error: tableError } = await supabase
        .from(tableName)
        .select("*");
      if (tableError) {
        report.data[tableName] = { error: tableError.message };
      } else {
        report.data[tableName] = {
          count: tableData.length,
          records: tableData,
        };
      }
    }

    await fs.mkdir(reportDir, { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    scriptLogger.success(
      `Reporte generado con éxito en: ${chalk.yellow(relativePath)}`
    );
    return { success: true, data: `Informe de volcado guardado.` };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    scriptLogger.error(
      `Fallo al generar el reporte en: ${chalk.yellow(relativePath)}`,
      { error: errorMessage, traceId }
    );
    return {
      success: false,
      error: `No se pudo completar el volcado: ${errorMessage}`,
    };
  } finally {
    scriptLogger.endGroup();
    scriptLogger.endTrace(traceId);
  }
}

export default dumpAllTablesContent;
