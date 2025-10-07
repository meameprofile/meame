// RUTA: src/shared/lib/logging.ts
/**
 * @file logging.ts
 * @description Aparato SSoT para el logging. Emisor del Protocolo Heimdall v2.0,
 *              con conciencia espacio-temporal, batching en cliente y persistencia
 *              directa en servidor. Es isomórfico, autónomo y de producción pura.
 * @version 20.4.0 (Definitive & Holistically Aligned)
 * @author RaZ Podestá - MetaShark Tech
 */
import { createId } from "@paralleldrive/cuid2";
import {
  type HeimdallEvent,
  type EventStatus,
  type HeimdallEventInsert,
} from "@/shared/lib/telemetry/heimdall.contracts";
import { createServerClient } from "@/shared/lib/supabase/server";
import type { Json } from "@/shared/lib/supabase/database.types";

const isBrowser = typeof window !== "undefined";
const BATCH_INTERVAL_MS = 30000;
const MAX_BATCH_SIZE = 50;
const TELEMETRY_QUEUE_KEY = "heimdall_queue_v1";

const getCurrentPath = (): string | undefined => {
  if (isBrowser) return window.location.pathname;
  return undefined;
};

async function flushTelemetryQueue(isUnloading = false): Promise<void> {
  if (!isBrowser) return;
  const queueJson = localStorage.getItem(TELEMETRY_QUEUE_KEY);
  if (!queueJson) return;

  try {
    const queue: HeimdallEvent[] = JSON.parse(queueJson);
    if (queue.length === 0) return;

    localStorage.removeItem(TELEMETRY_QUEUE_KEY);
    const payload = { events: queue };
    const blob = new Blob([JSON.stringify(payload)], {
      type: "application/json",
    });

    if (isUnloading && navigator.sendBeacon) {
      navigator.sendBeacon("/api/telemetry/ingest", blob);
    } else {
      await fetch("/api/telemetry/ingest", {
        method: "POST",
        body: blob,
        keepalive: true,
      });
    }
  } catch (error) {
    console.warn("[Heimdall Emitter] Fallo al vaciar la cola de telemetría.", {
      error,
    });
  }
}

if (isBrowser) {
  setInterval(() => flushTelemetryQueue(false), BATCH_INTERVAL_MS);
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flushTelemetryQueue(true);
    }
  });
}

function emitHeimdallEvent(
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
      const queue = JSON.parse(
        localStorage.getItem(TELEMETRY_QUEUE_KEY) || "[]"
      );
      queue.push(fullEvent);
      localStorage.setItem(TELEMETRY_QUEUE_KEY, JSON.stringify(queue));
      if (queue.length >= MAX_BATCH_SIZE) {
        flushTelemetryQueue(false);
      }
    } catch (e) {
      console.warn(
        "[Heimdall Emitter] Fallo al escribir en la cola de localStorage.",
        { error: e }
      );
    }
  } else {
    const supabase = createServerClient();
    const recordToInsert: HeimdallEventInsert = {
      event_id: fullEvent.eventId,
      trace_id: fullEvent.traceId,
      event_name: fullEvent.eventName,
      status: fullEvent.status,
      timestamp: fullEvent.timestamp,
      duration_ms: fullEvent.duration,
      payload: fullEvent.payload as Json,
      context: fullEvent.context as Json,
    };
    supabase
      .from("heimdall_events")
      .insert(recordToInsert)
      .then(({ error }) => {
        if (error) {
          console.error(
            "[Heimdall Emitter] Fallo de persistencia directa en servidor:",
            error
          );
        }
      });
  }
}

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
  track: (eventName, data) => emitHeimdallEvent({ eventName, ...data }),
  startGroup: (label, style = STYLES.hook) => {
    const groupId = `${label.replace(/\s+/g, "-")}-${Math.random().toString(36).substring(2, 9)}`;
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
          `%c[${getTimestamp()}] %c◀ G-END [${groupId}] (${trace.name}) - Duration: ${duration}ms`,
          STYLES.timestamp,
          STYLES.success
        );
        console.groupEnd();
      } else
        console.log(
          `[${getTimestamp()}] ◀ G-END [${groupId}] (${trace.name}) - Duration: ${duration}ms\n`
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
    const traceId = `${traceName.replace(/\s+/g, "-")}-${Math.random().toString(36).substring(2, 9)}`;
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
          `%c[${getTimestamp()}] %c🏁 T-END [${traceId}] (${trace.name}) - Duration: ${duration.toFixed(2)}ms`,
          STYLES.timestamp,
          STYLES.success,
          context || ""
        );
      else
        console.log(
          `[${getTimestamp()}] 🏁 T-END [${traceId}] (${trace.name}) - Duration: ${duration.toFixed(2)}ms`,
          context || ""
        );
      traces.delete(traceId);
    }
  },
};

const productionLogger: Logger = {
  track: (eventName, data) => emitHeimdallEvent({ eventName, ...data }),
  startGroup: (label) => {
    const traceId = `prod-group-${Math.random().toString(36).substring(2, 9)}`;
    productionLogger.track(label, { status: "IN_PROGRESS", traceId });
    return traceId;
  },
  endGroup: (groupId) => {
    productionLogger.track("Group End", {
      status: "SUCCESS",
      traceId: groupId,
    });
  },
  success: (message, context) => {
    if (context?.traceId)
      productionLogger.track(message, {
        status: "SUCCESS",
        traceId: context.traceId,
        payload: context,
      });
  },
  info: (message, context) => {
    if (context?.traceId)
      productionLogger.track(message, {
        status: "IN_PROGRESS",
        traceId: context.traceId,
        payload: context,
      });
  },
  warn: (message, context) => {
    if (context?.traceId)
      productionLogger.track(message, {
        status: "FAILURE",
        traceId: context.traceId,
        payload: context,
      });
  },
  error: (message, context) => {
    if (context?.traceId)
      productionLogger.track(message, {
        status: "FAILURE",
        traceId: context.traceId,
        payload: context,
      });
  },
  trace: () => {},
  startTrace: (traceName) => {
    const traceId = `prod-trace-${traceName}-${Math.random().toString(36).substring(2, 9)}`;
    productionLogger.track(traceName, { status: "IN_PROGRESS", traceId });
    return traceId;
  },
  traceEvent: (traceId, eventName, context) => {
    productionLogger.track(eventName, {
      status: "IN_PROGRESS",
      traceId,
      payload: context,
    });
  },
  endTrace: (traceId, context) => {
    const status: EventStatus = context?.error ? "FAILURE" : "SUCCESS";
    productionLogger.track("Trace End", { status, traceId, payload: context });
  },
};

export const logger =
  process.env.NODE_ENV === "development" ? developmentLogger : productionLogger;
