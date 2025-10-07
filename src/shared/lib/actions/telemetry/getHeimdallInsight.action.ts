// RUTA: src/shared/lib/actions/telemetry/getHeimdallInsight.action.ts
/**
 * @file getHeimdallInsight.action.ts
 * @description Server Action para obtener un análisis de IA sobre un evento de Heimdall.
 * @version 1.2.0 (Definitive Logger Contract Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import { gemini } from "@/shared/lib/ai";
//import type { HeimdallEventRow } from "@/shared/lib/telemetry/heimdall.contracts";

const InsightRequestSchema = z.object({ eventId: z.string() });

export async function getHeimdallInsightAction(input: {
  eventId: string;
}): Promise<ActionResult<string>> {
  const traceId = logger.startTrace("getHeimdallInsightAction_v1.2");
  // --- [INICIO DE CORRECCIÓN DE CONTRATO v1.2.0] ---
  const groupId = logger.startGroup(
    `[AI Action] Analizando evento: ${input.eventId}`
  );
  // --- [FIN DE CORRECCIÓN DE CONTRATO v1.2.0] ---

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "auth_required" };

    const validation = InsightRequestSchema.safeParse(input);
    if (!validation.success)
      return { success: false, error: "ID de evento inválido." };

    const { data: eventData, error } = await supabase
      .from("heimdall_events")
      .select("*")
      .eq("event_id", validation.data.eventId)
      .single();
    if (error || !eventData) throw new Error("Evento no encontrado.");

    const promptPath = path.join(
      process.cwd(),
      "prompts",
      "analyze-heimdall-event.md"
    );
    const masterPrompt = await fs.readFile(promptPath, "utf-8");

    const finalPrompt = `${masterPrompt}\n\n--- HEIMDALL EVENT DATA ---\n\n${JSON.stringify(eventData, null, 2)}`;

    const result = await gemini.generateText({
      prompt: finalPrompt,
      modelId: "gemini-1.5-flash",
    });
    if (!result.success) return result;

    // Limpieza robusta de la respuesta JSON de la IA
    const cleanJsonString = result.data
      .replace(/```json\n?|\n?```/g, "")
      .trim();

    // Guardián de Resiliencia: Validar que el string no esté vacío antes de parsear
    if (!cleanJsonString) {
      throw new Error(
        "La respuesta de la IA estaba vacía después de la limpieza."
      );
    }

    // Devolvemos el string JSON limpio para que el cliente lo parsee.
    // Esto evita errores de serialización de 'toJSON' en el límite de la Server Action.
    return { success: true, data: cleanJsonString };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[AI Action] Fallo en el análisis de Heimdall.", {
      error: msg,
      traceId,
    });
    return { success: false, error: "La IA no pudo procesar el análisis." };
  } finally {
    // --- [INICIO DE CORRECCIÓN DE CONTRATO v1.2.0] ---
    logger.endGroup(groupId);
    logger.endTrace(traceId);
    // --- [FIN DE CORRECCIÓN DE CONTRATO v1.2.0] ---
  }
}
