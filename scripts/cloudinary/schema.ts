// pnpm tsx scripts/run-with-env.ts scripts/cloudinary/schema.ts
/**
 * @file schema.ts
 * @description Herramienta de auditoría para inspeccionar la configuración de Cloudinary.
 * @version 10.0.0 (Simplified Structure & AI Reports)
 * @author L.I.A. Legacy
 */
import { v2 as cloudinary } from "cloudinary";
import { promises as fs } from "fs";
import * as path from "path";
import { loadEnvironment } from "../_utils/env";
import { scriptLogger } from "../_utils/logger";
import type { ScriptActionResult } from "../_utils/types";

// Contratos de datos para el informe
interface Report {
  reportMetadata: {
    script: string;
    purpose: string;
    generatedAt: string;
  };
  instructionsForAI: string[];
  schemaData: {
    upload_presets: unknown[];
    transformations: unknown[];
    tags: string[];
    metadata_fields: unknown[];
  };
  summary: string;
}

interface MetadataField {
  label: string;
  external_id: string;
  type: string;
}

interface CorrectMetadataFieldsApiResponse {
  fields: MetadataField[];
}

async function diagnoseCloudinarySchema(): Promise<ScriptActionResult<string>> {
  const traceId = scriptLogger.startTrace("diagnoseCloudinarySchema_v10.0");
  scriptLogger.startGroup(
    "🔬 Auditando configuración estructural de Cloudinary..."
  );

  const reportDir = path.resolve(process.cwd(), "reports", "cloudinary");
  const reportPath = path.resolve(reportDir, "schema-diagnostics.json");

  const report: Report = {
    reportMetadata: {
      script: "scripts/cloudinary/schema.ts",
      purpose: "Diagnóstico de Esquema de Cloudinary",
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      "Este informe detalla la configuración estructural de la cuenta de Cloudinary.",
      "Analiza 'upload_presets' para entender las reglas de subida predefinidas.",
      "Revisa 'transformations' para ver las transformaciones de imagen nombradas que están disponibles.",
      "Consulta 'tags' para la lista de etiquetas de taxonomía existentes.",
      "Inspecciona 'metadata_fields' para los campos de metadatos estructurados definidos en la cuenta.",
      "El 'summary' ofrece una conclusión general de la auditoría.",
    ],
    schemaData: {
      upload_presets: [],
      transformations: [],
      tags: [],
      metadata_fields: [],
    },
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
    scriptLogger.info(
      `Auditando cloud: '${process.env.CLOUDINARY_CLOUD_NAME}'`,
      {
        traceId,
      }
    );

    const [presets, transformations, tags, metadataFieldsResponse] =
      await Promise.all([
        cloudinary.api.upload_presets(),
        cloudinary.api.transformations(),
        cloudinary.api.tags(),
        cloudinary.api.list_metadata_fields() as unknown as Promise<CorrectMetadataFieldsApiResponse>,
      ]);
    scriptLogger.traceEvent(traceId, "Datos de esquema obtenidos de la API.");

    report.schemaData = {
      upload_presets: presets.presets,
      transformations: transformations.transformations,
      tags: tags.tags,
      metadata_fields: metadataFieldsResponse.fields || [],
    };
    report.summary = `Auditoría de esquema completada. Se encontraron ${report.schemaData.upload_presets.length} presets, ${report.schemaData.transformations.length} transformaciones, ${report.schemaData.tags.length} etiquetas y ${report.schemaData.metadata_fields.length} campos de metadatos.`;
    scriptLogger.success(report.summary);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    report.summary = `Auditoría de esquema fallida: ${errorMessage}`;
    scriptLogger.error(report.summary, { error: errorMessage, traceId });
    // Guardar el informe incluso si hay un error
    await fs.mkdir(reportDir, { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    scriptLogger.info(
      `Informe de diagnóstico (fallido) guardado en: ${path.relative(process.cwd(), reportPath)}`
    );

    scriptLogger.endGroup();
    scriptLogger.endTrace(traceId);
    return { success: false, error: errorMessage };
  }

  // Escribir el informe de éxito
  await fs.mkdir(reportDir, { recursive: true });
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  const successMessage = `Informe de esquema guardado en: ${path.relative(process.cwd(), reportPath)}`;
  scriptLogger.info(successMessage);

  scriptLogger.endGroup();
  scriptLogger.endTrace(traceId);
  return { success: true, data: successMessage };
}

diagnoseCloudinarySchema();
