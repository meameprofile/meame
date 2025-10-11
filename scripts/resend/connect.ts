// RUTA: scripts/resend/connect.ts
/**
 * @file connect.ts
 * @description Guardián de Conexión para Resend. Verifica variables de entorno
 *              y la conectividad con la API, generando un informe de diagnóstico.
 * @version 2.0.3 (Holistic Integrity Restoration)
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

async function diagnoseResendConnection(): Promise<ScriptActionResult<string>> {
  const traceId = scriptLogger.startTrace("diagnoseResendConnection_v2.0.3");
  const groupId = scriptLogger.startGroup(
    "✉️  Iniciando Guardián de Conexión a Resend (v2.0.3)..."
  );

  const reportDir = path.resolve(process.cwd(), "reports", "resend");
  const reportPath = path.resolve(reportDir, "connect-diagnostics.json");

  const report: Report = {
    reportMetadata: {
      script: "scripts/resend/connect.ts",
      purpose: "Diagnóstico de Conexión de Resend",
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      "Este es un informe de diagnóstico de conexión para el servicio de envío de correos Resend.",
      "Analiza 'connectionStatus' para el resultado general.",
      "Revisa 'environmentValidation' para el estado de cada variable de entorno. Presta atención al estado 'INVALID' que indica un formato incorrecto.",
      "Revisa 'apiConnectionResult' para el resultado de la prueba de envío de correo.",
    ],
    connectionStatus: "FAILED",
    environmentValidation: [],
    apiConnectionResult: {
      status: "FAILED",
      message: "La prueba no se ha ejecutado.",
    },
    summary: "",
  };

  try {
    loadEnvironment();
    const requiredKeys = ["RESEND_API_KEY", "RESEND_FROM_EMAIL"];
    let allKeysValid = true;

    scriptLogger.info("Verificando variables de entorno...");
    for (const key of requiredKeys) {
      const value = process.env[key];
      let status: "OK" | "MISSING" | "INVALID" = "MISSING";
      let message = `ERROR: Variable '${key}' no definida en .env.local.`;

      if (value && value !== "") {
        if (key === "RESEND_API_KEY" && !value.startsWith("re_")) {
          status = "INVALID";
          message = `ERROR: La variable '${key}' parece tener un formato inválido.`;
          allKeysValid = false;
        } else if (key === "RESEND_FROM_EMAIL" && !value.includes("@")) {
          status = "INVALID";
          message = `ERROR: La variable '${key}' no parece ser un correo válido.`;
          allKeysValid = false;
        } else {
          status = "OK";
          message = `Variable '${key}' configurada.`;
          scriptLogger.success(`Variable '${key}' encontrada.`);
        }
      } else {
        allKeysValid = false;
      }

      report.environmentValidation.push({ variable: key, status, message });
      if (status !== "OK") scriptLogger.error(message);
    }

    if (!allKeysValid)
      throw new Error(
        "Una o más variables de entorno de Resend faltan o son inválidas."
      );
    scriptLogger.success(
      "Todas las variables de entorno requeridas están presentes y parecen válidas."
    );

    const resend = new Resend(process.env.RESEND_API_KEY!);
    scriptLogger.info(
      "Intentando enviar email de prueba para verificar la clave de API..."
    );

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: "delivered@resend.dev",
      subject: "Prueba de Conexión de Diagnóstico",
      text: "Este es un correo de prueba automático para verificar la configuración de la API de Resend.",
    });

    if (error) {
      report.apiConnectionResult = {
        status: "FAILED",
        message: `La API de Resend devolvió un error: ${error.message}`,
        details: error,
      };
      throw new Error(report.apiConnectionResult.message);
    }

    report.connectionStatus = "SUCCESS";
    report.apiConnectionResult = {
      status: "OK",
      message: `Email de prueba enviado con éxito. ID de Email: ${data.id}.`,
    };
    report.summary =
      "Diagnóstico exitoso. La conexión con la API de Resend está activa y tiene permisos de envío.";
    scriptLogger.success(report.summary);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    report.summary = `Diagnóstico fallido: ${errorMessage}`;
    scriptLogger.error(report.summary, { traceId });
  } finally {
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

diagnoseResendConnection();
