// RUTA: scripts/cloudinary/connect.ts
/**
 * @file connect.ts
 * @description Guardián de Conexión para Cloudinary. Verifica variables de entorno
 *              y la conectividad con la API, generando un informe de diagnóstico.
 * @version 4.1.0 (Type Contract Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
import { v2 as cloudinary } from "cloudinary";
import { promises as fs } from "fs";
import * as path from "path";
import { loadEnvironment } from "../_utils/env";
import { scriptLogger as logger } from "../_utils/logger";

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
  const traceId = logger.startTrace("diagnoseCloudinaryConnection_v4.1");
  const groupId = logger.startGroup(
    "🖼️  Iniciando Guardián de Conexión a Cloudinary..."
  );

  const reportDir = path.resolve(process.cwd(), "reports", "cloudinary");
  const reportPath = path.resolve(reportDir, "connect-diagnostics.json");

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
    connectionStatus: "FAILED",
    environmentValidation: [],
    apiPingResult: {
      status: "PENDING",
      message: "La prueba no se ha ejecutado.",
    },
    summary: "",
  };

  try {
    loadEnvironment();

    const requiredKeys = [
      "CLOUDINARY_CLOUD_NAME",
      "CLOUDINARY_API_KEY",
      "CLOUDINARY_API_SECRET",
    ];
    let allKeysValid = true;

    logger.info("Verificando variables de entorno...");
    for (const key of requiredKeys) {
      const value = process.env[key];
      if (value && value !== "") {
        report.environmentValidation.push({
          variable: key,
          status: "OK",
          message: `La variable '${key}' está configurada.`,
        });
        logger.success(`Variable '${key}' encontrada.`);
      } else {
        allKeysValid = false;
        report.environmentValidation.push({
          variable: key,
          status: "MISSING",
          message: `ERROR: La variable '${key}' no está definida en .env.local.`,
        });
        logger.error(`Variable '${key}' no encontrada.`);
      }
    }

    if (!allKeysValid) {
      throw new Error("Una o más variables de entorno de Cloudinary faltan.");
    }
    logger.success(
      "Todas las variables de entorno requeridas están presentes."
    );

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    logger.info(
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

    report.connectionStatus = "SUCCESS";
    report.apiPingResult = {
      status: "OK",
      message: "La API de Cloudinary respondió correctamente al ping.",
      details: result,
    };
    report.summary =
      "Diagnóstico exitoso. Las variables de entorno son correctas y la conexión con la API de Cloudinary está activa.";
    logger.success(report.summary);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    report.summary = `Diagnóstico fallido: ${errorMessage}`;
    logger.error(report.summary, { traceId });
  } finally {
    await fs.mkdir(reportDir, { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    logger.info(
      `Informe de diagnóstico guardado en: ${path.relative(process.cwd(), reportPath)}`
    );
    logger.endGroup(groupId);
    logger.endTrace(traceId);
    if (report.connectionStatus === "FAILED") {
      process.exit(1);
    }
  }
}

diagnoseCloudinaryConnection();
