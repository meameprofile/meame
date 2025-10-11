// RUTA: src/shared/lib/ssg/engine/build-pipeline.ts
/**
 * @file build-pipeline.ts
 * @description El motor del pipeline para el Motor de Forja. Orquesta la
 *              ejecución secuencial y transaccional de las tareas de build.
 * @version 1.1.0 (Observability Contract Fix)
 * @author RaZ Podestá - MetaShark Tech
 */
import { logger } from "@/shared/lib/logging";

import type { BuildContext, BuildTask } from "./types";

export class BuildPipeline {
  private tasks: BuildTask[] = [];
  private context: BuildContext;

  constructor(context: BuildContext) {
    this.context = context;
  }

  addTask(task: BuildTask): this {
    this.tasks.push(task);
    return this;
  }

  async run(): Promise<{ success: true } | { success: false; error: string }> {
    const traceId = logger.startTrace(
      `BuildPipeline:${this.context.draft.draftId}`
    );
    const groupId = logger.startGroup(
      `[Motor de Forja] Iniciando pipeline para draft: ${this.context.draft.draftId}`
    );

    for (const task of this.tasks) {
      try {
        logger.traceEvent(traceId, `Ejecutando tarea: ${task.name}...`);
        await task.execute(this.context);
        logger.success(
          `[Motor de Forja] Tarea "${task.name}" completada con éxito.`
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido";
        logger.error(
          `[Motor de Forja] Fallo crítico en la tarea "${task.name}". Abortando pipeline.`,
          { error: errorMessage }
        );
        logger.endGroup(groupId);
        logger.endTrace(traceId);
        return {
          success: false,
          error: `Fallo en el paso: ${task.name}. Detalles: ${errorMessage}`,
        };
      }
    }

    logger.success(
      `[Motor de Forja] Pipeline completado con éxito para draft: ${this.context.draft.draftId}`
    );
    logger.endGroup(groupId);
    logger.endTrace(traceId);
    return { success: true };
  }
}
