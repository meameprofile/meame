// scripts/orchestrators/run-holistic-audit.ts
/**
 * @file run-holistic-audit.ts
 * @description Guardián de Integridad Total Resiliente con Informe Holístico.
 *              Orquesta la ejecución de todos los scripts de diagnóstico de dominio
 *              y de consistencia inter-dominio, generando un informe consolidado
 *              y proporcionando un veredicto final sobre la salud del ecosistema.
 * @version 5.0.0 (Deterministic & Regression-Free)
 * @author RaZ Podestá - MetaShark Tech
 */
import { exec } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import chalk from "chalk";
import { scriptLogger as logger } from "../_utils/logger";

// SSoT de las auditorías a ejecutar, en un orden determinista y sin regresiones.
const audits = [
  // --- [FASE 1] GUARDIANES DE DOMINIO DE SERVICIOS (Aislados) ---
  {
    name: "Dominio: Visitor Intelligence (DB)",
    command: "pnpm diag:visitor-intelligence:all",
  },
  { name: "Dominio: Aura (DB)", command: "pnpm diag:aura:all" },
  { name: "Dominio: Cloudinary", command: "pnpm diag:cloudinary:all" },
  { name: "Dominio: MongoDB", command: "pnpm diag:mongo:all" },
  { name: "Dominio: Resend", command: "pnpm diag:resend:all" },
  { name: "Dominio: Shopify", command: "pnpm diag:shopify:all" },
  { name: "Dominio: Stripe", command: "pnpm diag:stripe:all" },
  { name: "Dominio: Nos3 (Vercel Blob)", command: "pnpm diag:nos3:all" },

  // --- [FASE 2] GENERACIÓN DE ESQUEMA HOLÍSTICO (Prerrequisito) ---
  {
    name: "Consistencia: Generación de Schema Holístico DB",
    command: "pnpm diag:supabase:schema-all",
  },

  // --- [FASE 3] GUARDIANES DE CONSISTENCIA INTER-DOMINIO (Dependientes) ---
  {
    name: "Consistencia: Vercel Blob (Nos3) <-> Supabase (Aura)",
    command: "tsx scripts/validation/validate-blob-db-consistency.ts",
  },
  {
    name: "Consistencia: Zod Schemas <-> Supabase DB",
    command: "tsx scripts/validation/validate-all-schema-contracts.ts",
  },
];

// Contratos de datos para el informe y los resultados
interface AuditResult {
  name: string;
  success: boolean;
  duration: number;
  error: string | null;
}

interface HolisticReport {
  reportMetadata: {
    script: string;
    generatedAt: string;
    totalAudits: number;
    successCount: number;
    failureCount: number;
  };
  summary: {
    name: string;
    status: "ÉXITO" | "FALLO";
    durationMs: number;
  }[];
  failures: {
    name: string;
    error: string;
  }[];
}

async function runAudit(name: string, command: string): Promise<AuditResult> {
  const startTime = performance.now();
  logger.startGroup(`[Auditoría] Ejecutando: ${name}`);

  return new Promise((resolve) => {
    const child = exec(command, (error, stdout, stderr) => {
      const duration = performance.now() - startTime;
      let errorMessage: string | null = null;
      if (error) {
        errorMessage = stderr.trim() || stdout.trim() || error.message;
        logger.error(`[Auditoría] Fallo en '${name}'.`, {
          code: error.code,
          error: errorMessage,
        });
      } else {
        logger.success(`[Auditoría] Éxito en '${name}'.`);
      }
      logger.endGroup();
      resolve({ name, success: !error, duration, error: errorMessage });
    });

    child.stdout?.pipe(process.stdout);
    child.stderr?.pipe(process.stderr);
  });
}

async function main() {
  const mainTraceId = logger.startTrace("holistic-audit-orchestrator-v5.0");
  const reportDir = path.resolve(process.cwd(), "reports");
  const holisticReportPath = path.resolve(
    reportDir,
    "holistic-audit-summary.json"
  );

  logger.startGroup(
    "🚀 Iniciando Auditoría Holística (v5.0 - Determinista)..."
  );

  const results: AuditResult[] = [];
  for (const audit of audits) {
    const result = await runAudit(audit.name, audit.command);
    results.push(result);
  }

  const failures = results.filter((r) => !r.success);

  const holisticReport: HolisticReport = {
    reportMetadata: {
      script: "scripts/orchestrators/run-holistic-audit.ts",
      generatedAt: new Date().toISOString(),
      totalAudits: audits.length,
      successCount: audits.length - failures.length,
      failureCount: failures.length,
    },
    summary: results.map((result) => ({
      name: result.name,
      status: result.success ? "ÉXITO" : "FALLO",
      durationMs: parseFloat(result.duration.toFixed(0)),
    })),
    failures: failures.map((f) => ({
      name: f.name,
      error: f.error || "Error desconocido capturado.",
    })),
  };

  try {
    await fs.mkdir(reportDir, { recursive: true });
    await fs.writeFile(
      holisticReportPath,
      JSON.stringify(holisticReport, null, 2)
    );
    logger.info(
      `Informe de resumen holístico guardado en: ${path.relative(process.cwd(), holisticReportPath)}`
    );
  } catch (error) {
    logger.error("No se pudo escribir el informe de resumen holístico.", {
      error,
    });
  }

  logger.startGroup("📊 INFORME FINAL DE CONSOLA");
  console.log("\n");

  const tableData = holisticReport.summary.map((s) => ({
    "Guardián / Dominio": s.name,
    Estado:
      s.status === "ÉXITO"
        ? chalk.green.bold(s.status)
        : chalk.red.bold(s.status),
    "Duración (ms)": s.durationMs,
  }));
  console.table(tableData);

  if (failures.length > 0) {
    logger.error(
      `\n[🔥] ${failures.length} de ${audits.length} dominios presentan anomalías. Revisa 'reports/holistic-audit-summary.json' para detalles.`
    );
    process.exitCode = 1;
  } else {
    logger.success(
      "\n[✨] ¡VICTORIA TOTAL! Todos los diagnósticos se completaron con éxito. La integridad del ecosistema es absoluta."
    );
  }

  logger.endGroup();
  logger.endTrace(mainTraceId);
}

main();
