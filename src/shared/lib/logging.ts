// RUTA: src/shared/lib/logging.ts
/**
 * @file logging.ts
 * @description Aparato SSoT (Single Source of Truth) para el logging y la telemetría.
 *              Actúa como el emisor central del Protocolo Heimdall, orquestando la
 *              captura de eventos de manera isomórfica (cliente/servidor) y resiliente.
 *
 * @version 26.0.0 (Atomic Client-Side Flush & Holistic Refactor)
 * @author L.I.A. Legacy
 *
 * @architecture_notes
 * - **Protocolo Heimdall**: Este módulo es la implementación del emisor del protocolo,
 *   responsable de crear y encolar eventos de telemetría estructurados.
 * - **Persistencia por Lotes (Cliente)**: En el navegador, los eventos se almacenan en
 *   `localStorage` y se envían en lotes para optimizar el rendimiento de la red.
 * - **Lógica de Vaciado Atómico**: La función `flushTelemetryQueue` implementa un
 *   mecanismo de vaciado optimista y re-encolado en caso de fallo, eliminando
 *   condiciones de carrera entre múltiples pestañas y garantizando cero pérdida de datos.
 * - **Separación de Responsabilidades (Servidor)**: En el servidor, el logger se
 *   limita a escribir en la consola. La persistencia de eventos es una acción explícita
 *   manejada por otros aparatos, respetando el Principio de Responsabilidad Única.
 */
import { createId } from "@paralleldrive/cuid2";
import {
  type HeimdallEvent,
  type EventStatus,
} from "@/shared/lib/telemetry/heimdall.contracts";

// --- Constantes Soberanas del Módulo ---
const isBrowser = typeof window !== "undefined";
const BATCH_INTERVAL_MS = 30000; // Enviar eventos cada 30 segundos.
const MAX_BATCH_SIZE = 50; // Enviar eventos cuando la cola alcance este tamaño.
const TELEMETRY_QUEUE_KEY = "heimdall_queue_v1"; // Clave única para el localStorage.

// --- Funciones de Utilidad Puras ---

/**
 * @function getCurrentPath
 * @description Obtiene de forma segura la ruta de la URL actual si se ejecuta en el navegador.
 * @returns {string | undefined} La ruta de la URL o undefined si está en el servidor.
 */
const getCurrentPath = (): string | undefined => {
  if (isBrowser) return window.location.pathname;
  return undefined;
};

// --- Lógica del Pipeline de Telemetría (Exclusivo del Cliente) ---

/**
 * @function flushTelemetryQueue
 * @description Orquesta el envío de lotes de eventos de telemetría al servidor. Su lógica es
 *              atómica para prevenir condiciones de carrera.
 * @param {boolean} [isUnloading=false] - Si es `true`, indica que la página se está cerrando
 *              y utiliza `navigator.sendBeacon` para un envío de datos más fiable y no bloqueante.
 * @returns {Promise<void>}
 */
async function flushTelemetryQueue(isUnloading = false): Promise<void> {
  if (!isBrowser) return;

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

  // --- LÓGICA ATÓMICA DE VACIADO ---
  // 1. Vaciado Optimista: Se limpia la cola inmediatamente para que ninguna otra
  //    pestaña o proceso pueda leer y enviar los mismos eventos.
  localStorage.setItem(TELEMETRY_QUEUE_KEY, JSON.stringify([]));

  const payload = { events: eventsToFlush };
  const blob = new Blob([JSON.stringify(payload)], {
    type: "application/json",
  });

  try {
    if (isUnloading && navigator.sendBeacon) {
      // 2a. Envío No Bloqueante: Ideal para cuando el usuario abandona la página.
      if (!navigator.sendBeacon("/api/telemetry/ingest", blob)) {
        throw new Error("navigator.sendBeacon devolvió 'false', indicando fallo.");
      }
    } else {
      // 2b. Envío Estándar: Utiliza fetch para envíos durante la sesión activa.
      const response = await fetch("/api/telemetry/ingest", {
        method: "POST",
        body: blob,
        keepalive: true, // Mantiene la conexión abierta si la página se descarga.
      });

      if (!response.ok) {
        throw new Error(`El servidor respondió con estado ${response.status}`);
      }
    }
    // Si el envío es exitoso, la cola ya está limpia y no se necesita hacer nada más.
  } catch (error) {
    console.warn(
      "[Heimdall Emitter] Fallo al enviar lote. Re-encolando eventos para reintento.",
      { error }
    );
    // 3. Rollback de Resiliencia: Si el envío falla, los eventos se reinsertan al
    //    principio de la cola actual para no perder datos.
    const currentQueueJson = localStorage.getItem(TELEMETRY_QUEUE_KEY);
    const currentQueue: HeimdallEvent[] = currentQueueJson
      ? JSON.parse(currentQueueJson)
      : [];
    const newQueue = [...eventsToFlush, ...currentQueue];
    localStorage.setItem(TELEMETRY_QUEUE_KEY, JSON.stringify(newQueue));
  }
}

// Inicialización del pipeline de telemetría en el cliente.
if (isBrowser) {
  setInterval(() => flushTelemetryQueue(false), BATCH_INTERVAL_MS);
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flushTelemetryQueue(true);
    }
  });
}

/**
 * @function _createAndQueueEvent
 * @description Función interna que crea un evento Heimdall completo y lo encola
 *              para su envío (en el cliente) o simplemente lo prepara (en el servidor).
 * @param {Omit<HeimdallEvent, "eventId" | "timestamp" | "context">} event - El objeto de evento parcial.
 */
