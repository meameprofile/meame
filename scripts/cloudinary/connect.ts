// pnpm tsx scripts/cloudinary/connect.ts
/**
 * @file connect.ts
 * @description Guardián de Conexión para Cloudinary. Verifica variables de entorno
 *              y la conectividad con la API, generando un informe de diagnóstico.
 * @version 3.1.0 (Simplified Structure & Direct Execution)
 * @author RaZ Podestá - MetaShark Tech
 */
import { v2 as cloudinary } from "cloudinary";
import { promises as fs } from "fs";
import * as path from "path";
import { loadEnvironment } from "../_utils/env";
import { scriptLogger } from "../_utils/logger";

// SSoT para el contrato de datos del informe
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
    status: "OK" | "MISSING";
    message: string;
  }[];
  apiPingResult: {
    status: string;
    message: string;
    details?: unknown;
  };
  summary: string;
}

async function diagnoseCloudinaryConnection() {
  const traceId = scriptLogger.startTrace("diagnoseCloudinaryConnection_v3.1");
  scriptLogger.startGroup("🖼️  Iniciando Guardián de Conexión a Cloudinary...");

  const reportDir = path.resolve(process.cwd(), "reports", "cloudinary");
  const reportPath = path.resolve(reportDir, "connect-diagnostics.json");

  // Plantilla base para el informe
  const report: Report = {
    reportMetadata: {
      script: "scripts/cloudinary/connect.ts",
      purpose: "Diagnóstico de Conexión de Cloudinary",
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      "Este es un informe de diagnóstico de conexión para Cloudinary.",
      "Analiza 'connectionStatus' para el resultado general.",
      "Revisa 'environmentValidation' para verificar el estado de cada variable de entorno requerida.",
      "Revisa 'apiPingResult' para el resultado de la prueba de conexión real con la API.",
      "Utiliza el 'summary' para obtener una conclusión legible por humanos.",
    ],
    connectionStatus: "FAILED", // Por defecto
    environmentValidation: [],
    apiPingResult: {
      status: "PENDING",
      message: "La prueba no se ha ejecutado.",
    },
    summary: "",
  };

  try {
    // 1. Cargar y validar variables de entorno
    loadEnvironment(); // Carga .env.local sin fallar si faltan claves

    const requiredKeys = [
      "CLOUDINARY_CLOUD_NAME",
      "CLOUDINARY_API_KEY",
      "CLOUDINARY_API_SECRET",
    ];
    let allKeysValid = true;

    scriptLogger.info("Verificando variables de entorno...");
    for (const key of requiredKeys) {
      const value = process.env[key];
      if (value && value !== "") {
        report.environmentValidation.push({
          variable: key,
          status: "OK",
          message: `La variable '${key}' está configurada.`,
        });
        scriptLogger.success(`Variable '${key}' encontrada.`);
      } else {
        allKeysValid = false;
        report.environmentValidation.push({
          variable: key,
          status: "MISSING",
          message: `ERROR: La variable '${key}' no está definida en .env.local.`,
        });
        scriptLogger.error(`Variable '${key}' no encontrada.`);
      }
    }

    if (!allKeysValid) {
      throw new Error("Una o más variables de entorno de Cloudinary faltan.");
    }
    scriptLogger.success(
      "Todas las variables de entorno requeridas están presentes."
    );

    // 2. Configurar y probar la conexión con la API
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    scriptLogger.info(
      `Intentando ping a la API de Cloudinary para el cloud: '${process.env.CLOUDINARY_CLOUD_NAME}'...`
    );
    const result = await cloudinary.api.ping();

    if (result?.status !== "ok") {
      report.apiPingResult = {
        status: "FAILED",
        message: `La API de Cloudinary respondió con un estado inesperado: '${result?.status}'.`,
        details: result,
      };
      throw new Error(report.apiPingResult.message);
    }

    // 3. Si todo tiene éxito, actualizar el informe
    report.connectionStatus = "SUCCESS";
    report.apiPingResult = {
      status: "OK",
      message: "La API de Cloudinary respondió correctamente al ping.",
      details: result,
    };
    report.summary =
      "Diagnóstico exitoso. Las variables de entorno son correctas y la conexión con la API de Cloudinary está activa.";
    scriptLogger.success(report.summary);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    report.summary = `Diagnóstico fallido: ${errorMessage}`;
    scriptLogger.error(report.summary, { traceId });
  } finally {
    // 4. Escribir el informe final, sea de éxito o de fallo
    await fs.mkdir(reportDir, { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    scriptLogger.info(
      `Informe de diagnóstico guardado en: ${path.relative(process.cwd(), reportPath)}`
    );
    scriptLogger.endGroup();
    scriptLogger.endTrace(traceId);
    if (report.connectionStatus === "FAILED") {
      process.exit(1);
    }
  }
}

diagnoseCloudinaryConnection();
