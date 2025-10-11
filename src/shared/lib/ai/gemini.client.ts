// RUTA: src/shared/lib/ai/gemini.client.ts
/**
 * @file gemini.client.ts
 * @description Módulo de Server Actions soberano para interactuar con Google Gemini.
 *              v2.0.0 (Architectural Purity & Contract Compliance): Refactorizado para
 *              exportar únicamente funciones asíncronas, cumpliendo con el estricto
 *              contrato de "use server" de Next.js y resolviendo el error de build.
 * @version 2.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";

import { GenerateTextRequestSchema } from "./gemini.schemas";
import type { GenerateTextRequest } from "./gemini.schemas";

// --- GUARDIA DE CONFIGURACIÓN A NIVEL DE MÓDULO ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  const errorMsg =
    "CRÍTICO: La variable de entorno GEMINI_API_KEY no está definida.";
  logger.error(`[GeminiClient] ${errorMsg}`);
  throw new Error(errorMsg);
}

// --- INSTANCIA SINGLETON INTERNA (NO EXPORTADA) ---
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
logger.trace(
  "[GeminiClient] Instancia interna del cliente de IA de Google inicializada."
);

/**
 * @function generateText
 * @description Server Action para generar texto utilizando un modelo de Gemini.
 * @param {GenerateTextRequest} input - El payload de la petición, conteniendo el prompt y el modelId.
 * @returns {Promise<ActionResult<string>>} El texto generado o un objeto de error.
 */
export async function generateText(
  input: GenerateTextRequest
): Promise<ActionResult<string>> {
  const traceId = logger.startTrace(`gemini.generateText:${input.modelId}`);
  try {
    const validation = GenerateTextRequestSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error:
          validation.error.flatten().fieldErrors.prompt?.[0] ||
          "Petición inválida.",
      };
    }
    const { prompt, modelId } = validation.data;

    const model = genAI.getGenerativeModel({ model: modelId });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    logger.success("[GeminiClient] Texto generado con éxito.", { traceId });
    return { success: true, data: text };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[GeminiClient] Fallo al generar texto.", {
      error: errorMessage,
      traceId,
    });
    return {
      success: false,
      error: "La API de IA no pudo procesar la solicitud.",
    };
  } finally {
    logger.endTrace(traceId);
  }
}
