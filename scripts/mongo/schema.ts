// pnpm tsx scripts/run-with-env.ts scripts/mongo/schema.ts
/**
 * @file schema.ts
 * @description Guardián de Esquema para MongoDB. Infiere y reporta la
 *              estructura de cada colección basándose en un documento de muestra.
 * @version 1.0.0 (Inferential & AI-Consumable)
 * @author L.I.A. Legacy
 */
import { MongoClient, type Document } from "mongodb";
import { promises as fs } from "fs";
import * as path from "path";
import { loadEnvironment } from "../_utils/env";
import { scriptLogger } from "../_utils/logger";
import type { ScriptActionResult } from "../_utils/types";

// --- SSoT de Contratos de Datos ---
interface Report {
  reportMetadata: {
    script: string;
    purpose: string;
    generatedAt: string;
  };
  instructionsForAI: string[];
  auditStatus: "SUCCESS" | "FAILED";
  schemaDetails: Record<string, unknown>;
  summary: string;
}

// Función pura y recursiva para inferir el esquema de un documento anidado.
function inferSchema(
  doc: Document,
  keyPath: string = ""
): Record<string, string> {
  const schema: Record<string, string> = {};
  for (const key in doc) {
    const newPath = keyPath ? `${keyPath}.${key}` : key;
    const value = doc[key];

    if (Array.isArray(value)) {
      schema[newPath] = `Array<${value.length > 0 ? typeof value[0] : "any"}>`;
      if (
        value.length > 0 &&
        typeof value[0] === "object" &&
        value[0] !== null
      ) {
        Object.assign(schema, inferSchema(value[0], `${newPath}[*]`));
      }
    } else if (value instanceof Date) {
      schema[newPath] = "Date";
    } else if (value instanceof Object && value.constructor === Object) {
      schema[newPath] = "Object";
      Object.assign(schema, inferSchema(value, newPath));
    } else {
      schema[newPath] = typeof value;
    }
  }
  return schema;
}

async function diagnoseMongoSchema(): Promise<ScriptActionResult<string>> {
  const traceId = scriptLogger.startTrace("diagnoseMongoSchema_v1.0");
  scriptLogger.startGroup(
    "🔬 Auditando Esquemas (inferidos) de Colecciones en MongoDB..."
  );

  const reportDir = path.resolve(process.cwd(), "reports", "mongodb");
  const reportPath = path.resolve(reportDir, "schema-diagnostics.json");

  const report: Report = {
    reportMetadata: {
      script: "scripts/mongo/schema.ts",
      purpose: "Diagnóstico de Esquema Inferido para MongoDB",
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      "Este es un informe de diagnóstico de esquema para MongoDB, generado por inferencia.",
      "La sección 'schemaDetails' contiene una clave por cada colección encontrada.",
      "Para cada colección, se muestra un mapa de 'Campo' -> 'Tipo de Dato Inferido', basado en el primer documento encontrado.",
      "Utiliza esta estructura para verificar la consistencia de los datos y su alineación con los schemas de Zod de la aplicación.",
      "Presta especial atención a los tipos anidados (ej. 'user.address.city') y a los arrays de objetos (ej. 'items[*]').",
    ],
    auditStatus: "FAILED",
    schemaDetails: {},
    summary: "",
  };

  let client: MongoClient | null = null;

  try {
    loadEnvironment(["MONGODB_URI", "MONGODB_DB_NAME"]);
    const uri = process.env.MONGODB_URI!;
    client = new MongoClient(uri);
    await client.connect();

    const db = client.db(process.env.MONGODB_DB_NAME!);
    scriptLogger.info(
      `Conectado a la base de datos: '${process.env.MONGODB_DB_NAME!}'`
    );

    const collections = await db.collections();
    if (collections.length === 0) {
      report.summary = "La base de datos no contiene colecciones.";
      scriptLogger.warn(report.summary);
    } else {
      scriptLogger.info(
        `Se encontraron ${collections.length} colecciones. Infiriendo esquemas...`
      );
    }

    for (const collection of collections) {
      const collectionName = collection.collectionName;
      const sampleDoc = await collection.findOne({});

      if (sampleDoc) {
        const schema = inferSchema(sampleDoc);
        report.schemaDetails[collectionName] = schema;
        scriptLogger.info(`--- Esquema Inferido para: ${collectionName} ---`);
        console.table(
          Object.entries(schema).map(([Campo, Tipo]) => ({ Campo, Tipo }))
        );
      } else {
        report.schemaDetails[collectionName] =
          "Colección vacía, no se puede inferir el esquema.";
      }
    }

    report.auditStatus = "SUCCESS";
    report.summary = `Auditoría de esquema completada. Se analizaron ${collections.length} colecciones.`;
    scriptLogger.success(report.summary);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    report.summary = `Auditoría de esquema fallida: ${errorMessage}`;
    scriptLogger.error(report.summary, { traceId });
  } finally {
    if (client) await client.close();
    await fs.mkdir(reportDir, { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    scriptLogger.info(
      `Informe de diagnóstico guardado en: ${path.relative(process.cwd(), reportPath)}`
    );
    scriptLogger.endGroup();
    scriptLogger.endTrace(traceId);
    if (report.auditStatus === "FAILED") process.exit(1);
  }

  if (report.auditStatus === "SUCCESS") {
    return { success: true, data: report.summary };
  } else {
    return { success: false, error: report.summary };
  }
}

diagnoseMongoSchema();
