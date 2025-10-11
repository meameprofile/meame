// RUTA: scripts/cloudinary/content.ts
/**
 * @file content.ts
 * @description Guardián de Contenido para Cloudinary. Realiza un censo de los
 *              activos y el uso de la cuenta, generando un informe consumible por IA.
 * @version 4.1.0 (Elite Observability & Contract Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import { promises as fs } from "fs";
import * as path from "path";

import { v2 as cloudinary } from "cloudinary";

import { loadEnvironment } from "../_utils/env";
import { scriptLogger } from "../_utils/logger";
import type { ScriptActionResult } from "../_utils/types";

// SSoT para el contrato de datos del informe
interface Report {
  reportMetadata: {
    script: string;
    purpose: string;
    generatedAt: string;
  };
  instructionsForAI: string[];
  censusStatus: "SUCCESS" | "FAILED";
  usageSummary: unknown;
  recentAssets: unknown[];
  summary: string;
}

async function diagnoseCloudinaryContent(): Promise<
  ScriptActionResult<string>
> {
  const traceId = scriptLogger.startTrace("diagnoseCloudinaryContent_v4.1");
  const groupId = scriptLogger.startGroup(
    "📊 Realizando censo de contenido en Cloudinary..."
  );

  const reportDir = path.resolve(process.cwd(), "reports", "cloudinary");
  const reportPath = path.resolve(reportDir, "content-diagnostics.json");

  const report: Report = {
    reportMetadata: {
      script: "scripts/cloudinary/content.ts",
      purpose: "Diagnóstico de Contenido y Uso de Cloudinary",
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      "Este es un informe de diagnóstico de contenido y uso para Cloudinary.",
      "Analiza 'usageSummary' para entender el consumo de recursos (almacenamiento, ancho de banda, créditos).",
      "Inspecciona 'recentAssets' para una lista de los 50 activos más recientes, incluyendo sus metadatos (public_id, formato, dimensiones, etc.).",
      "El 'summary' ofrece una conclusión general del censo.",
    ],
    censusStatus: "FAILED",
    usageSummary: {},
    recentAssets: [],
    summary: "",
  };

  try {
    loadEnvironment([
      "CLOUDINARY_CLOUD_NAME",
      "CLOUDINARY_API_KEY",
      "CLOUDINARY_API_SECRET",
    ]);

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    scriptLogger.info(`Censando cloud: '${process.env.CLOUDINARY_CLOUD_NAME}'`);

    const [usage, resources] = await Promise.all([
      cloudinary.api.usage(),
      cloudinary.search
        .expression("resource_type:image")
        .sort_by("uploaded_at", "desc")
        .max_results(50)
        .execute(),
    ]);
    scriptLogger.traceEvent(
      traceId,
      "Datos de uso y activos obtenidos de la API."
    );

    report.censusStatus = "SUCCESS";
    report.usageSummary = usage;
    report.recentAssets = resources.resources;
    report.summary = `Censo de contenido completado. Se encontraron ${resources.resources.length} activos recientes. Uso de créditos: ${usage.credits.usage} de ${usage.credits.limit}.`;
    scriptLogger.success(report.summary);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    report.summary = `Censo de contenido fallido: ${errorMessage}`;
    scriptLogger.error(report.summary, { error: errorMessage, traceId });
    // Guardar el informe de fallo y salir
    await fs.mkdir(reportDir, { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    scriptLogger.info(
      `Informe de diagnóstico (fallido) guardado en: ${path.relative(process.cwd(), reportPath)}`
    );

    scriptLogger.endGroup(groupId);
    scriptLogger.endTrace(traceId);
    return { success: false, error: errorMessage };
  }

  // Escribir el informe de éxito
  await fs.mkdir(reportDir, { recursive: true });
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  const successMessage = `Informe de contenido guardado en: ${path.relative(process.cwd(), reportPath)}`;
  scriptLogger.info(successMessage);

  scriptLogger.endGroup(groupId);
  scriptLogger.endTrace(traceId);
  return { success: true, data: successMessage };
}

diagnoseCloudinaryContent();
