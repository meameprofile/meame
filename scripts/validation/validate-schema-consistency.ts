// RUTA: scripts/validation/validate-schema-consistency.ts
/**
 * @file validate-schema-consistency.ts
 * @description Guardián de Consistencia de Esquema. Compara el manifiesto
 *              conceptual de una tabla con su estado real en la base de datos y genera un informe.
 * @version 4.0.0 (Elite DDL Parser & Finalized Logic)
 * @author RaZ Podestá - MetaShark Tech
 */
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import { scriptLogger as logger } from "../_utils/logger";

// --- SSoT de Contratos de Datos ---

const SchemaColumnSchema = z.object({
  table: z.string(),
  column: z.string(),
  type: z.string(),
});
const SchemaReportSchema = z.object({
  schemaDetails: z.object({
    schema_columns: z.array(SchemaColumnSchema),
  }),
});

type ParsedColumn = { name: string; type: string };

interface MismatchedColumn {
  name: string;
  expected: string;
  actual: string | undefined;
}

interface Report {
  reportMetadata: {
    script: string;
    purpose: string;
    generatedAt: string;
  };
  instructionsForAI: string[];
  auditStatus: "SUCCESS" | "FAILED";
  schemaComparison: {
    tableName: string;
    missingColumns: ParsedColumn[];
    extraneousColumns: ParsedColumn[];
    mismatchedColumns: MismatchedColumn[];
  };
  summary: string;
}

/**
 * Parsea un bloque de DDL 'CREATE TABLE' para extraer nombres y tipos de columnas de forma resiliente.
 * @param ddl El string SQL del DDL.
 * @returns Un array de objetos de columna parseados.
 */
function parseDdlToColumns(ddl: string): ParsedColumn[] {
  const columns: ParsedColumn[] = [];
  const contentMatch = ddl.match(/\(([\s\S]*)\)/);
  if (!contentMatch || !contentMatch[1]) {
    logger.warn(
      "[DDL Parser] No se encontró contenido dentro de los paréntesis del CREATE TABLE."
    );
    return [];
  }

  const lines = contentMatch[1].split("\n");

  for (const line of lines) {
    const trimmedLine = line.trim().replace(/,$/, "");
    if (
      !trimmedLine ||
      trimmedLine.toUpperCase().startsWith("CONSTRAINT") ||
      trimmedLine.toUpperCase().startsWith("PRIMARY KEY")
    ) {
      continue;
    }

    const parts = trimmedLine.split(/\s+/);
    if (parts.length < 2) continue;

    const name = parts[0];
    let type = parts[1].toLowerCase();

    if (type === "timestamptz") {
      type = "timestamp with time zone";
    }

    // Filtramos cualquier nombre de columna que sea una palabra clave de SQL.
    if (name.toUpperCase() !== "CREATE" && name.toUpperCase() !== "TABLE") {
      columns.push({ name, type });
    }
  }
  return columns;
}

