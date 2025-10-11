// RUTA: scripts/resend/schema.ts
/**
 * @file schema.ts
 * @description Guardián de Esquema para Resend. Audita los dominios de envío
 *              verificados en la cuenta y genera un informe de diagnóstico.
 * @version 1.1.0 (Elite Observability & Contract Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import { promises as fs } from "fs";
import * as path from "path";

import { Resend } from "resend";

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
  auditStatus: "SUCCESS" | "PARTIAL" | "FAILED";
  schemaDetails: {
    verified_domains: unknown[];
  };
  summary: string;
}

async function diagnoseResendSchema(): Promise<ScriptActionResult<string>> {
  const traceId = scriptLogger.startTrace("diagnoseResendSchema_v1.1");
  const groupId = scriptLogger.startGroup(
    "🔬 Auditando Esquema (Dominios Verificados) de Resend..."
  );

  const reportDir = path.resolve(process.cwd(), "reports", "resend");
  const reportPath = path.resolve(reportDir, "schema-diagnostics.json");

  const report: Report = {
    reportMetadata: {
      script: "scripts/resend/schema.ts",
      purpose: "Diagnóstico de Esquema (Dominios) de Resend",
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      "Este es un informe de diagnóstico de esquema para Resend, enfocado en los dominios de envío.",
      "Analiza 'schemaDetails.verified_domains' para obtener la lista de dominios autorizados para enviar correos.",
      "Verifica que el dominio del 'RESEND_FROM_EMAIL' (configurado en .env.local) esté presente y verificado en esta lista.",
      "Un estado 'PARTIAL' indica que la clave de API no tiene permisos para listar dominios, lo cual es una configuración de seguridad válida pero limita la auditoría.",
    ],
    auditStatus: "FAILED",
    schemaDetails: { verified_domains: [] },
    summary: "",
  };

  try {
    loadEnvironment(["RESEND_API_KEY"]);
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey)
      throw new Error(
        "La variable de entorno RESEND_API_KEY no está definida."
      );

    const resend = new Resend(resendApiKey);
    scriptLogger.info(
      "Consultando la lista de dominios verificados en Resend..."
    );

    const { data, error } = await resend.domains.list();

    if (error) {
      // Manejo resiliente del error de permisos
      if (error.message.includes("API key is restricted")) {
        report.auditStatus = "PARTIAL";
        report.summary =
          "Auditoría parcial. La clave de API no tiene permisos para listar dominios, solo para enviar correos. Esta es una configuración segura.";
        scriptLogger.warn(report.summary);
        return { success: true, data: report.summary };
      }
      throw new Error(`La API de Resend devolvió un error: ${error.message}`);
    }

    report.auditStatus = "SUCCESS";
    report.schemaDetails.verified_domains = data.data;
    report.summary = `Auditoría de esquema completada. Se encontraron ${data.data.length} dominios verificados.`;

    scriptLogger.info("--- Dominios Verificados ---");
    console.table(
      data.data.map((d) => ({
        id: d.id,
        name: d.name,
        region: d.region,
        status: d.status,
      }))
    );
    scriptLogger.success(report.summary);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    report.summary = `Auditoría de esquema fallida: ${errorMessage}`;
    scriptLogger.error(report.summary, { traceId });
  } finally {
    await fs.mkdir(reportDir, { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    scriptLogger.info(
      `Informe de diagnóstico guardado en: ${path.relative(process.cwd(), reportPath)}`
    );
    scriptLogger.endGroup(groupId);
    scriptLogger.endTrace(traceId);
    if (report.auditStatus === "FAILED") process.exit(1);
  }

  if (report.auditStatus === "SUCCESS" || report.auditStatus === "PARTIAL") {
    return { success: true, data: report.summary };
  } else {
    return { success: false, error: report.summary };
  }
}

diagnoseResendSchema();
