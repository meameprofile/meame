// RUTA: src/shared/lib/actions/raz-prompts/createPromptEntry.action.ts
/**
 * @file createPromptEntry.action.ts
 * @description Server Action de producción para crear una nueva entrada de prompt.
 *              v12.0.0 (Architectural Integrity & Type Safety Restoration): Restaura
 *              las rutas de importación soberanas y la seguridad de tipos absoluta.
 * @version 12.0.0
 *@author RaZ Podestá - MetaShark Tech
 */
"use server";

import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";
import { createServerClient } from "@/shared/lib/supabase/server";
// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
// Se importa el schema de la entidad desde su SSoT soberana.
import {
  RaZPromptsEntrySchema,
  type RaZPromptsEntry,
} from "@/shared/lib/schemas/raz-prompts/entry.schema";
// Se importan los schemas atómicos desde su SSoT.
import {
  PromptParametersSchema,
  RaZPromptsSesaTagsSchema,
} from "@/shared/lib/schemas/raz-prompts/atomic.schema";
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
import type { ActionResult } from "@/shared/lib/types/actions.types";
import { logger } from "@/shared/lib/logging";
import { IDEOGRAM_PARAMETERS_CONFIG } from "@/shared/lib/config/raz-prompts/parameters.config";

type CreatePromptInput = {
  title: string;
  basePromptText: string;
  aiService: string;
  parameters: z.infer<typeof PromptParametersSchema>;
  tags: z.infer<typeof RaZPromptsSesaTagsSchema>;
  keywords: string[];
  workspaceId: string;
};

function assembleFullPrompt(
  baseText: string,
  params: z.infer<typeof PromptParametersSchema>
): string {
  const technicalAdditions: string[] = [];

  for (const config of IDEOGRAM_PARAMETERS_CONFIG) {
    const paramValue = params[config.id as keyof typeof params];
    if (paramValue) {
      const option = config.options.find((opt) => opt.value === paramValue);
      // --- [INICIO DE REFACTORIZACIÓN DE SEGURIDAD DE TIPOS] ---
      // Se fuerza la coerción a string para cumplir con el contrato de la función.
      technicalAdditions.push(
        config.appendToPrompt(
          String(paramValue),
          option?.labelKey || String(paramValue)
        )
      );
      // --- [FIN DE REFACTORIZACIÓN DE SEGURIDAD DE TIPOS] ---
    }
  }

  technicalAdditions.push("8k, ultra-high detail, sharp focus, photorealistic");
  return `${baseText}, ${technicalAdditions.join(", ")}`;
}

export async function createPromptEntryAction(
  input: CreatePromptInput
): Promise<ActionResult<{ promptId: string }>> {
  const traceId = logger.startTrace("createPromptEntry_v12.0");
  logger.startGroup(`[Action] Creando nueva entrada de prompt...`);

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      logger.warn("[Action] Intento no autorizado.", { traceId });
      return { success: false, error: "auth_required" };
    }
    logger.traceEvent(traceId, `Usuario ${user.id} autorizado.`);

    const { workspaceId } = input;
    const { data: memberCheck, error: memberError } = await supabase.rpc(
      "is_workspace_member",
      { workspace_id_to_check: workspaceId, min_role: "member" }
    );

    if (memberError || !memberCheck) {
      throw new Error("Acceso denegado al workspace.");
    }
    logger.traceEvent(
      traceId,
      `Membresía del workspace ${workspaceId} verificada.`
    );

    const newPromptId = createId();
    const now = new Date().toISOString();
    const fullPromptText = assembleFullPrompt(
      input.basePromptText,
      input.parameters
    );
    logger.traceEvent(traceId, "Prompt profesional ensamblado con éxito.");

    const fullPromptData: RaZPromptsEntry = {
      promptId: newPromptId,
      userId: user.id,
      workspaceId: workspaceId,
      title: input.title,
      status: "pending_generation",
      aiService: input.aiService,
      keywords: input.keywords,
      versions: [
        {
          version: 1,
          basePromptText: input.basePromptText,
          fullPromptText: fullPromptText,
          parameters: input.parameters,
          createdAt: now,
        },
      ],
      tags: input.tags,
      baviAssetIds: [],
      createdAt: now,
      updatedAt: now,
    };

    const validation = RaZPromptsEntrySchema.safeParse(fullPromptData);
    if (!validation.success) {
      logger.error(
        "[Guardián] Fallo de validación de Zod antes de la inserción.",
        { errors: validation.error.flatten(), traceId }
      );
      return {
        success: false,
        error: "Los datos del prompt son inválidos según el esquema.",
      };
    }
    logger.traceEvent(traceId, "Datos del prompt validados con éxito.");

    const { data, error } = await supabase
      .from("razprompts_entries")
      .insert({
        id: validation.data.promptId,
        user_id: validation.data.userId,
        workspace_id: validation.data.workspaceId,
        title: validation.data.title,
        status: validation.data.status,
        ai_service: validation.data.aiService,
        keywords: validation.data.keywords,
        versions: validation.data.versions,
        tags: validation.data.tags,
        bavi_asset_ids: validation.data.baviAssetIds,
        created_at: validation.data.createdAt,
        updated_at: validation.data.updatedAt,
      })
      .select("id")
      .single();

    if (error) {
      throw new Error(`Error de Supabase: ${error.message}`);
    }
    logger.traceEvent(
      traceId,
      `Inserción en base de datos exitosa. ID: ${data.id}`
    );

    logger.success(
      `[Action] Nuevo genoma de prompt ${data.id} creado en workspace ${workspaceId}.`,
      { traceId }
    );
    return { success: true, data: { promptId: data.id } };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(
      "[Action] Fallo crítico durante la creación de la entrada del prompt.",
      { error: errorMessage, traceId }
    );
    return {
      success: false,
      error: `No se pudo crear la entrada del prompt: ${errorMessage}`,
    };
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
