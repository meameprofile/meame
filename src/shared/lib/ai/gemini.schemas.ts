// RUTA: src/shared/lib/ai/gemini.schemas.ts
/**
 * @file gemini.schemas.ts
 * @description SSoT para los contratos de datos de la capa de integración de Gemini.
 * @version 2.0.0 (Architectural Fix): Se elimina la directiva "use server".
 * @author RaZ Podestá - MetaShark Tech
 */

// --- [CORRECCIÓN ARQUITECTÓNICA] ---
// Un archivo de schema no es un módulo de acción, por lo tanto no debe usar "use server".
// --- [FIN DE CORRECCIÓN ARQUITECTÓNICA] ---

import { z } from "zod";

import { GEMINI_MODELS } from "./models.config";

const modelIds = GEMINI_MODELS.map((m) => m.id) as [string, ...string[]];

export const GenerateTextRequestSchema = z.object({
  prompt: z.string().min(10, "El prompt debe tener al menos 10 caracteres."),
  modelId: z.enum(modelIds),
});
export type GenerateTextRequest = z.infer<typeof GenerateTextRequestSchema>;

export const GenerateTextResponseSchema = z.object({
  generatedText: z.string(),
});
export type GenerateTextResponse = z.infer<typeof GenerateTextResponseSchema>;
