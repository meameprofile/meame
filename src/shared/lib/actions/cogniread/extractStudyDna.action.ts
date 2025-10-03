// RUTA: src/shared/lib/actions/cogniread/extractStudyDna.action.ts
/**
 * @file extractStudyDna.action.ts
 * @description Server Action para orquestar la extracción de StudyDNA
 *              utilizando el motor de IA TEMA.
 * @version 2.0.0 (Architectural Integrity Restoration & Elite Compliance)
 * @author L.I.A. Legacy
 */
"use server";

import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
// La importación ahora apunta a la fachada pública y soberana del módulo de IA.
import { gemini } from "@/shared/lib/ai";
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
import {
  StudyDnaSchema,
  type StudyDna,
} from "@/shared/lib/schemas/cogniread/article.schema";
import { GEMINI_MODELS } from "@/shared/lib/ai/models.config";

const modelIds = GEMINI_MODELS.map((m) => m.id) as [string, ...string[]];

const ExtractDnaInputSchema = z.object({
  studyText: z.string().min(100, "El texto del estudio es demasiado corto."),
  modelId: z.enum(modelIds),
});

type ExtractDnaInput = z.infer<typeof ExtractDnaInputSchema>;

let promptMasterCache: string | null = null;
async function getPromptMaster(): Promise<string> {
  if (promptMasterCache) return promptMasterCache;
  const filePath = path.join(
    process.cwd(),
    "prompts",
    "extrae-padronizadamente-estudio-cientifico.md"
  );
  try {
    promptMasterCache = await fs.readFile(filePath, "utf-8");
    return promptMasterCache;
  } catch (error) {
    logger.error(
      "[extractStudyDnaAction] CRÍTICO: No se pudo cargar el prompt maestro.",
      { path: filePath, error }
    );
    throw new Error(
      "La configuración de la IA interna está incompleta o es inaccesible."
    );
  }
}

export async function extractStudyDnaAction(
  input: ExtractDnaInput
): Promise<ActionResult<StudyDna>> {
  const traceId = logger.startTrace("extractStudyDnaAction_v2.0");
  logger.startGroup(
    `[CogniRead Action] Iniciando extracción de StudyDNA con TEMA...`
  );

  try {
    // --- Guardián de Resiliencia: Validación de Entrada ---
    const validation = ExtractDnaInputSchema.safeParse(input);
    if (!validation.success) {
      const firstError = validation.error.errors[0].message;
      logger.warn("[CogniRead Action] Validación de entrada fallida.", {
        error: firstError,
        traceId,
      });
      return { success: false, error: firstError };
    }
    const { studyText, modelId } = validation.data;
    logger.traceEvent(traceId, "Payload de entrada validado con éxito.");

    // --- Carga y Ensamblaje del Prompt ---
    const promptMaster = await getPromptMaster();
    const finalPrompt = `${promptMaster}\n\n--- INICIO DEL TEXTO DEL ESTUDIO ---\n\n${studyText}\n\n--- FIN DEL TEXTO DEL ESTUDIO ---`;
    logger.traceEvent(traceId, "Prompt maestro cargado y ensamblado.");

    // --- Delegación a la Capa de Servicio de IA Soberana ---
    const result = await gemini.generateText({ prompt: finalPrompt, modelId });
    if (!result.success) {
      // El error ya fue logueado dentro de la DAL de Gemini, aquí lo propagamos de forma segura.
      return result;
    }
    logger.traceEvent(traceId, "Respuesta de la IA recibida con éxito.");

    // --- Procesamiento y Validación de la Respuesta de la IA ---
    const rawJson = result.data.replace(/```json\n?|\n?```/g, "").trim();
    if (!rawJson) {
      throw new Error(
        "La respuesta de la IA estaba vacía después de la limpieza."
      );
    }

    const parsedJson = JSON.parse(rawJson);
    const studyDnaValidation = StudyDnaSchema.safeParse(parsedJson);

    if (!studyDnaValidation.success) {
      logger.error(
        "[Guardián de Contrato] La respuesta de la IA no cumple con el StudyDnaSchema.",
        {
          errors: studyDnaValidation.error.flatten(),
          rawResponse: rawJson,
          traceId,
        }
      );
      throw new Error("La IA devolvió datos en un formato inesperado.");
    }

    logger.success(
      "[CogniRead Action] StudyDNA extraído y validado con éxito.",
      { traceId }
    );
    return { success: true, data: studyDnaValidation.data };
  } catch (error) {
    // --- Guardián de Resiliencia: Captura de Errores Holística ---
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(
      "[CogniRead Action] Fallo crítico durante la extracción de StudyDNA.",
      { error: errorMessage, traceId }
    );
    return {
      success: false,
      error: `No se pudo procesar la extracción del estudio: ${errorMessage}`,
    };
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
