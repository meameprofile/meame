// RUTA: scripts/testing/test-all-services.ts
/**
 * @file test-all-services.ts
 * @description Guardián de Integridad Total Resiliente. Orquesta la ejecución de
 *              todos los scripts de diagnóstico y no se detiene ante el primer fallo.
 * @version 4.0.0 (Holistic & Resilient Orchestrator)
 * @author RaZ Podestá - MetaShark Tech
 */
import { exec } from "child_process";
import chalk from "chalk";

const tests = [
  { name: "Supabase Connect", command: "pnpm diag:supabase:connect" },
  { name: "Supabase Schema", command: "pnpm diag:supabase:schema" },
  { name: "Supabase Content", command: "pnpm diag:supabase:content" },
  { name: "Supabase Dump", command: "pnpm diag:supabase:dump" },
  { name: "Cloudinary Connect", command: "pnpm diag:cloudinary:connect" },
  { name: "Cloudinary Schema", command: "pnpm diag:cloudinary:schema" },
  { name: "Cloudinary Content", command: "pnpm diag:cloudinary:content" },
  { name: "Shopify Connect", command: "pnpm diag:shopify" },
  { name: "Stripe E2E Flow", command: "pnpm test:stripe" },
];

interface TestResult {
  name: string;
  success: boolean;
}

async function runTest(name: string, command: string): Promise<TestResult> {
  console.log(
    chalk.blue.bold(`\n===== EJECUTANDO: ${chalk.yellow(name)} =====\n`)
  );
  return new Promise((resolve) => {
    const child = exec(command, (error) => {
      // La promesa siempre se resuelve, nunca se rechaza.
      resolve({
        name,
        success: !error,
      });
    });

    child.stdout?.pipe(process.stdout);
    child.stderr?.pipe(process.stderr);
  });
}

async function main() {
  console.log(
    chalk.yellow.bold(
      "🚀 Iniciando Guardián de Integridad Total del Ecosistema (Modo Resiliente)..."
    )
  );

  const results: TestResult[] = [];
  for (const test of tests) {
    const result = await runTest(test.name, test.command);
    results.push(result);
  }

  console.log(
    chalk.blue.bold("\n\n===== 📊 INFORME FINAL DE DIAGNÓSTICO =====\n")
  );

  results.forEach((result) => {
    console.log(
      result.success
        ? chalk.green.bold(`  ✅ ${result.name}: PASÓ`)
        : chalk.red.bold(`  ❌ ${result.name}: FALLÓ`)
    );
  });

  const failures = results.filter((r) => !r.success);
  if (failures.length > 0) {
    console.log(
      chalk.red.bold(
        `\n\n[🔥] ${failures.length} de ${tests.length} diagnósticos fallaron. Revisa la salida de cada uno para más detalles.`
      )
    );
    process.exit(1);
  } else {
    console.log(
      chalk.green.bold(
        "\n\n[✨] ¡Éxito Total! Todos los diagnósticos del ecosistema pasaron."
      )
    );
  }
}

main();
