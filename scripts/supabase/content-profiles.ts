// RUTA: scripts/supabase/content-profiles.ts
/**
 * @file content-profiles.ts
 * @description Guardián de Contenido para la tabla `profiles`. Realiza un volcado
 *              completo de los registros de la tabla y genera un informe de diagnóstico.
 * @version 1.1.0 (Schema Synchronization)
 * @author RaZ Podestá - MetaShark Tech
 */
import { promises as fs } from "fs";
import * as path from "path";
import { z } from "zod";
import { createScriptClient } from "../_utils/supabaseClient";
import { scriptLogger } from "../_utils/logger";
import type { ScriptActionResult } from "../_utils/types";

// --- SSoT de Contratos de Datos (Sincronizado con la DB Real) ---
const ProfileSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().nullable(),
  avatar_url: z.string().nullable(),
  updated_at: z.string().datetime(),
  last_sign_in_at: z.string().datetime().nullable(),
  last_sign_in_ip: z.string().nullable(),
  last_sign_in_location: z.string().nullable(),
  created_at: z.string().datetime(),
  provider_name: z.string().nullable(),
  provider_avatar_url: z.string().nullable(),
});

type Profile = z.infer<typeof ProfileSchema>;

interface Report {
  reportMetadata: {
    script: string;
    targetTable: string;
    purpose: string;
    generatedAt: string;
  };
  instructionsForAI: string[];
  dumpStatus: "SUCCESS" | "FAILED";
  data: {
    count: number;
    records: Profile[];
  };
  summary: string;
}

async function diagnoseProfilesContent(): Promise<ScriptActionResult<string>> {
  const TARGET_TABLE = "profiles";
  const traceId = scriptLogger.startTrace(
    `diagnoseContent:${TARGET_TABLE}_v1.1`
  );
  const groupId = scriptLogger.startGroup(
    `💾 Volcando contenido de la Tabla: '${TARGET_TABLE}'...`
  );

  const reportDir = path.resolve(process.cwd(), "reports", "supabase");
  const reportPath = path.resolve(reportDir, `content-${TARGET_TABLE}.json`);

  const report: Report = {
    reportMetadata: {
      script: `scripts/supabase/content-${TARGET_TABLE}.ts`,
      targetTable: TARGET_TABLE,
      purpose: `Volcado de contenido completo de la tabla '${TARGET_TABLE}'.`,
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      `Este es un informe de volcado de contenido para la tabla '${TARGET_TABLE}'.`,
      "Analiza la sección 'data' para obtener todos los registros existentes.",
      "'count' indica el número total de registros en la tabla.",
      "'records' es un array que contiene cada registro como un objeto JSON.",
      "Utiliza esta información para verificar la integridad de los datos, buscar anomalías o preparar migraciones.",
    ],
    dumpStatus: "FAILED",
    data: { count: 0, records: [] },
    summary: "",
  };

  try {
    const supabase = createScriptClient();
    scriptLogger.info(
      `Consultando todos los registros de '${TARGET_TABLE}'...`
    );

    const { data, error, count } = await supabase
      .from(TARGET_TABLE)
      .select("*", { count: "exact" });
    if (error)
      throw new Error(
        `Fallo en la consulta a la tabla '${TARGET_TABLE}': ${error.message}`
      );

    const validation = z.array(ProfileSchema).safeParse(data);
    if (!validation.success) {
      scriptLogger.error(
        "Los datos de la tabla 'profiles' no cumplen con el schema esperado.",
        {
          error: validation.error.flatten(),
          traceId,
        }
      );
      throw new Error(
        `Los datos de la tabla '${TARGET_TABLE}' están corruptos.`
      );
    }

    report.data.records = validation.data;
    report.data.count = count ?? validation.data.length;

    scriptLogger.info("--- Contenido de 'profiles' ---");
    console.table(report.data.records);

    report.dumpStatus = "SUCCESS";
    report.summary = `Volcado de contenido para '${TARGET_TABLE}' completado. Se encontraron ${report.data.count} registros.`;
    scriptLogger.success(report.summary);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    report.summary = `Volcado de contenido fallido: ${errorMessage}`;
    scriptLogger.error(report.summary, { traceId });
  } finally {
    await fs.mkdir(reportDir, { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    scriptLogger.info(
      `Informe de volcado guardado en: ${path.relative(process.cwd(), reportPath)}`
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

diagnoseProfilesContent();
