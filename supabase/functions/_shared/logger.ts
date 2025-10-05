// supabase/functions/_shared/logger.ts
/**
 * @file logger.ts
 * @description Logger soberano y estructurado para el entorno de Deno en Supabase Edge Functions.
 *              Emite logs en formato JSON para una observabilidad de producción de élite.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */

type LogLevel = "INFO" | "WARN" | "ERROR" | "TRACE";

interface LogContext {
  traceId?: string;
  [key: string]: unknown;
}

function writeLog(level: LogLevel, message: string, context?: LogContext) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  };
  // console.log es el stdout estándar en Deno, que Supabase captura.
  console.log(JSON.stringify(logEntry));
}

export const logger = {
  info: (message: string, context?: LogContext) =>
    writeLog("INFO", message, context),
  warn: (message: string, context?: LogContext) =>
    writeLog("WARN", message, context),
  error: (message: string, context?: LogContext) =>
    writeLog("ERROR", message, context),
  trace: (message: string, context?: LogContext) =>
    writeLog("TRACE", message, context),

  // Mantenemos la interfaz de tracing para consistencia, aunque más simplificada.
  startTrace: (name: string): string => {
    const traceId = `${name}-${crypto.randomUUID().slice(0, 8)}`;
    logger.info(`Trace Start: ${name}`, { traceId });
    return traceId;
  },
  traceEvent: (traceId: string, eventName: string, context?: LogContext) => {
    logger.trace(`Trace Event: ${eventName}`, { ...context, traceId });
  },
  endTrace: (traceId: string) => {
    logger.info(`Trace End`, { traceId });
  },
  startGroup: (label: string) => logger.trace(`--- GROUP START: ${label} ---`),
  endGroup: () => logger.trace(`--- GROUP END ---`),
};
