// RUTA: src/shared/hooks/raz-prompts/use-prompt-creator.ts
/**
 * @file use-prompt-creator.ts
 * @description Hook "cerebro" para la lógica de creación de prompts, ahora con
 *              inyección de contexto de workspace y perfeccionamiento por IA.
 * @version 9.0.0 (Workspace-Aware & AI-Enhanced)
 *@author RaZ Podestá - MetaShark Tech
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
  title: z.string().min(3, "El título es requerido."),
  promptText: z.string().min(10, "El prompt es requerido."),
  enhanceWithAI: z.boolean().default(false), // <-- Switch para IA
  tags: RaZPromptsSesaTagsSchema,
  parameters: PromptParametersSchema.deepPartial(),
  keywords: z.string().min(1, "Al menos una palabra clave es requerida."),
});

export type CreatePromptFormData = z.infer<typeof CreatePromptFormSchema>;

export function usePromptCreator() {
  const traceId = useMemo(() => logger.startTrace("usePromptCreator_v9.0"), []);
  useEffect(() => {
    logger.info("[Hook] usePromptCreator montado.", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const [isPending, startTransition] = useTransition();
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId
  );

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
    logger.startGroup(`[usePromptCreator] Procesando envío de formulario...`);

    if (!activeWorkspaceId) {
      toast.error("Error de Contexto", {
        description: "No hay un workspace activo seleccionado.",
      });
      logger.error(
        `[Guardián de Contexto] Envío abortado: falta workspaceId.`,
        { traceId }
      );
      logger.endGroup();
      return;
    }

    startTransition(async () => {
      let finalPromptText = data.promptText;

      if (data.enhanceWithAI) {
        toast.info("Perfeccionando tu prompt con nuestra IA...");
        const enhancementResult = await enhancePromptAction(data.promptText);
        if (enhancementResult.success) {
          finalPromptText = enhancementResult.data;
          toast.success("¡Prompt perfeccionado!");
          form.setValue("promptText", finalPromptText);
        } else {
          toast.error("Error de la IA", {
            description: enhancementResult.error,
          });
        }
      }

      const result = await createPromptEntryAction({
        title: data.title,
        basePromptText: finalPromptText,
        aiService: data.tags.ai,
        parameters: data.parameters as z.infer<typeof PromptParametersSchema>,
        tags: data.tags,
        keywords: data.keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        workspaceId: activeWorkspaceId,
      });

      if (result.success) {
        toast.success("¡Genoma de Prompt creado!", {
          description: `ID: ${result.data.promptId}.`,
          duration: 10000,
        });
        form.reset();
      } else {
        toast.error("Error en la Creación", { description: result.error });
      }
      logger.endGroup();
    });
  };

  return { form, onSubmit, isPending };
}
