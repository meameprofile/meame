// RUTA: src/shared/lib/actions/raz-prompts/enhancePrompt.action.ts
/**
 * @file enhancePrompt.action.ts
 * @description Server Action de élite para enriquecer un prompt de usuario
 *              utilizando el motor de IA soberano (TEMEO).
 * @version 1.0.0
 *@author RaZ Podestá - MetaShark Tech
 */
"use server";

import { z } from "zod";
import { promises as fs } from "fs";
import path from "path";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import { gemini } from "@/shared/lib/ai";

// Pilar II: Contrato de Datos de Entrada Estricto
const EnhancePromptInputSchema = z
  .string()
  .min(
    10,
    "El prompt base es demasiado corto para ser enriquecido significativamente."
  );

// Cache para el prompt maestro para evitar lecturas de disco innecesarias
let masterPromptCache: string | null = null;

/**
 * @function getMasterPrompt
 * @description Carga la SSoT del prompt maestro desde el sistema de archivos.
 * @returns {Promise<string>} El contenido del prompt maestro.
 * @private
 */
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
      "[enhancePromptAction] CRÍTICO: No se pudo cargar el prompt maestro.",
      { path: filePath, error }
    );
    throw new Error("La configuración de la IA interna está incompleta.");
  }
}

export async function enhancePromptAction(
  promptText: string
): Promise<ActionResult<string>> {
  // Pilar III: Observabilidad Total con Tracing
  const traceId = logger.startTrace("enhancePromptAction_v1.0");
  logger.startGroup(`[AI Action] Solicitando perfeccionamiento de prompt...`);

  try {
    // Pilar II: Guardián de Validación de Entrada
    const validation = EnhancePromptInputSchema.safeParse(promptText);
    if (!validation.success) {
      logger.warn("[AI Action] Validación de entrada fallida.", {
        error: validation.error.flatten(),
        traceId,
      });
      return { success: false, error: validation.error.errors[0].message };
    }
    const userPrompt = validation.data;
    logger.traceEvent(traceId, "Prompt de usuario validado con éxito.");

    // Carga y ensamblaje del prompt final
    const masterPrompt = await getMasterPrompt();
    const finalPrompt = `${masterPrompt}\n\nPROMPT DEL USUARIO:\n"${userPrompt}"`;
    logger.traceEvent(traceId, "Prompt maestro cargado y ensamblado.");

    // Delegación a la capa de servicio de IA soberana
    const result = await gemini.generateText({
      prompt: finalPrompt,
      modelId: "gemini-1.5-flash",
    });

    if (!result.success) {
      // El error ya fue logueado dentro del cliente Gemini, aquí solo lo propagamos de forma segura.
      return result;
    }
    logger.traceEvent(traceId, "Respuesta de la IA recibida.");

    // Limpieza de la respuesta para obtener solo el texto del prompt
    const enhancedText = result.data
      .replace(/```(json|text)?\n?|\n?```/g, "")
      .trim();

    logger.success("[AI Action] Prompt perfeccionado y validado con éxito.", {
      traceId,
    });
    return { success: true, data: enhancedText };
  } catch (error) {
    // Pilar de Resiliencia: Captura de errores holística
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(
      "[AI Action] Fallo crítico durante el perfeccionamiento del prompt.",
      {
        error: errorMessage,
        traceId,
      }
    );
    return {
      success: false,
      error:
        "No se pudo comunicar con el servicio de IA para mejorar el prompt.",
    };
  } finally {
    // Pilar III: Cierre de la traza para medir la duración total
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
