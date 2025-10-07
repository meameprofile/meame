// RUTA: scripts/mongo/connect.ts
/**
 * @file connect.ts
 * @description Guardián de Conexión para MongoDB. Verifica variables de entorno
 *              y la conectividad con el clúster, generando un informe de diagnóstico.
 * @version 1.1.0 (Elite Observability & Contract Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import { MongoClient } from "mongodb";
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
  connectionStatus: "SUCCESS" | "FAILED";
  environmentValidation: {
    variable: string;
    status: "OK" | "MISSING" | "INVALID";
    message: string;
  }[];
  apiConnectionResult: {
    status: "OK" | "FAILED";
    message: string;
    details?: unknown;
  };
  summary: string;
}

async function diagnoseMongoConnection(): Promise<ScriptActionResult<string>> {
  const traceId = scriptLogger.startTrace("diagnoseMongoConnection_v1.1");
  const groupId = scriptLogger.startGroup(
    "🍃 Iniciando Guardián de Conexión a MongoDB..."
  );

  const reportDir = path.resolve(process.cwd(), "reports", "mongodb");
  const reportPath = path.resolve(reportDir, "connect-diagnostics.json");

  const report: Report = {
    reportMetadata: {
      script: "scripts/mongo/connect.ts",
      purpose: "Diagnóstico de Conexión de MongoDB Atlas",
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      "Este es un informe de diagnóstico de conexión para MongoDB.",
      "Analiza 'connectionStatus' para el resultado general.",
      "Revisa 'environmentValidation' para el estado de cada variable de entorno. La `MONGODB_URI` es la más crítica.",
      "Revisa 'apiConnectionResult' para el resultado de la prueba de `ping` a la base de datos.",
      "Un fallo aquí suele indicar problemas de red (IP no en la lista blanca) o credenciales incorrectas en la URI.",
    ],
    connectionStatus: "FAILED",
    environmentValidation: [],
    apiConnectionResult: {
      status: "FAILED",
      message: "La prueba no se ha ejecutado.",
    },
    summary: "",
  };

  let client: MongoClient | null = null;

  try {
    loadEnvironment();
    const requiredKeys = ["MONGODB_URI", "MONGODB_DB_NAME"];
    let allKeysValid = true;

    for (const key of requiredKeys) {
      const value = process.env[key];
      if (value && value !== "") {
        report.environmentValidation.push({
          variable: key,
          status: "OK",
          message: `Variable '${key}' configurada.`,
        });
        scriptLogger.success(`Variable '${key}' encontrada.`);
      } else {
        allKeysValid = false;
        report.environmentValidation.push({
          variable: key,
          status: "MISSING",
          message: `ERROR: Variable '${key}' no definida.`,
        });
        scriptLogger.error(`Variable '${key}' NO encontrada.`);
      }
    }
    if (!allKeysValid)
      throw new Error("Variables de entorno de MongoDB faltan.");

    const uri = process.env.MONGODB_URI!;
    client = new MongoClient(uri);

    scriptLogger.info(
      "Intentando conectar y hacer ping al clúster de MongoDB..."
    );
    await client.connect();
    const db = client.db(process.env.MONGODB_DB_NAME!);
    const pingResult = await db.command({ ping: 1 });

    if (!pingResult || pingResult.ok !== 1) {
      throw new Error(
        "El comando ping a MongoDB no devolvió una respuesta 'ok'."
      );
    }

    report.connectionStatus = "SUCCESS";
    report.apiConnectionResult = {
      status: "OK",
      message: "Conexión y ping al clúster de MongoDB exitosos.",
    };
    report.summary =
      "Diagnóstico exitoso. La conexión con MongoDB Atlas está activa y las credenciales son válidas.";
    scriptLogger.success(report.summary);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    report.summary = `Diagnóstico fallido: ${errorMessage}`;
    report.apiConnectionResult = { status: "FAILED", message: errorMessage };
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
    if (report.connectionStatus === "FAILED") process.exit(1);
  }

  if (report.connectionStatus === "SUCCESS") {
    return { success: true, data: report.summary };
  } else {
    return { success: false, error: report.summary };
  }
}

diagnoseMongoConnection();
