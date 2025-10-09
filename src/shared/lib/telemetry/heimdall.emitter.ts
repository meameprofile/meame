// RUTA: src/shared/lib/telemetry/heimdall.emitter.ts
/**
 * @file heimdall.emitter.ts
 * @description Aparato SSoT para la emisión de telemetría.
 *              v27.1.0 (Production Logger Integrity Fix): Restaura la pureza arquitectónica
 *              al desacoplar el logger del servidor de la persistencia directa, resolviendo
 *              la violación de la frontera Cliente-Servidor.
 * @version 27.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { createId } from "@paralleldrive/cuid2";
import {
  type HeimdallEvent,
  type EventStatus,
} from "@/shared/lib/telemetry/heimdall.contracts";
// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA v27.1.0] ---
// Se elimina la importación del módulo de servidor para romper la dependencia ilegal.
// import { persistHeimdallEvent } from "@/shared/lib/telemetry/heimdall.server";
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA v27.1.0] ---

// --- Constantes Soberanas del Módulo ---
const IS_BROWSER = typeof window !== "undefined";
const BATCH_INTERVAL_MS = 30000;
const MAX_BATCH_SIZE = 50;
const TELEMETRY_QUEUE_KEY = "heimdall_queue_v2";

// --- Funciones de Utilidad Puras ---
const getCurrentPath = (): string | undefined => {
  if (IS_BROWSER) return window.location.pathname;
  return undefined;
};

const createHeimdallEvent = (
  baseEvent: Omit<HeimdallEvent, "eventId" | "timestamp" | "context">
): HeimdallEvent => ({
  ...baseEvent,
  eventId: createId(),
  timestamp: new Date().toISOString(),
  context: {
    runtime: IS_BROWSER ? "browser" : "server",
    path: getCurrentPath(),
  },
});

// --- Pipeline de Telemetría del Cliente ---
async function flushTelemetryQueue(isUnloading = false): Promise<void> {
  if (!IS_BROWSER) return;
  const queueJson = localStorage.getItem(TELEMETRY_QUEUE_KEY);
  if (!queueJson) return;
  let eventsToFlush: HeimdallEvent[] = [];
  try {
    eventsToFlush = JSON.parse(queueJson);
    if (eventsToFlush.length === 0) return;
  } catch (error) {
    console.error(
      "[Heimdall Emitter] Cola de telemetría corrupta. Purgando localStorage.",
      error
    );
    localStorage.removeItem(TELEMETRY_QUEUE_KEY);
    return;
  }
  localStorage.setItem(TELEMETRY_QUEUE_KEY, JSON.stringify([]));
  const payload = { events: eventsToFlush };
  const blob = new Blob([JSON.stringify(payload)], {
    type: "application/json",
  });
  try {
    const ingestUrl = "/api/telemetry/ingest";
    if (isUnloading && navigator.sendBeacon) {
      if (!navigator.sendBeacon(ingestUrl, blob)) {
        throw new Error("navigator.sendBeacon devolvió 'false'.");
      }
    } else {
      const response = await fetch(ingestUrl, {
        method: "POST",
        body: blob,
        keepalive: true,
      });
      if (!response.ok) {
        throw new Error(`El servidor respondió con estado ${response.status}`);
      }
    }
  } catch (error) {
    console.warn(
      "[Heimdall Emitter] Fallo al enviar lote. Re-encolando eventos.",
      { error }
    );
    const currentQueueJson = localStorage.getItem(TELEMETRY_QUEUE_KEY);
    const currentQueue: HeimdallEvent[] = currentQueueJson
      ? JSON.parse(currentQueueJson)
      : [];
    const newQueue = [...eventsToFlush, ...currentQueue];
    localStorage.setItem(TELEMETRY_QUEUE_KEY, JSON.stringify(newQueue));
  }
}

function queueClientEvent(event: HeimdallEvent): void {
  if (!IS_BROWSER) return;
  try {
    const queueJson = localStorage.getItem(TELEMETRY_QUEUE_KEY);
    const queue: HeimdallEvent[] = queueJson ? JSON.parse(queueJson) : [];
    queue.push(event);
    localStorage.setItem(TELEMETRY_QUEUE_KEY, JSON.stringify(queue));
    if (queue.length >= MAX_BATCH_SIZE) {
      flushTelemetryQueue(false);
    }
  } catch (error) {
    console.warn(
      "[Heimdall Emitter] Fallo al escribir en la cola de localStorage.",
      { error }
    );
  }
}

if (IS_BROWSER) {
  setInterval(() => flushTelemetryQueue(false), BATCH_INTERVAL_MS);
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flushTelemetryQueue(true);
    }
  });
}

// --- API del Logger Soberano ---
const STYLES = {
  hook: "color: #a855f7; font-weight: bold;",
  action: "color: #2563eb; font-weight: bold;",
  service: "color: #22c55e; font-weight: bold;",
  store: "color: #f97316; font-weight: bold;",
  info: "color: #3b82f6;",
  success: "color: #22c55e;",
  warn: "color: #f59e0b;",
  error: "color: #ef4444; font-weight: bold;",
  trace: "color: #9ca3af;",
  timestamp: "color: #64748b; font-weight: normal;",
};

type LogContext = Record<string, unknown> & { traceId?: string };

interface Logger {
  track: (
    eventName: string,
    data: {
      status: EventStatus;
      payload?: Record<string, unknown>;
      duration?: number;
      traceId: string;
    }
  ) => void;
  startGroup: (label: string, style?: string) => string;
  endGroup: (groupId: string) => void;
  success: (message: string, context?: LogContext) => void;
  info: (message: string, context?: LogContext) => void;
  warn: (message: string, context?: LogContext) => void;
  error: (message: string, context?: LogContext) => void;
  trace: (message: string, context?: LogContext) => void;
  startTrace: (traceName: string) => string;
  traceEvent: (
    traceId: string,
    eventName: string,
    context?: Record<string, unknown>
  ) => void;
  endTrace: (
    traceId: string,
    context?: Record<string, unknown> & { error?: boolean }
  ) => void;
}

const traces = new Map<string, { name: string; startTime: number }>();
const getTimestamp = (): string =>
  new Date().toLocaleTimeString("en-US", { hour12: false });

const baseLogger: Omit<Logger, "track"> = {
  startGroup: (label, style = STYLES.hook) => {
    const groupId = `${label.replace(/\s+/g, "-")}-${Math.random().toString(36).substring(2, 9)}`;
    traces.set(groupId, { name: label, startTime: performance.now() });
    if (IS_BROWSER)
      console.groupCollapsed(
        `%c[${getTimestamp()}] %c▶ G-START [${groupId}] (${label})`,
        STYLES.timestamp,
        style
      );
    else
      console.log(`\n[${getTimestamp()}] ▶ G-START [${groupId}] (${label})`);
    return groupId;
  },
  endGroup: (groupId) => {
    const trace = traces.get(groupId);
    if (trace) {
      const duration = (performance.now() - trace.startTime).toFixed(2);
      if (IS_BROWSER) {
        console.log(
          `%c[${getTimestamp()}] %c◀ G-END [${groupId}] (${trace.name}) - Duración: ${duration}ms`,
          STYLES.timestamp,
          STYLES.success
        );
        console.groupEnd();
      } else
        console.log(
          `[${getTimestamp()}] ◀ G-END [${groupId}] (${trace.name}) - Duración: ${duration}ms\n`
        );
      traces.delete(groupId);
    } else if (IS_BROWSER) console.groupEnd();
  },
  success: (message, context) => {
    if (context?.traceId)
      logger.track(message, {
        status: "SUCCESS",
        traceId: context.traceId,
        payload: context,
      });
    if (IS_BROWSER)
      console.log(
        `%c[${getTimestamp()}] %c✅ ${message}`,
        STYLES.timestamp,
        STYLES.success,
        context || ""
      );
    else console.log(`[${getTimestamp()}] ✅ ${message}`, context || "");
  },
  info: (message, context) => {
    if (context?.traceId)
      logger.track(message, {
        status: "IN_PROGRESS",
        traceId: context.traceId,
        payload: context,
      });
    if (IS_BROWSER)
      console.info(
        `%c[${getTimestamp()}] %cℹ️ ${message}`,
        STYLES.timestamp,
        STYLES.info,
        context || ""
      );
    else console.info(`[${getTimestamp()}] ℹ️ ${message}`, context || "");
  },
  warn: (message, context) => {
    if (context?.traceId)
      logger.track(message, {
        status: "FAILURE",
        traceId: context.traceId,
        payload: context,
      });
    if (IS_BROWSER)
      console.warn(
        `%c[${getTimestamp()}] %c⚠️ ${message}`,
        STYLES.timestamp,
        STYLES.warn,
        context || ""
      );
    else console.warn(`[${getTimestamp()}] ⚠️ ${message}`, context || "");
  },
  error: (message, context) => {
    if (context?.traceId)
      logger.track(message, {
        status: "FAILURE",
        traceId: context.traceId,
        payload: context,
      });
    if (IS_BROWSER)
      console.error(
        `%c[${getTimestamp()}] %c❌ ${message}`,
        STYLES.timestamp,
        STYLES.error,
        context || ""
      );
    else console.error(`[${getTimestamp()}] ❌ ${message}`, context || "");
  },
  trace: (message, context) => {
    if (IS_BROWSER)
      console.log(
        `%c[${getTimestamp()}] %c• ${message}`,
        STYLES.timestamp,
        STYLES.trace,
        context || ""
      );
    else console.log(`[${getTimestamp()}] • ${message}`, context || "");
  },
  startTrace: (traceName) => {
    const traceId = `${traceName.replace(/\s+/g, "-")}-${Math.random().toString(36).substring(2, 9)}`;
    traces.set(traceId, { name: traceName, startTime: performance.now() });
    logger.track(traceName, { status: "IN_PROGRESS", traceId });
    if (IS_BROWSER)
      console.info(
        `%c[${getTimestamp()}] %c🔗 T-START [${traceId}] (${traceName})`,
        STYLES.timestamp,
        STYLES.info
      );
    else
      console.info(
        `[${getTimestamp()}] 🔗 T-START [${traceId}] (${traceName})`
      );
    return traceId;
  },
  traceEvent: (traceId, eventName, context) => {
    logger.track(eventName, {
      status: "IN_PROGRESS",
      traceId,
      payload: context,
    });
    if (IS_BROWSER)
      console.log(
        `%c[${getTimestamp()}] %c  ➡️ [${traceId}] ${eventName}`,
        STYLES.timestamp,
        STYLES.trace,
        context || ""
      );
    else
      console.log(
        `[${getTimestamp()}]   ➡️ [${traceId}] ${eventName}`,
        context || ""
      );
  },
  endTrace: (traceId, context) => {
    const trace = traces.get(traceId);
    if (trace) {
      const duration = performance.now() - trace.startTime;
      const status: EventStatus = context?.error ? "FAILURE" : "SUCCESS";
      logger.track(trace.name, { status, traceId, duration, payload: context });
      if (IS_BROWSER)
        console.log(
          `%c[${getTimestamp()}] %c🏁 T-END [${traceId}] (${
            trace.name
          }) - Duración: ${duration.toFixed(2)}ms`,
          STYLES.timestamp,
          STYLES.success,
          context || ""
        );
      else
        console.log(
          `[${getTimestamp()}] 🏁 T-END [${traceId}] (${
            trace.name
          }) - Duración: ${duration.toFixed(2)}ms`,
          context || ""
        );
      traces.delete(traceId);
    }
  },
};

const developmentLogger: Logger = {
  ...baseLogger,
  track: (eventName, data) => {
    const event = createHeimdallEvent({ eventName, ...data });
    if (IS_BROWSER) {
      queueClientEvent(event);
    } else {
      // --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA v27.1.0] ---
      // En el servidor, en modo desarrollo, simplemente se imprime el evento
      // en formato JSON para una observabilidad inmediata. NO se persiste.
      console.log(`[Heimdall Server Event]: ${JSON.stringify(event, null, 2)}`);
      // --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA v27.1.0] ---
    }
  },
};

const productionLogger: Logger = {
  ...baseLogger,
  track: (eventName, data) => {
    const event = createHeimdallEvent({ eventName, ...data });
    if (IS_BROWSER) {
      queueClientEvent(event);
    } else {
      // --- [INICIO DE REFACTORIZACIÓN DE INTEGRIDAD LÓGICA v27.1.0] ---
      // En producción, en el servidor, simplemente se loguea el evento como JSON.
      // Un servicio externo (como un colector de logs de Vercel) será responsable
      // de capturar este stdout y persistirlo, manteniendo este módulo puro.
      console.log(JSON.stringify(event));
      // --- [FIN DE REFACTORIZACIÓN DE INTEGRIDAD LÓGICA v27.1.0] ---
    }
  },
  // Se desactivan los logs de `trace` en producción por performance.
  trace: () => {},
};

export const logger =
  process.env.NODE_ENV === "development" ? developmentLogger : productionLogger;
