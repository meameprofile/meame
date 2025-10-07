// RUTA: src/shared/hooks/raz-prompts/use-prompt-creator.ts
/**
 * @file use-prompt-creator.ts
 * @description Hook "cerebro" soberano para la lógica de creación de prompts. Este
 *              aparato orquesta el estado del formulario, la validación, la
 *              interacción opcional con la IA para perfeccionamiento, y la
 *              invocación de la acción de servidor para persistir el "genoma creativo".
 *
 * @version 12.0.0 (Hyper-Granular Observability & Elite Documentation)
 * @author L.I.A. Legacy
 *
 * @architecture_notes
 * - **Pilar I (Hiper-Atomización)**: Desacopla toda la lógica compleja del componente
 *   de presentación `PromptCreatorForm`.
 * - **Pilar II (Contrato Estricto)**: Utiliza `zodResolver` y un schema soberano
 *   (`CreatePromptFormSchema`) para una validación de datos a prueba de fallos.
 * - **Pilar III (Observabilidad Profunda)**: Implementa un sistema de tracing anidado
 *   de ciclo de vida y por acción, con `traceEvent` que delimitan cada sub-proceso
 *   crítico (validación, perfeccionamiento por IA, persistencia).
 * - **Pilar VI (Documentación Soberana)**: Documentación exhaustiva a nivel de archivo,
 *   hook, y cada propiedad del valor de retorno.
 * - **Pilar VIII (Resiliencia)**: Guardianes de contrato robustos y manejo de errores
 *   que provee feedback claro al usuario (`toast`) y telemetría detallada al sistema.
 */
"use client";

import { useTransition, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createPromptEntryAction } from "@/shared/lib/actions/raz-prompts";
import { enhancePromptAction } from "@/shared/lib/actions/raz-prompts/enhancePrompt.action";
import {
  RaZPromptsSesaTagsSchema,
  PromptParametersSchema,
} from "@/shared/lib/schemas/raz-prompts/atomic.schema";
import { useWorkspaceStore } from "@/shared/lib/stores/use-workspace.store";
import { logger } from "@/shared/lib/logging";

export const CreatePromptFormSchema = z.object({
  title: z.string().min(3, "El título es requerido y debe tener al menos 3 caracteres."),
  promptText: z.string().min(10, "El texto del prompt es requerido y debe ser significativo."),
  enhanceWithAI: z.boolean().default(false),
  tags: RaZPromptsSesaTagsSchema,
  parameters: PromptParametersSchema.deepPartial(),
  keywords: z.string().min(1, "Se requiere al menos una palabra clave para facilitar la búsqueda."),
});

export type CreatePromptFormData = z.infer<typeof CreatePromptFormSchema>;

/**
 * @function usePromptCreator
 * @description Hook orquestador para la lógica del creador de prompts de RaZPrompts.
 * @returns Un objeto que contiene la instancia del formulario, el manejador de envío y el estado de transición.
 */
export function usePromptCreator() {
  const traceId = useMemo(() => logger.startTrace("usePromptCreator_Lifecycle_v12.0"), []);
  useEffect(() => {
    const groupId = logger.startGroup(`[Hook] usePromptCreator montado.`);
    logger.info("Hook para creación de prompts inicializado y listo.", { traceId });
    return () => {
      logger.endGroup(groupId);
      logger.endTrace(traceId);
    };
  }, [traceId]);

  const [isPending, startTransition] = useTransition();
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);

  const form = useForm<CreatePromptFormData>({
    resolver: zodResolver(CreatePromptFormSchema),
    defaultValues: {
      title: "",
      promptText: "",
      enhanceWithAI: false,
      tags: { ai: "ideo", sty: "pht", fmt: "16x9", typ: "ui", sbj: "abs" },
      parameters: { styleType: "REALISTIC", aspectRatio: "16x9" },
      keywords: "",
    },
  });

  const onSubmit = (data: CreatePromptFormData) => {
    const submitTraceId = logger.startTrace("promptCreator.onSubmit");
    const groupId = logger.startGroup(`[Action Flow] Procesando envío de nuevo prompt...`, submitTraceId);

    if (!activeWorkspaceId) {
      toast.error("Error de Contexto", { description: "No hay un workspace activo seleccionado." });
      logger.error("[Guardián] Envío abortado: activeWorkspaceId es nulo.", { traceId: submitTraceId });
      logger.endGroup(groupId);
      logger.endTrace(submitTraceId, { error: true });
      return;
    }

    startTransition(async () => {
      try {
        let finalPromptText = data.promptText;

        if (data.enhanceWithAI) {
          logger.traceEvent(submitTraceId, "Sub-proceso: Iniciando perfeccionamiento por IA...");
          toast.info("Perfeccionando tu prompt con nuestra IA...");
          const enhancementResult = await enhancePromptAction(data.promptText);

          if (enhancementResult.success) {
            finalPromptText = enhancementResult.data;
            toast.success("¡Prompt perfeccionado por IA!");
            form.setValue("promptText", finalPromptText);
            logger.traceEvent(submitTraceId, "Sub-proceso: Perfeccionamiento por IA exitoso.");
          } else {
            toast.error("Error del Asistente de IA", { description: enhancementResult.error });
            logger.warn("[Action Flow] Fallo en el perfeccionamiento por IA. Se continuará con el prompt original.", {
              error: enhancementResult.error,
              traceId: submitTraceId,
            });
          }
        }

        logger.traceEvent(submitTraceId, "Sub-proceso: Invocando 'createPromptEntryAction' para persistencia...");
        const result = await createPromptEntryAction({
          title: data.title,
          basePromptText: finalPromptText,
          aiService: data.tags.ai,
          parameters: data.parameters as z.infer<typeof PromptParametersSchema>,
          tags: data.tags,
          keywords: data.keywords.split(",").map((keyword) => keyword.trim()).filter(Boolean),
          workspaceId: activeWorkspaceId,
        });

        if (result.success) {
          toast.success("¡Genoma de Prompt creado en la Bóveda!", {
            description: `ID asignado: ${result.data.promptId}`,
            duration: 10000,
          });
          form.reset();
          logger.success("[Action Flow] Creación de genoma de prompt exitosa.", { traceId: submitTraceId, promptId: result.data.promptId });
        } else {
          toast.error("Error en la Creación", { description: result.error });
          logger.error("[Action Flow] Fallo al persistir el genoma del prompt.", {
            error: result.error,
            traceId: submitTraceId,
          });
        }
      } catch (exception) {
          const errorMessage = exception instanceof Error ? exception.message : "Error desconocido.";
          toast.error("Error Inesperado", { description: "Ocurrió un fallo no controlado al crear el prompt." });
          logger.error("[Action Flow] Excepción no controlada durante la creación del prompt.", { error: errorMessage, traceId: submitTraceId });
      } finally {
        logger.endGroup(groupId);
        logger.endTrace(submitTraceId);
      }
    });
  };

  return {
    /**
     * @property {object} form - La instancia completa de `react-hook-form` para gestionar el estado del formulario.
     */
    form,
    /**
     * @property {function} onSubmit - El manejador de envío del formulario que orquesta la validación,
     * el perfeccionamiento por IA opcional y la llamada a la acción de servidor para crear la entrada.
     */
    onSubmit,
    /**
     * @property {boolean} isPending - Un estado booleano que es `true` mientras la transición de
     * envío (incluyendo llamadas a la IA y a la base de datos) está en progreso.
     */
    isPending,
  };
}
