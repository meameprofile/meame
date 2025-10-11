// RUTA: src/shared/lib/telemetry/heimdall.emitter.ts
/**
 * @file heimdall.emitter.ts
 * @description SSoT para el Logger Soberano del Protocolo Heimdall (El Emisor).
 *              v33.0.1 (Module Export Contract Restoration): Se restaura la
 *              exportación de `flushTelemetryQueue` para cumplir con el contrato
 *              de la arquitectura de hooks desacoplada.
 * @version 33.0.1
 * @author L.I.A. Legacy
 */
import { createId } from "@paralleldrive/cuid2";

import { useWorkspaceStore } from "@/shared/lib/stores/use-workspace.store";
import type {
  HeimdallEvent,
  EventStatus,
  EventIdentifier,
} from "./heimdall.contracts";

const isBrowser = typeof window !== "undefined";
const BATCH_INTERVAL_MS = 15000;
const MAX_BATCH_SIZE = 50;
const TELEMETRY_QUEUE_KEY = "heimdall_queue_v1";

const tasks = new Map<
  string,
  { name: string; startTime: number; event: EventIdentifier }
>();
const groups = new Map<string, { name: string; startTime: number }>();

const getCurrentPath = (): string | undefined => {
  if (isBrowser) return window.location.pathname;
  return undefined;
};

export async function flushTelemetryQueue(isUnloading = false): Promise<void> {
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

  localStorage.setItem(TELEMETRY_QUEUE_KEY, JSON.stringify([]));

  const payload = { events: eventsToFlush };
  const blob = new Blob([JSON.stringify(payload)], {
    type: "application/json",
  });

  try {
    if (isUnloading && navigator.sendBeacon) {
      if (!navigator.sendBeacon("/api/telemetry/ingest", blob))
        throw new Error("navigator.sendBeacon devolvió 'false'.");
    } else {
      const workspaceId = useWorkspaceStore.getState().activeWorkspaceId;
      const response = await fetch("/api/telemetry/ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-workspace-id": workspaceId || "",
        },
        body: JSON.stringify(payload),
        keepalive: true,
      });
      if (!response.ok)
        throw new Error(
          `El servidor de telemetría respondió con estado ${response.status}`
        );
    }
  } catch (error) {
    console.warn(
      "[Heimdall Emitter] Fallo al enviar lote. Re-encolando eventos para reintento.",
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

if (isBrowser) {
  setInterval(() => {
    flushTelemetryQueue(false);
  }, BATCH_INTERVAL_MS);
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flushTelemetryQueue(true);
    }
  });
}

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
  startTask: (
    event: EventIdentifier,
    title: string,
    context?: Record<string, unknown>
  ) => string;
  taskStep: (
    taskId: string,
    stepName: string,
    status: EventStatus,
    payload?: Record<string, unknown> | null
  ) => void;
  endTask: (taskId: string, finalStatus: "SUCCESS" | "FAILURE") => void;
  startGroup: (label: string, context?: Record<string, unknown>) => string;
  endGroup: (groupId: string) => void;
  success: (message: string, context?: LogContext) => void;
  info: (message: string, context?: LogContext) => void;
  warn: (message: string, context?: LogContext) => void;
  error: (message: string, context?: LogContext) => void;
  trace: (message: string, context?: LogContext) => void;
  startTrace: (traceName: string, context?: Record<string, unknown>) => string;
  traceEvent: (
    traceId: string,
    eventName: string,
    payload?: Record<string, unknown>
  ) => void;
  endTrace: (
    traceId: string,
    context?: Record<string, unknown> & { error?: boolean }
  ) => void;
}

const getTimestamp = (): string =>
  new Date().toLocaleTimeString("en-US", { hour12: false });

const createEvent = (
  event: EventIdentifier,
  title: string,
  status: EventStatus,
  context: Record<string, unknown> = {},
  payload?: Record<string, unknown> | null,
  duration?: number
): HeimdallEvent => ({
  event,
  title,
  traceId: context.traceId as string,
  taskId: context.taskId as string,
  stepName: context.stepName as string,
  status,
  eventId: createId(),
  timestamp: new Date().toISOString(),
  context: { ...context, runtime: isBrowser ? "browser" : "server" },
  payload: payload || undefined,
  duration,
});