function _createAndQueueEvent(
  event: Omit<HeimdallEvent, "eventId" | "timestamp" | "context">
): void {
  const fullEvent: HeimdallEvent = {
    ...event,
    eventId: createId(),
    timestamp: new Date().toISOString(),
    context: {
      runtime: isBrowser ? "browser" : "server",
      path: getCurrentPath(),
    },
  };

  if (isBrowser) {
    try {
      const queueJson = localStorage.getItem(TELEMETRY_QUEUE_KEY);
      const queue: HeimdallEvent[] = queueJson ? JSON.parse(queueJson) : [];
      queue.push(fullEvent);
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
  // En el servidor, este logger no persiste eventos directamente para mantener
  // la pureza y el performance. La persistencia es una acción explícita.
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

const developmentLogger: Logger = {
  track: (eventName, data) => _createAndQueueEvent({ eventName, ...data }),
  startGroup: (label, style = STYLES.hook) => {
    const groupId = `${label.replace(/\s+/g, "-")}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    traces.set(groupId, { name: label, startTime: performance.now() });
    if (isBrowser)
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
      if (isBrowser) {
        console.log(
          `%c[${getTimestamp()}] %c◀ G-END [${groupId}] (${
            trace.name
          }) - Duración: ${duration}ms`,
          STYLES.timestamp,
          STYLES.success
        );
        console.groupEnd();
      } else
        console.log(
          `[${getTimestamp()}] ◀ G-END [${groupId}] (${
            trace.name
          }) - Duración: ${duration}ms\n`
        );
      traces.delete(groupId);
    } else if (isBrowser) console.groupEnd();
  },
  success: (message, context) => {
    if (context?.traceId)
      developmentLogger.track(message, {
        status: "SUCCESS",
        traceId: context.traceId,
        payload: context,
      });
    if (isBrowser)
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
      developmentLogger.track(message, {
        status: "IN_PROGRESS",
        traceId: context.traceId,
        payload: context,
      });
    if (isBrowser)
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
      developmentLogger.track(message, {
        status: "FAILURE",
        traceId: context.traceId,
        payload: context,
      });
    if (isBrowser)
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
      developmentLogger.track(message, {
        status: "FAILURE",
        traceId: context.traceId,
        payload: context,
      });
    if (isBrowser)
      console.error(
        `%c[${getTimestamp()}] %c❌ ${message}`,
        STYLES.timestamp,
        STYLES.error,
        context || ""
      );
    else console.error(`[${getTimestamp()}] ❌ ${message}`, context || "");
  },
  trace: (message, context) => {
    if (isBrowser)
      console.log(
        `%c[${getTimestamp()}] %c• ${message}`,
        STYLES.timestamp,
        STYLES.trace,
        context || ""
      );
    else console.log(`[${getTimestamp()}] • ${message}`, context || "");
  },
  startTrace: (traceName) => {
    const traceId = `${traceName.replace(/\s+/g, "-")}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    traces.set(traceId, { name: traceName, startTime: performance.now() });
    developmentLogger.track(traceName, { status: "IN_PROGRESS", traceId });
    if (isBrowser)
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
    developmentLogger.track(eventName, {
      status: "IN_PROGRESS",
      traceId,
      payload: context,
    });
    if (isBrowser)
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
      developmentLogger.track(trace.name, {
        status,
        traceId,
        duration,
        payload: context,
      });
      if (isBrowser)
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

const productionLogger: Logger = {
  track: (eventName, data) => _createAndQueueEvent({ eventName, ...data }),
  startGroup: (label: string) => {
    const traceId = `prod-group-${label.substring(0, 10)}-${Math.random().toString(36).substring(2, 9)}`;
    productionLogger.track(label, { status: "IN_PROGRESS", traceId });
    return traceId;
  },
  endGroup: (groupId: string) => {
    productionLogger.track("Group End", {
      status: "SUCCESS",
      traceId: groupId,
    });
  },
  success: (message, context) => {
    if (context?.traceId)
      productionLogger.track(message, { status: "SUCCESS", traceId: context.traceId, payload: context });
  },
  info: (message, context) => {
    if (context?.traceId)
      productionLogger.track(message, { status: "IN_PROGRESS", traceId: context.traceId, payload: context });
  },
  warn: (message, context) => {
    if (context?.traceId)
      productionLogger.track(message, { status: "FAILURE", traceId: context.traceId, payload: context });
  },
  error: (message, context) => {
    if (context?.traceId)
      productionLogger.track(message, { status: "FAILURE", traceId: context.traceId, payload: context });
  },
  trace: () => {
    // El trace es una operación de depuración y no se ejecuta en producción por performance.
  },
  startTrace: (traceName) => {
    const traceId = `prod-trace-${traceName.substring(0, 15)}-${Math.random().toString(36).substring(2, 9)}`;
    productionLogger.track(traceName, { status: "IN_PROGRESS", traceId });
    return traceId;
  },
  traceEvent: (traceId, eventName, context) => {
    productionLogger.track(eventName, { status: "IN_PROGRESS", traceId, payload: context });
  },
  endTrace: (traceId, context) => {
    const status: EventStatus = context?.error ? "FAILURE" : "SUCCESS";
    productionLogger.track("Trace End", { status, traceId, payload: context });
  },
};

export const logger =
  process.env.NODE_ENV === "development" ? developmentLogger : productionLogger;
