// RUTA: scripts/validation/validate-all-schema-contracts.ts
/**
 * @file validate-all-schema-contracts.ts
 * @description Orquestador de Auditoría Holística de Esquemas. Valida TODOS
 *              los schemas registrados contra el estado real de la base de datos.
 * @version 6.0.0 (Definitive & Purified)
 * @author RaZ Podestá - MetaShark Tech
 */
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import { scriptLogger as logger } from "../_utils/logger";
import { schemaRegistry } from "@/shared/lib/schemas/_registry";

const SchemaColumnSchema = z.object({
  table: z.string(),
  column: z.string(),
  type: z.string(),
});
const SchemaReportSchema = z.object({
  schemaDetails: z.object({ schema_columns: z.array(SchemaColumnSchema) }),
});
type ParsedColumn = { column: string; type: string };
interface MismatchedColumn {
  column: string;
  expected: string;
  actual: string | undefined;
}

interface Report {
  reportMetadata: { script: string; purpose: string; generatedAt: string };
  instructionsForAI: string[];
  auditStatus: "SUCCESS" | "FAILED";
  schemaComparison: {
    tableName: string;
    missingInDb: ParsedColumn[];
    extraneousInDb: ParsedColumn[];
    mismatchedTypes: MismatchedColumn[];
  };
  summary: string;
}

function zodToPostgres(zodType: z.ZodTypeAny): string {
  const typeName = zodType._def.typeName;
  if (typeName === "ZodOptional" || typeName === "ZodNullable") {
    return zodToPostgres(zodType._def.innerType);
  }
  if (typeName === "ZodString") {
    if (zodType._def.checks?.some((c: { kind: string }) => c.kind === "uuid"))
      return "uuid";
    if (
      zodType._def.checks?.some((c: { kind: string }) => c.kind === "datetime")
    )
      return "timestamp with time zone";
    return "text";
  }
  if (typeName === "ZodNumber") {
    const isInt = zodType._def.checks?.some(
      (c: { kind: string }) => c.kind === "int"
    );
    return isInt ? "integer" : "numeric";
  }
  if (typeName === "ZodBoolean") return "boolean";
  if (typeName === "ZodDate") return "timestamp with time zone";
  if (
    typeName === "ZodObject" ||
    typeName === "ZodRecord" ||
    typeName === "ZodAny"
  )
    return "jsonb";
  if (typeName === "ZodArray") return "array";
  if (typeName === "ZodEnum") return "user-defined";
  return "unknown";
}

