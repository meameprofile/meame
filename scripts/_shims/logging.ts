// RUTA: scripts/_shims/logging.ts
/**
 * @file logging.ts (Shim)
 * @description Implementación de reemplazo (shim) del logger, ahora
 *              sincronizada con la API v20+ del logger soberano para
 *              garantizar la integridad de contrato en todo el ecosistema.
 * @version 2.0.0 (API Contract Alignment & Elite Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
/* eslint-env node */
import chalk from "chalk";

type LogContext = Record<string, unknown>;

const traces = new Map<string, { name: string; startTime: number }>();
const getTimestamp = (): string =>
  new Date().toLocaleTimeString("en-US", { hour12: false });

export const logger = {
  track: () => {
    // No-op en scripts
  },
  startGroup: (label: string): string => {
    const groupId = `${label.replace(/\s+/g, "-")}-${Math.random().toString(36).substring(2, 9)}`;
    traces.set(groupId, { name: label, startTime: performance.now() });
    console.log(chalk.blue.bold(`\n▶ G-START: [${groupId}] ${label}`));
    return groupId;
  },
  endGroup: (groupId: string): void => {
    const trace = traces.get(groupId);
    if (trace) {
      const duration = (performance.now() - trace.startTime).toFixed(2);
      console.log(
        chalk.blue.bold(`◀ G-END [${groupId}] - Duración: ${duration}ms\n`)
      );
      traces.delete(groupId);
    } else {
      console.log(chalk.blue.bold(`◀ G-END\n`));
    }
  },
  success: (message: string, context?: LogContext) =>
    console.log(chalk.green(`✅ ${message}`), context || ""),
  info: (message: string, context?: LogContext) =>
    console.info(chalk.cyan(`ℹ️ ${message}`), context || ""),
  warn: (message: string, context?: LogContext) =>
    console.warn(chalk.yellow(`⚠️ ${message}`), context || ""),
  error: (message: string, context?: LogContext) =>
    console.error(chalk.red.bold(`❌ ${message}`), context || ""),
  trace: (message: string, context?: LogContext) =>
    console.log(chalk.gray(`• ${message}`), context || ""),
  startTrace: (traceName: string): string => {
    const traceId = `${traceName}-${Math.random().toString(36).substring(2, 9)}`;
    traces.set(traceId, { name: traceName, startTime: performance.now() });
    console.info(`[${getTimestamp()}] 🔗 T-START [${traceId}] (${traceName})`);
    return traceId;
  },
  traceEvent: (traceId: string, eventName: string, context?: object) => {
    console.log(
      `[${getTimestamp()}]   ➡️ [${traceId}] ${eventName}`,
      context || ""
    );
  },
  endTrace: (traceId: string) => {
    const trace = traces.get(traceId);
    if (trace) {
      const duration = (performance.now() - trace.startTime).toFixed(2);
      console.info(
        `[${getTimestamp()}] 🏁 T-END [${traceId}] (${trace.name}) - Duración: ${duration}ms`
      );
      traces.delete(traceId);
    }
  },
};
