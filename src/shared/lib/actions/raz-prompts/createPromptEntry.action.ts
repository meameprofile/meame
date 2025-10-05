// RUTA: src/shared/lib/actions/raz-prompts/createPromptEntry.action.ts
/**
 * @file createPromptEntry.action.ts
 * @description Server Action de producción para crear una nueva entrada de prompt,
 *              ahora con seguridad de tipos absoluta y alineamiento de contratos.
 * @version 13.0.0 (Absolute Type Safety & Contract Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import "server-only";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";
import { createServerClient } from "@/shared/lib/supabase/server";
import {
  RaZPromptsEntrySchema,
  type RaZPromptsEntry,
} from "@/shared/lib/schemas/raz-prompts/entry.schema";
import {
  PromptParametersSchema,
  RaZPromptsSesaTagsSchema,
} from "@/shared/lib/schemas/raz-prompts/atomic.schema";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import { logger } from "@/shared/lib/logging";
import { IDEOGRAM_PARAMETERS_CONFIG } from "@/shared/lib/config/raz-prompts/parameters.config";
import type { Json } from "@/shared/lib/supabase/database.types";
import type { RazPromptsEntryInsert } from "@/shared/lib/schemas/raz-prompts/raz-prompts.contracts";

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
      technicalAdditions.push(
        config.appendToPrompt(
          String(paramValue),
          option?.labelKey || String(paramValue)
        )
      );
    }
  }
  technicalAdditions.push("8k, ultra-high detail, sharp focus, photorealistic");
  return `${baseText}, ${technicalAdditions.join(", ")}`;
}

export async function createPromptEntryAction(
  input: CreatePromptInput
): Promise<ActionResult<{ promptId: string }>> {
  const traceId = logger.startTrace("createPromptEntry_v13.0");
  logger.startGroup(`[Action] Creando nueva entrada de prompt...`, traceId);

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
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

    const now = new Date().toISOString();
    const fullPromptText = assembleFullPrompt(
      input.basePromptText,
      input.parameters
    );

    const promptEntity: RaZPromptsEntry = {
      promptId: createId(),
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

    const validation = RaZPromptsEntrySchema.safeParse(promptEntity);
    if (!validation.success) {
      return {
        success: false,
        error: "Los datos del prompt son inválidos según el esquema.",
      };
    }
    logger.traceEvent(traceId, "Entidad de prompt validada con Zod.");

    const supabasePayload: RazPromptsEntryInsert = {
      id: validation.data.promptId,
      user_id: validation.data.userId,
      workspace_id: validation.data.workspaceId,
      title: validation.data.title,
      status: validation.data.status,
      ai_service: validation.data.aiService,
      keywords: validation.data.keywords,
      versions: validation.data.versions as Json,
      tags: validation.data.tags as Json,
      bavi_asset_ids: validation.data.baviAssetIds,
      created_at: validation.data.createdAt,
      updated_at: validation.data.updatedAt,
    };
    logger.traceEvent(traceId, "Payload de inserción (snake_case) generado.");

    const { data, error } = await supabase
      .from("razprompts_entries")
      .insert(supabasePayload)
      .select("id")
      .single();

    if (error) {
      throw new Error(`Error de Supabase: ${error.message}`);
    }

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