async function main() {
  const tableName = process.argv[2];
  if (!tableName) {
    logger.error(
      "Se debe proporcionar un nombre de tabla. Uso: pnpm tsx <script> <nombre_tabla>"
    );
    process.exit(1);
  }

  const traceId = logger.startTrace(`validate-schema:${tableName}`);
  logger.startGroup(
    `[Guardián de Consistencia v4.0] Auditando tabla: '${tableName}'`
  );

  const reportDir = path.resolve(process.cwd(), "reports", "consistency");
  const reportPath = path.resolve(
    reportDir,
    `${tableName}-consistency-report.json`
  );
  const report: Report = {
    reportMetadata: {
      script: "scripts/validation/validate-schema-consistency.ts",
      purpose: `Auditoría de consistencia entre el manifiesto y el esquema de la DB para la tabla '${tableName}'.`,
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      "Este es un informe de auditoría de consistencia de esquema.",
      "Compara las 'missingColumns', 'extraneousColumns' y 'mismatchedColumns' para identificar desalineaciones.",
      "Usa esta información para generar scripts de migración SQL ('ALTER TABLE') y corregir las discrepancias.",
    ],
    auditStatus: "FAILED",
    schemaComparison: {
      tableName,
      missingColumns: [],
      extraneousColumns: [],
      mismatchedColumns: [],
    },
    summary: "",
  };

  try {
    const schemaReportPath = path.resolve(
      process.cwd(),
      "reports/supabase/schema-all.json"
    );
    const schemaReportContent = await fs.readFile(schemaReportPath, "utf-8");
    const schemaReport = SchemaReportSchema.parse(
      JSON.parse(schemaReportContent)
    );
    const actualColumns = schemaReport.schemaDetails.schema_columns
      .filter((col) => col.table === tableName)
      .map((col) => ({ name: col.column, type: col.type.toLowerCase() }));

    if (actualColumns.length === 0)
      throw new Error(`Tabla '${tableName}' no encontrada.`);

    // Ajuste de ruta para encontrar los manifiestos de tabla correctos
    const manifestFileName = `001_MANIFIESTO_TABLA_${tableName.toUpperCase()}.md`;
    const manifestPath = path.resolve(
      process.cwd(),
      `_docs/supabase`,
      manifestFileName
    );

    const manifestContent = await fs.readFile(manifestPath, "utf-8");
    const ddlMatch = manifestContent.match(/```sql\s*([\s\S]*?)\s*```/);
    if (!ddlMatch || !ddlMatch[1])
      throw new Error(
        `No se encontró bloque SQL en el manifiesto: ${manifestPath}`
      );

    const conceptualColumns = parseDdlToColumns(ddlMatch[1]);

    if (conceptualColumns.length === 0) {
      throw new Error(
        `El parser no pudo extraer ninguna columna del manifiesto DDL para '${tableName}'.`
      );
    }

    const actualColumnMap = new Map(actualColumns.map((c) => [c.name, c.type]));
    const conceptualColumnMap = new Map(
      conceptualColumns.map((c) => [c.name, c.type])
    );

    report.schemaComparison.missingColumns = conceptualColumns.filter(
      (c) => !actualColumnMap.has(c.name)
    );
    report.schemaComparison.extraneousColumns = actualColumns.filter(
      (c) => !conceptualColumnMap.has(c.name)
    );
    report.schemaComparison.mismatchedColumns = conceptualColumns
      .filter((c) => {
        const actualType = actualColumnMap.get(c.name);
        return actualType && !actualType.startsWith(c.type);
      })
      .map((c) => ({
        name: c.name,
        expected: c.type,
        actual: actualColumnMap.get(c.name),
      }));

    const errorCount =
      report.schemaComparison.missingColumns.length +
      report.schemaComparison.extraneousColumns.length +
      report.schemaComparison.mismatchedColumns.length;

    if (errorCount === 0) {
      report.auditStatus = "SUCCESS";
      report.summary = `✅ ¡Éxito! El esquema de la tabla '${tableName}' está perfectamente alineado con su manifiesto.`;
      logger.success(report.summary);
    } else {
      report.summary = `❌ Fallo de consistencia: Se encontraron ${errorCount} desalineaciones en el esquema de la tabla '${tableName}'. Revisa el informe JSON para más detalles.`;
      logger.error(report.summary);
      if (report.schemaComparison.missingColumns.length > 0)
        console.table(report.schemaComparison.missingColumns);
      if (report.schemaComparison.extraneousColumns.length > 0)
        console.table(report.schemaComparison.extraneousColumns);
      if (report.schemaComparison.mismatchedColumns.length > 0)
        console.table(report.schemaComparison.mismatchedColumns);
      throw new Error(report.summary);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    report.summary = `Fallo crítico del guardián: ${errorMessage}`;
    logger.error(report.summary, { traceId });
    process.exitCode = 1;
  } finally {
    await fs.mkdir(reportDir, { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    logger.info(
      `Informe de consistencia guardado en: ${path.relative(process.cwd(), reportPath)}`
    );
    logger.endGroup();
    logger.endTrace(traceId);
  }
}

main();
