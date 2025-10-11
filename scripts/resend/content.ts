// RUTA: scripts/resend/content.ts
/**
 * @file content.ts
 * @description Guardián de Contenido para Resend. Realiza un censo de los
 *              emails enviados recientemente y genera un informe de diagnóstico.
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
  censusStatus: "SUCCESS" | "PARTIAL" | "FAILED";
  contentDetails: {
    recent_emails: unknown[];
  };
  summary: string;
}

async function diagnoseResendContent(): Promise<ScriptActionResult<string>> {
  const traceId = scriptLogger.startTrace("diagnoseResendContent_v1.1");
  const groupId = scriptLogger.startGroup(
    "📊 Realizando censo de contenido (emails enviados) en Resend..."
  );

  const reportDir = path.resolve(process.cwd(), "reports", "resend");
  const reportPath = path.resolve(reportDir, "content-diagnostics.json");

  const report: Report = {
    reportMetadata: {
      script: "scripts/resend/content.ts",
      purpose: "Diagnóstico de Contenido (Emails Recientes) de Resend",
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      "Este es un informe de diagnóstico de contenido para Resend, enfocado en los emails enviados recientemente.",
      "Analiza 'contentDetails.recent_emails' para obtener la lista de los últimos 50 correos.",
      "Verifica los campos 'to', 'from', 'subject' y 'status' de cada correo.",
      "Un estado de 'bounced' o 'complained' en los correos recientes indica un problema de entregabilidad que debe ser investigado.",
      "Un estado 'PARTIAL' indica que la clave de API no tiene permisos para leer el historial de correos.",
    ],
    censusStatus: "FAILED",
    contentDetails: { recent_emails: [] },
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
      "Consultando la lista de emails enviados recientemente..."
    );

    const { data, error } = await resend.emails.list();

    if (error) {
      if (error.message.includes("API key is restricted")) {
        report.censusStatus = "PARTIAL";
        report.summary =
          "Censo parcial. La clave de API no tiene permisos para leer el historial de correos, solo para enviar.";
        scriptLogger.warn(report.summary);
        return { success: true, data: report.summary };
      }
      throw new Error(`La API de Resend devolvió un error: ${error.message}`);
    }

    report.censusStatus = "SUCCESS";
    report.contentDetails.recent_emails = data.data;
    report.summary = `Censo de contenido completado. Se encontraron ${data.data.length} emails recientes.`;

    scriptLogger.info("--- Emails Recientes ---");
    console.table(
      data.data.map((e) => ({
        id: e.id,
        to: e.to,
        subject: e.subject,
        status: e.last_event,
        created_at: e.created_at,
      }))
    );
    scriptLogger.success(report.summary);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    report.summary = `Censo de contenido fallido: ${errorMessage}`;
    scriptLogger.error(report.summary, { traceId });
  } finally {
    await fs.mkdir(reportDir, { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    scriptLogger.info(
      `Informe de diagnóstico guardado en: ${path.relative(process.cwd(), reportPath)}`
    );
    scriptLogger.endGroup(groupId);
    scriptLogger.endTrace(traceId);
    if (report.censusStatus === "FAILED") process.exit(1);
  }

  if (report.censusStatus === "SUCCESS" || report.censusStatus === "PARTIAL") {
    return { success: true, data: report.summary };
  } else {
    return { success: false, error: report.summary };
  }
}

diagnoseResendContent();