const developmentLogger: Logger = {
  startTask: (event, title, context): string => {
    const taskId = `task-${createId()}`;
    tasks.set(taskId, { name: title, startTime: performance.now(), event });
    const taskEvent = createEvent(
      event,
      title,
      "IN_PROGRESS",
      { ...context, taskId, traceId: taskId },
      undefined
    );
    _createAndQueueEvent(taskEvent);
    return taskId;
  },
  taskStep: (taskId, stepName, status, payload): void => {
    const task = tasks.get(taskId);
    if (!task) return;
    const stepEventIdentifier: EventIdentifier = {
      ...task.event,
      action: `STEP:${stepName}`,
    };
    const stepEvent = createEvent(
      stepEventIdentifier,
      stepName,
      status,
      { taskId, traceId: taskId, stepName },
      payload
    );
    _createAndQueueEvent(stepEvent);
  },
  endTask: (taskId, finalStatus): void => {
    const task = tasks.get(taskId);
    if (!task) return;
    const duration = performance.now() - task.startTime;
    const endEvent = createEvent(
      task.event,
      task.name,
      finalStatus,
      { taskId, traceId: taskId },
      undefined,
      duration
    );
    _createAndQueueEvent(endEvent);
    tasks.delete(taskId);
  },
  startGroup: (label, context): string => {
    const groupId = `group-${createId()}`;
    groups.set(groupId, { name: label, startTime: performance.now() });
    console.groupCollapsed(`▶ ${label}`, context || "");
    return groupId;
  },
  endGroup: (groupId) => {
    const group = groups.get(groupId);
    if (group) {
      const duration = (performance.now() - group.startTime).toFixed(2);
      console.log(`Duración del Grupo: ${duration}ms`);
      groups.delete(groupId);
    }
    console.groupEnd();
  },
  success: (message, context) => {
    console.log(
      `%c[${getTimestamp()}] %c✅ ${message}`,
      STYLES.timestamp,
      STYLES.success,
      context || ""
    );
  },
  info: (message, context) => {
    console.info(
      `%c[${getTimestamp()}] %cℹ️ ${message}`,
      STYLES.timestamp,
      STYLES.info,
      context || ""
    );
  },
  warn: (message, context) => {
    console.warn(
      `%c[${getTimestamp()}] %c⚠️ ${message}`,
      STYLES.timestamp,
      STYLES.warn,
      context || ""
    );
  },
  error: (message, context) => {
    console.error(
      `%c[${getTimestamp()}] %c❌ ${message}`,
      STYLES.timestamp,
      STYLES.error,
      context || ""
    );
  },
  trace: (message, context) => {
    console.log(
      `%c[${getTimestamp()}] %c• ${message}`,
      STYLES.timestamp,
      STYLES.trace,
      context || ""
    );
  },
  startTrace: (traceName, context) =>
    developmentLogger.startTask(
      { domain: "TRACE", entity: traceName, action: "EXECUTION" },
      traceName,
      context
    ),
  traceEvent: (traceId, eventName, payload) =>
    developmentLogger.taskStep(traceId, eventName, "IN_PROGRESS", payload),
  endTrace: (traceId, context) => {
    const task = tasks.get(traceId);
    if (task) {
      const duration = performance.now() - task.startTime;
      const status: EventStatus = context?.error ? "FAILURE" : "SUCCESS";
      const endEvent = createEvent(
        task.event,
        task.name,
        status,
        { taskId: traceId, traceId: traceId },
        context,
        duration
      );
      _createAndQueueEvent(endEvent);
      tasks.delete(traceId);
    }
  },
};

const productionLogger: Logger = {
  startTask: (event, title, context): string => {
    const taskId = `task-${createId()}`;
    tasks.set(taskId, { name: title, startTime: Date.now(), event });
    const taskEvent = createEvent(
      event,
      title,
      "IN_PROGRESS",
      { ...context, taskId, traceId: taskId },
      undefined
    );
    _createAndQueueEvent(taskEvent);
    return taskId;
  },
  taskStep: (taskId, stepName, status, payload): void => {
    const task = tasks.get(taskId);
    if (!task) return;
    const stepEventIdentifier: EventIdentifier = {
      ...task.event,
      action: `STEP:${stepName}`,
    };
    const stepEvent = createEvent(
      stepEventIdentifier,
      stepName,
      status,
      { taskId, traceId: taskId, stepName },
      payload
    );
    _createAndQueueEvent(stepEvent);
  },
  endTask: (taskId, finalStatus): void => {
    const task = tasks.get(taskId);
    if (!task) return;
    const duration = Date.now() - task.startTime;
    const endEvent = createEvent(
      task.event,
      task.name,
      finalStatus,
      { taskId, traceId: taskId },
      undefined,
      duration
    );
    _createAndQueueEvent(endEvent);
    tasks.delete(taskId);
  },
  startGroup: (): string => "",
  endGroup: (): void => {},
  success: (): void => {},
  info: (): void => {},
  warn: (): void => {},
  error: (): void => {},
  trace: (): void => {},
  startTrace: (traceName, context) =>
    productionLogger.startTask(
      { domain: "TRACE", entity: traceName, action: "EXECUTION" },
      traceName,
      context
    ),
  traceEvent: (traceId, eventName, payload) =>
    productionLogger.taskStep(traceId, eventName, "IN_PROGRESS", payload),
  endTrace: (traceId, context) => {
    const task = tasks.get(traceId);
    if (task) {
      const duration = Date.now() - task.startTime;
      const status: EventStatus = context?.error ? "FAILURE" : "SUCCESS";
      const endEvent = createEvent(
        task.event,
        task.name,
        status,
        { taskId: traceId, traceId: traceId },
        context,
        duration
      );
      _createAndQueueEvent(endEvent);
      tasks.delete(traceId);
    }
  },
};

export const logger =
  process.env.NODE_ENV === "development" ? developmentLogger : productionLogger;
