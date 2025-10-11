// RUTA: scripts/mongo/content.ts
/**
 * @file content.ts
 * @description Guardián de Contenido para MongoDB. Realiza un censo o un volcado
 *              completo de todas las colecciones y genera un informe de diagnóstico.
 * @version 1.1.0 (Elite Observability & Contract Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import { promises as fs } from "fs";
import * as path from "path";

import { MongoClient, type Document } from "mongodb";

import { loadEnvironment } from "../_utils/env";
import { scriptLogger } from "../_utils/logger";
import type { ScriptActionResult } from "../_utils/types";

// --- SSoT de Contratos de Datos ---
interface Report {
  reportMetadata: {
    script: string;
    purpose: string;
    mode: "census" | "full-dump";
    generatedAt: string;
  };
  instructionsForAI: string[];
  dumpStatus: "SUCCESS" | "FAILED";
  data: Record<
    string,
    { count: number; records?: Document[] } | { error: string }
  >;
  summary: string;
}

async function diagnoseMongoContent(): Promise<ScriptActionResult<string>> {
  const isFullDump = process.argv.includes("--full-dump");
  const mode = isFullDump ? "full-dump" : "census";
  const traceId = scriptLogger.startTrace(`diagnoseMongoContent_v1.1_${mode}`);
  const groupId = scriptLogger.startGroup(
    `📊 Realizando ${mode} de contenido en MongoDB...`
  );

  const reportDir = path.resolve(process.cwd(), "reports", "mongodb");
  const reportPath = path.resolve(reportDir, "content-diagnostics.json");

  const report: Report = {
    reportMetadata: {
      script: "scripts/mongo/content.ts",
      purpose: `Diagnóstico de Contenido (${mode}) de MongoDB.`,
      mode,
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      `Este es un informe de volcado de contenido en modo '${mode}' para MongoDB.`,
      "La sección 'data' contiene una clave por cada colección.",
      "Cada entrada incluye un 'count' del total de documentos.",
      "Si el modo es 'full-dump', también se incluye un array 'records' con todos los documentos de la colección.",
      "Utiliza esta información para verificar la cantidad de datos y, en modo 'full-dump', para analizar el contenido real.",
    ],
    dumpStatus: "FAILED",
    data: {},
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
    }

    for (const collection of collections) {
      const collectionName = collection.collectionName;
      scriptLogger.trace(`Procesando colección: '${collectionName}'...`);
      try {
        const count = await collection.countDocuments();
        let records: Document[] | undefined = undefined;
        if (isFullDump) {
          records = await collection.find({}).toArray();
        }
        report.data[collectionName] = { count, records };
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : "Error desconocido";
        report.data[collectionName] = { error: errorMsg };
        scriptLogger.warn(
          `Error al procesar la colección '${collectionName}': ${errorMsg}`
        );
      }
    }

    report.dumpStatus = "SUCCESS";
    report.summary = `Censo de contenido completado. Se analizaron ${collections.length} colecciones.`;

    scriptLogger.info("--- Censo de Contenido de MongoDB ---");
    console.table(
      Object.entries(report.data).map(([collection, details]) => ({
        Colección: collection,
        Documentos: "count" in details ? details.count : "Error",
        "Volcado Completo": isFullDump && "records" in details ? "Sí" : "No",
      }))
    );

    scriptLogger.success(report.summary);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    report.summary = `Censo de contenido fallido: ${errorMessage}`;
    scriptLogger.error(report.summary, { traceId });
  } finally {
    if (client) await client.close();
    await fs.mkdir(reportDir, { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    scriptLogger.info(
      `Informe de diagnóstico guardado en: ${path.relative(process.cwd(), reportPath)}`
    );
    scriptLogger.endGroup(groupId);
    scriptLogger.endTrace(traceId);
    if (report.dumpStatus === "FAILED") process.exit(1);
  }

  if (report.dumpStatus === "SUCCESS") {
    return { success: true, data: report.summary };
  } else {
    return { success: false, error: report.summary };
  }
}

diagnoseMongoContent();
