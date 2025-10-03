// scripts/diagnostics/diag-resend.ts
/**
 * @file diag-resend.ts
 * @description Herramienta de diagnóstico para verificar la configuración de Resend.
 * @version 2.0.0 (Elite Linter Compliance)
 * @author RaZ Podestá - MetaShark Tech
 * @usage pnpm diag:resend
 */
import chalk from "chalk";
import dotenv from "dotenv";
import path from "path";

function runResendDiagnostics() {
  console.clear();
  console.log(
    chalk.cyan.bold("🔬 Iniciando Auditoría de Configuración de Resend...")
  );

  dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;

  let hasErrors = false;

  console.log(chalk.gray("\nVerificando variables de entorno..."));

  if (RESEND_API_KEY && RESEND_API_KEY.startsWith("re_")) {
    console.log(
      chalk.green("  ✅ RESEND_API_KEY está presente y parece válida.")
    );
  } else {
    console.error(
      chalk.red.bold("  ❌ [FALLO] RESEND_API_KEY falta o es inválida.")
    );
    hasErrors = true;
  }

  if (RESEND_FROM_EMAIL && RESEND_FROM_EMAIL.includes("@")) {
    console.log(
      chalk.green("  ✅ RESEND_FROM_EMAIL está presente y parece válido.")
    );
  } else {
    console.error(
      chalk.red.bold("  ❌ [FALLO] RESEND_FROM_EMAIL falta o es inválido.")
    );
    hasErrors = true;
  }

  if (hasErrors) {
    console.error(
      chalk.red.bold(
        "\n❌ Auditoría fallida. Faltan variables de entorno críticas para Resend."
      )
    );
    console.error(
      chalk.white(
        "   Ve a tu dashboard de Resend -> API Keys y copia los valores correctos en tu archivo .env.local."
      )
    );
    process.exit(1);
  }

  // --- [INICIO DE CORRECCIÓN DE HIGIENE DE CÓDIGO] ---
  // Se ha eliminado la variable 'error' no utilizada del bloque catch.
  try {
    // Esta sección puede expandirse para realizar una prueba de conexión real.
  } catch {
    console.error(chalk.red.bold("Error inesperado durante la verificación."));
    process.exit(1);
  }
  // --- [FIN DE CORRECCIÓN DE HIGIENE DE CÓDIGO] ---

  console.log(
    chalk.green.bold(
      "\n✨ Auditoría de Resend completada. ¡La configuración local parece correcta!"
    )
  );
}

runResendDiagnostics();
