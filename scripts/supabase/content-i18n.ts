// RUTA: scripts/supabase/content-i18n.ts
/**
 * @file content-i18n.ts
 * @description Guardián de Diagnóstico para el contenido de i18n en Supabase.
 *              Realiza un censo de las entradas de traducción y valida la
 *              integridad básica de la migración.
 * @version 2.0.0 (Type-Safe & Elite Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import { createScriptClient } from "../_utils/supabaseClient";
import { scriptLogger as logger } from "../_utils/logger";
import type { ScriptActionResult as ActionResult } from "../_utils/types";
import { promises as fs } from "fs";
import path from "path";

interface Report {
  reportMetadata: {
    script: string;
    purpose: string;
    generatedAt: string;
  };
  instructionsForAI: string[];
  auditStatus: "SUCCESS" | "FAILED";
  census: {
    totalEntries: number;
    entryKeys: string[];
  };
  summary: string;
}

export default async function diagnoseI18nContent(): Promise<
  ActionResult<{ count: number }>
> {
  const traceId = logger.startTrace("diagnoseI18nContent_v2.0");
  const groupId = logger.startGroup(
    `[i18n Guardián] Auditando tabla 'i18n_content_entries'...`
  );

  const reportDir = path.resolve(process.cwd(), "reports", "supabase");
  const reportPath = path.resolve(reportDir, "content-i18n-diagnostics.json");

  const report: Report = {
    reportMetadata: {
      script: "scripts/supabase/content-i18n.ts",
      purpose:
        "Censo de todas las entradas de contenido i18n en la base de datos.",
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      "Este informe detalla el estado de la tabla de contenido i18n.",
      "Verifica 'census.totalEntries' para asegurar que el número de entradas coincide con la cantidad de archivos .i18n.json migrados.",
      "Revisa 'census.entryKeys' para confirmar que las claves (rutas de archivo) se han almacenado correctamente.",
    ],
    auditStatus: "FAILED",
    census: {
      totalEntries: 0,
      entryKeys: [],
    },
    summary: "",
  };

  try {
    const supabase = createScriptClient();
    const { data, error, count } = await supabase
      .from("i18n_content_entries")
      .select("entry_key", { count: "exact" });

    if (error) {
      throw new Error(`Error de Supabase: ${error.message}`);
    }

    report.census.totalEntries = count ?? 0;
    report.census.entryKeys = data?.map((d) => d.entry_key) || [];
    report.auditStatus = "SUCCESS";
    report.summary = `Auditoría completada. Se encontraron ${
      count ?? 0
    } entradas de contenido en la base de datos.`;

    logger.success(report.summary, { traceId });
    console.table(report.census);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[i18n Guardián] Fallo crítico durante la auditoría.", {
      error: errorMessage,
      traceId,
    });
    report.summary = `Auditoría fallida: ${errorMessage}`;
  } finally {
    await fs.mkdir(reportDir, { recursive: true }).catch(() => {});
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    logger.info(
      `Informe de diagnóstico guardado en: ${path.relative(
        process.cwd(),
        reportPath
      )}`
    );
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }

  if (report.auditStatus === "SUCCESS") {
    return { success: true, data: { count: report.census.totalEntries } };
  } else {
    return { success: false, error: report.summary };
  }
}

// Invocación para permitir la ejecución directa del script
if (import.meta.url === new URL(import.meta.url).href) {
  diagnoseI18nContent().then((result) => {
    if (!result.success) {
      process.exit(1);
    }
  });
}
