// RUTA: scripts/supabase/connect.ts
/**
 * @file connect.ts
 * @description Guardián de Conexión para Supabase. Verifica variables de entorno
 *              y la conectividad con la API, generando un informe de diagnóstico.
 * @version 2.0.1 (Type Inference Fix)
 * @author RaZ Podestá - MetaShark Tech
 */
import { promises as fs } from "fs";
import * as path from "path";

import { createClient } from "@supabase/supabase-js";

import { loadEnvironment } from "../_utils/env";
import { scriptLogger } from "../_utils/logger";
import type { ScriptActionResult } from "../_utils/types";

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
  apiConnectionResult: {
    status: "OK" | "FAILED";
    message: string;
    details?: unknown;
  };
  summary: string;
}

async function diagnoseSupabaseConnection(): Promise<
  ScriptActionResult<string>
> {
  const traceId = scriptLogger.startTrace("diagnoseSupabaseConnection_v2.0.1");
  const groupId = scriptLogger.startGroup(
    "🔐 Iniciando Guardián de Conexión a Supabase..."
  );

  const reportDir = path.resolve(process.cwd(), "reports", "supabase");
  const reportPath = path.resolve(reportDir, "connect-diagnostics.json");

  const report: Report = {
    reportMetadata: {
      script: "scripts/supabase/connect.ts",
      purpose: "Diagnóstico de Conexión de Supabase",
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      "Este es un informe de diagnóstico de conexión para Supabase.",
      "Analiza 'connectionStatus' para el resultado general.",
      "Revisa 'environmentValidation' para el estado de cada variable de entorno requerida.",
      "Revisa 'apiConnectionResult' para el resultado de la prueba de conexión real con la clave anónima.",
      "Utiliza el 'summary' para una conclusión legible.",
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
    loadEnvironment([
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
    ]);
    let allKeysValid = true;

    scriptLogger.info("Verificando variables de entorno...");
    for (const key of [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
    ]) {
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
          message: `ERROR: Variable '${key}' no definida en .env.local.`,
        });
        scriptLogger.error(`Variable '${key}' NO encontrada.`);
      }
    }

    if (!allKeysValid)
      throw new Error("Una o más variables de entorno de Supabase faltan.");
    scriptLogger.success(
      "Todas las variables de entorno requeridas están presentes."
    );

    scriptLogger.info(
      `Intentando conectar a Supabase en: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`
    );
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.from("workspaces").select("id").limit(1);

    if (error && error.code !== "42501") {
      report.apiConnectionResult = {
        status: "FAILED",
        message: `Fallo la conexión con la API de Supabase: ${error.message}`,
        details: error,
      };
      throw new Error(report.apiConnectionResult.message);
    }

    report.connectionStatus = "SUCCESS";
    report.apiConnectionResult = {
      status: "OK",
      message:
        "La conexión con la API de Supabase y las credenciales anónimas son válidas.",
    };
    report.summary =
      "Diagnóstico exitoso. Las variables de entorno son correctas y la conexión con la API de Supabase está activa.";
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
    if (report.connectionStatus === "FAILED") {
      process.exit(1);
    }
  }

  if (report.connectionStatus === "SUCCESS") {
    return { success: true, data: report.summary };
  } else {
    return { success: false, error: report.summary };
  }
}

diagnoseSupabaseConnection();