async function auditTable(
  tableName: string,
  allActualColumns: { column: string; type: string; table: string }[]
): Promise<boolean> {
  const traceId = logger.startTrace(`audit:${tableName}`);
  logger.startGroup(`[Auditoría] Verificando tabla: '${tableName}'`);

  const reportDir = path.resolve(process.cwd(), "reports", "consistency");
  const reportPath = path.resolve(
    reportDir,
    `${tableName}-consistency-report.json`
  );

  const report: Report = {
    reportMetadata: {
      script: "scripts/validation/validate-all-schema-contracts.ts",
      purpose: `Auditoría de consistencia entre el ZodSchema y la DB para la tabla '${tableName}'.`,
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      "Este es un informe de auditoría de consistencia de esquema.",
      "Compara 'missingInDb' (columnas en Zod pero no en DB), 'extraneousInDb' (columnas en DB pero no en Zod) y 'mismatchedTypes'.",
      "Usa esta información para generar scripts de migración SQL ('ALTER TABLE') o para actualizar los schemas de Zod, manteniendo ambos sincronizados.",
    ],
    auditStatus: "FAILED",
    schemaComparison: {
      tableName,
      missingInDb: [],
      extraneousInDb: [],
      mismatchedTypes: [],
    },
    summary: "",
  };

  try {
    const actualColumns = allActualColumns
      .filter((c) => c.table === tableName)
      .map((c) => ({ column: c.column, type: c.type.toLowerCase() }));

    if (actualColumns.length === 0) {
      throw new Error(`Tabla no encontrada en el informe de diagnóstico.`);
    }

    const conceptualSchema = schemaRegistry[tableName];
    if (!conceptualSchema) {
      throw new Error(
        `No se encontró un ZodSchema para la tabla '${tableName}' en el _registry.ts.`
      );
    }

    const conceptualColumns = Object.keys(conceptualSchema.shape).map(
      (key) => ({
        column: key,
        type: zodToPostgres(conceptualSchema.shape[key] as z.ZodTypeAny),
      })
    );

    if (conceptualColumns.length === 0) {
      throw new Error(
        `El parser no pudo extraer ninguna columna del ZodSchema.`
      );
    }

    const actualColumnMap = new Map(
      actualColumns.map((c) => [c.column, c.type])
    );
    const conceptualColumnMap = new Map(
      conceptualColumns.map((c) => [c.column, c.type])
    );

    report.schemaComparison.missingInDb = conceptualColumns.filter(
      (c) => !actualColumnMap.has(c.column)
    );
    report.schemaComparison.extraneousInDb = actualColumns.filter(
      (c) => !conceptualColumnMap.has(c.column)
    );
    report.schemaComparison.mismatchedTypes = conceptualColumns
      .filter((c) => {
        const actualType = actualColumnMap.get(c.column);
        const expectedType = c.type;
        if (!actualType || expectedType === "unknown") return false;
        if (expectedType === "user-defined" && actualType.startsWith("text"))
          return false;
        if (expectedType === "integer" && actualType.startsWith("bigint"))
          return false;
        return !actualType.startsWith(expectedType);
      })
      .map((c) => ({
        column: c.column,
        expected: c.type,
        actual: actualColumnMap.get(c.column),
      }));

    const errorCount =
      report.schemaComparison.missingInDb.length +
      report.schemaComparison.extraneousInDb.length +
      report.schemaComparison.mismatchedTypes.length;

    if (errorCount === 0) {
      report.auditStatus = "SUCCESS";
      report.summary = `✅ ¡Éxito! El esquema de la tabla '${tableName}' está perfectamente alineado con su ZodSchema.`;
      logger.success(report.summary);
    } else {
      report.auditStatus = "FAILED";
      report.summary = `❌ Fallo de consistencia: Se encontraron ${errorCount} desalineaciones en la tabla '${tableName}'.`;
      logger.error(report.summary);
    }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Error desconocido.";
    report.auditStatus = "FAILED";
    report.summary = `Fallo crítico del guardián para '${tableName}': ${errorMessage}`;
    logger.error(report.summary, { traceId });
  } finally {
    await fs.mkdir(reportDir, { recursive: true }).catch(() => {});
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    logger.info(
      `Informe guardado: ${path.relative(process.cwd(), reportPath)}`
    );
    logger.endGroup();
    logger.endTrace(traceId);
  }
  return report.auditStatus === "SUCCESS";
}

async function main() {
  const mainTraceId = logger.startTrace("validate-all-schemas");
  logger.startGroup(`[Orquestador de Auditoría Holística v6.0] Iniciando...`);

  try {
    const schemaReportPath = path.resolve(
      process.cwd(),
      "reports/supabase/schema-all.json"
    );
    const schemaReportContent = await fs.readFile(schemaReportPath, "utf-8");
    const schemaReport = SchemaReportSchema.parse(
      JSON.parse(schemaReportContent)
    );
    const allActualColumns = schemaReport.schemaDetails.schema_columns;

    const tableNamesToAudit = Object.keys(schemaRegistry);

    logger.info(
      `Se auditarán ${tableNamesToAudit.length} tablas: ${tableNamesToAudit.join(", ")}`
    );

    const results = await Promise.all(
      tableNamesToAudit.map((tableName) =>
        auditTable(tableName, allActualColumns)
      )
    );

    const failures = results.filter((res) => !res).length;

    logger.startGroup("[Resumen de Auditoría Holística]");
    if (failures === 0) {
      logger.success(
        "✅ ¡VERIFICACIÓN COMPLETA! Todos los esquemas de tabla están alineados con sus contratos de Zod."
      );
    } else {
      logger.error(
        `❌ VERIFICACIÓN FALLIDA: ${failures} de ${tableNamesToAudit.length} tablas presentan desalineaciones. Revisa los informes individuales en 'reports/consistency/'.`
      );
      process.exitCode = 1;
    }
    logger.endGroup();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Orquestador de Auditoría] Fallo crítico.", {
      error: errorMessage,
      mainTraceId,
    });
    process.exit(1);
  } finally {
    logger.endTrace(mainTraceId);
  }
}

main();
