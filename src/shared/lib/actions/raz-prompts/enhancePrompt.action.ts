// RUTA: src/shared/lib/actions/raz-prompts/enhancePrompt.action.ts
/**
 * @file enhancePrompt.action.ts
 * @description Server Action de élite para enriquecer un prompt de usuario.
 * @version 2.0.0 (Elite Observability & Resilience)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { z } from "zod";
import { promises as fs } from "fs";
import path from "path";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import { gemini } from "@/shared/lib/ai";

const EnhancePromptInputSchema = z
  .string()
  .min(10, "El prompt es demasiado corto para ser perfeccionado.");

let masterPromptCache: string | null = null;
async function getMasterPrompt(): Promise<string> {
  if (masterPromptCache) return masterPromptCache;
  const filePath = path.join(
    process.cwd(),
    "prompts",
    "enhance-user-prompt.md"
  );
  try {
    masterPromptCache = await fs.readFile(filePath, "utf-8");
    return masterPromptCache;
  } catch (error) {
    logger.error(
      "[enhancePrompt] CRÍTICO: No se pudo cargar el prompt maestro.",
      { error }
    );
    throw new Error("Configuración interna de IA incompleta.");
  }
}

export async function enhancePromptAction(
  promptText: string
): Promise<ActionResult<string>> {
  const traceId = logger.startTrace("enhancePromptAction_v2.0");
  logger.startGroup(`[AI Action] Solicitando perfeccionamiento...`, traceId);

  try {
    const validation = EnhancePromptInputSchema.safeParse(promptText);
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0].message };
    }
    logger.traceEvent(traceId, "Prompt de usuario validado.");

    const masterPrompt = await getMasterPrompt();
    const finalPrompt = `${masterPrompt}\n\nPROMPT DEL USUARIO:\n"${validation.data}"`;
    logger.traceEvent(traceId, "Prompt maestro cargado y ensamblado.");

    const result = await gemini.generateText({
      prompt: finalPrompt,
      modelId: "gemini-1.5-flash",
    });

    if (!result.success) return result;
    logger.traceEvent(traceId, "Respuesta de la IA recibida.");

    const enhancedText = result.data
      .replace(/```(json|text)?\n?|\n?```/g, "")
      .trim();
    if (!enhancedText) {
      throw new Error(
        "La respuesta de la IA estaba vacía después de la limpieza."
      );
    }

    logger.success("[AI Action] Prompt perfeccionado con éxito.", { traceId });
    return { success: true, data: enhancedText };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[AI Action] Fallo crítico al perfeccionar prompt.", {
      error: msg,
      traceId,
    });
    return {
      success: false,
      error: "No se pudo comunicar con el servicio de IA.",
    };
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
