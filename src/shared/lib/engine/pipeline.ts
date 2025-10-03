// RUTA: src/shared/lib/engine/pipeline.ts
/**
 * @file pipeline.ts
 * @description Motor de Pipeline Genérico y Soberano. Orquesta la ejecución
 *              secuencial y transaccional de cualquier tipo de tarea.
 * @version 1.0.0 (Sovereign & DRY)
 *@author RaZ Podestá - MetaShark Tech
 */
import { logger } from "@/shared/lib/logging";

export interface Task<TContext> {
  name: string;
  execute: (context: TContext) => Promise<void>;
}

export class Pipeline<TContext> {
  private tasks: Task<TContext>[] = [];
  private context: TContext;

  constructor(context: TContext) {
    this.context = context;
  }

  addTask(task: Task<TContext>): this {
    this.tasks.push(task);
    return this;
  }

  async run(
    traceId: string
  ): Promise<{ success: true } | { success: false; error: string }> {
    logger.startGroup(
      `[Pipeline Engine] Iniciando ejecución de pipeline...`,
      `traceId: ${traceId}`
    );

    for (const task of this.tasks) {
      try {
        logger.traceEvent(traceId, `Ejecutando tarea: ${task.name}...`);
        await task.execute(this.context);
        logger.success(
          `[Pipeline Engine] Tarea "${task.name}" completada con éxito.`
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido";
        logger.error(
          `[Pipeline Engine] Fallo crítico en la tarea "${task.name}". Abortando.`,
          { error: errorMessage, traceId }
        );
        logger.endGroup();
        return {
          success: false,
          error: `Fallo en el paso: ${task.name}. Detalles: ${errorMessage}`,
        };
      }
    }

    logger.success(`[Pipeline Engine] Pipeline completado con éxito.`, {
      traceId,
    });
    logger.endGroup();
    return { success: true };
  }
}
