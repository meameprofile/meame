// RUTA: src/app/[locale]/(dev)/heimdall-observatory/system-health/_components/SystemHealthClient.tsx
/**
 * @file SystemHealthClient.tsx
 * @description Componente de cliente ("Client Core") para el Sismógrafo de Salud.
 *              v2.0.0 (Heimdall Contract v30+ Alignment): Se alinea la llamada a
 *              traceEvent con la nueva firma soberana del emisor de telemetría.
 * @version 2.0.0
 * @author L.I.A. Legacy
 */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useMemo, useEffect } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  DynamicIcon,
  Badge,
  ScrollArea,
} from "@/components/ui";
import type { TaskHealthSummary } from "@/shared/lib/actions/telemetry/getTaskHealthSummaries.action";
import { logger } from "@/shared/lib/telemetry/heimdall.emitter";
import { cn } from "@/shared/lib/utils/cn";

interface SystemHealthClientProps {
  initialData: TaskHealthSummary[];
}

const TaskStatusIndicator = ({ status }: { status: "SUCCESS" | "FAILURE" }) => (
  <div
    className={cn(
      "h-3 w-3 rounded-full flex-shrink-0",
      status === "SUCCESS" ? "bg-green-500" : "bg-red-500 animate-pulse"
    )}
    title={`Estado: ${status}`}
  />
);

export function SystemHealthClient({ initialData }: SystemHealthClientProps) {
  const traceId = useMemo(
    () => logger.startTrace("SystemHealthClient_Lifecycle_v2.0"),
    []
  );
  const [selectedTask, setSelectedTask] = useState<TaskHealthSummary | null>(
    initialData[0] || null
  );

  useEffect(() => {
    const groupId = logger.startGroup(
      "[SystemHealthClient] Componente montado y operacional."
    );
    return () => {
      logger.endGroup(groupId);
      logger.endTrace(traceId);
    };
  }, [traceId]);

  const handleSelectTask = (task: TaskHealthSummary) => {
    // --- [INICIO DE REFACTORIZACIÓN DE CONTRATO] ---
    // La llamada ahora cumple con la firma: traceEvent(traceId, eventName, payload)
    logger.traceEvent(traceId, "SELECT_TASK", { taskId: task.task_id });
    // --- [FIN DE REFACTORIZACIÓN DE CONTRATO] ---
    setSelectedTask(task);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-20rem)]">
      <Card className="lg:col-span-1 flex flex-col">
        <CardHeader>
          <CardTitle>Registro de Tareas</CardTitle>
          <CardDescription>Últimas 50 tareas ejecutadas.</CardDescription>
        </CardHeader>
        <ScrollArea className="flex-grow">
          <CardContent>
            <motion.div
              className="space-y-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {initialData.map((task) => (
                <motion.div key={task.task_id} variants={itemVariants}>
                  <Button
                    variant={
                      selectedTask?.task_id === task.task_id
                        ? "secondary"
                        : "ghost"
                    }
                    className="w-full h-auto py-2 justify-start text-left"
                    onClick={() => handleSelectTask(task)}
                  >
                    <TaskStatusIndicator status={task.task_status} />
                    <div className="flex flex-col ml-3">
                      <span className="font-semibold text-sm line-clamp-1">
                        {task.task_name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(task.task_timestamp).toLocaleString()}
                      </span>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </ScrollArea>
      </Card>

      <Card className="lg:col-span-2 flex flex-col">
        <CardHeader>
          <CardTitle>Detalles de la Tarea</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTask?.task_id || "empty"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {selectedTask ? (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <TaskStatusIndicator status={selectedTask.task_status} />
                    <h3 className="text-lg font-bold">
                      {selectedTask.task_name}
                    </h3>
                    <Badge
                      variant={
                        selectedTask.task_status === "SUCCESS"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {selectedTask.task_status}
                    </Badge>
                  </div>
                  <div className="text-sm space-y-2 text-muted-foreground">
                    <p>
                      <strong>ID Tarea:</strong>{" "}
                      <span className="font-mono text-xs">
                        {selectedTask.task_id}
                      </span>
                    </p>
                    <p>
                      <strong>Timestamp:</strong>{" "}
                      {new Date(selectedTask.task_timestamp).toISOString()}
                    </p>
                    <p>
                      <strong>Duración:</strong>{" "}
                      {selectedTask.duration_ms ?? "N/A"} ms
                    </p>
                    <p>
                      <strong>User ID:</strong> {selectedTask.user_id || "N/A"}
                    </p>
                    <p>
                      <strong>Workspace ID:</strong>{" "}
                      {selectedTask.workspace_id || "N/A"}
                    </p>
                  </div>
                  <Button variant="outline" className="mt-6" disabled>
                    <DynamicIcon name="ZoomIn" className="mr-2 h-4 w-4" />
                    Ver Detalles Forenses (Próximamente)
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <DynamicIcon
                    name="MousePointerClick"
                    className="h-10 w-10 mb-4"
                  />
                  <p>Selecciona una tarea de la lista para ver sus detalles.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
