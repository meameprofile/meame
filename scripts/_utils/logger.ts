// RUTA: scripts/_utils/logger.ts
/**
 * @file logger.ts
 * @description SSoT y réplica funcional (shim) del logger principal para el entorno de scripts.
 *              Este aparato es la única fuente de verdad para todo el logging en los scripts.
 * @version 3.0.0 (Consolidated & Elite)
 * @author L.I.A. Legacy
 */
import chalk from "chalk";

const getTimestamp = (): string => new Date().toISOString();

export const scriptLogger = {
  /** Inicia un grupo de logs colapsado en el navegador o delimitado en la terminal. */
  startGroup: (label: string): void =>
    console.log(
      chalk.blue.bold(`\n[${getTimestamp()}] ===== [START] ${label} =====`)
    ),

  /** Finaliza el grupo de logs actual. */
  endGroup: (): void =>
    console.log(chalk.blue.bold(`[${getTimestamp()}] ===== [END] =====\n`)),

  /** Registra un mensaje de éxito. */
  success: (message: string, context?: object): void =>
    console.log(
      chalk.green(`[${getTimestamp()}] ✅ [SUCCESS] ${message}`),
      context || ""
    ),

  /** Registra un mensaje informativo. */
  info: (message: string, context?: object): void =>
    console.log(
      chalk.cyan(`[${getTimestamp()}] ℹ️ [INFO] ${message}`),
      context || ""
    ),

  /** Registra una advertencia. */
  warn: (message: string, context?: object): void =>
    console.warn(
      chalk.yellow(`[${getTimestamp()}] ⚠️ [WARN] ${message}`),
      context || ""
    ),

  /** Registra un error. */
  error: (message: string, context?: object): void =>
    console.error(
      chalk.red.bold(`[${getTimestamp()}] ❌ [ERROR] ${message}`),
      context || ""
    ),

  /** Registra un mensaje de traza de bajo nivel. */
  trace: (message: string, context?: object): void =>
    console.log(
      chalk.gray(`[${getTimestamp()}] • [TRACE] ${message}`),
      context || ""
    ),

  /** Inicia una traza de rendimiento y devuelve un ID único. */
  startTrace: (name: string): string => {
    const traceId = `trace_${name}_${Date.now()}`;
    console.log(
      chalk.magenta(`[${getTimestamp()}] 🔗 TRACE START: ${traceId} (${name})`)
    );
    return traceId;
  },

  /** Registra un evento específico dentro de una traza. */
  traceEvent: (traceId: string, eventName: string, context?: object): void =>
    console.log(
      chalk.magenta(`[${getTimestamp()}]  ➡️  [${traceId}] ${eventName}`),
      context || ""
    ),

  /** Finaliza una traza de rendimiento. */
  endTrace: (traceId: string, context?: object): void =>
    console.log(
      chalk.magenta(`[${getTimestamp()}] 🏁 TRACE END: ${traceId}`),
      context || ""
    ),
};
