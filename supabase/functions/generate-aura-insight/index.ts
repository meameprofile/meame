// supabase/functions/generate-aura-insight/index.ts
/**
 * @file index.ts
 * @description Edge Function soberana, ahora con gestión de dependencias de élite.
 * @version 6.1.0 (Dependency Integrity Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
import { serve } from "std/http/server.ts"; // <- URL completa eliminada
import { z } from "zod"; // <- URL completa eliminada
import { corsHeaders } from "@/cors.ts";
import { createSupabaseAdminClient } from "@/supabase-client.ts";
import { logger } from "@/logger.ts";

// --- SSoT: Contratos de Datos ---
const InsightRequestSchema = z.object({
  workspace_id: z.string().uuid(),
  pattern_type: z.string(),
  description: z.string(),
  raw_data: z.any(),
});

const AIInsightResponseSchema = z.object({
  title: z.string(),
  description: z.string(),
  severity: z.enum(["low", "medium", "high", "critical"]),
  recommendation: z.string(),
});

// --- Guardián de Entorno ---
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
if (!GEMINI_API_KEY) {
  throw new Error(
    "CRITICAL: La variable de entorno GEMINI_API_KEY no está definida."
  );
}

serve(async (req: Request) => {
  const traceId = logger.startTrace("edge.generate-aura-insight_v6.1");

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  logger.startGroup(`[Edge Function] Procesando solicitud de insight...`);

  try {
    // 1. Validación del Payload de Entrada
    const payload = await req.json();
    const validation = InsightRequestSchema.safeParse(payload);
    if (!validation.success) {
      throw new Error(
        `Payload de entrada inválido: ${validation.error.message}`
      );
    }
    const { workspace_id, raw_data } = validation.data;
    logger.info("Payload de entrada validado con éxito.", { traceId });

    // 2. Carga del Prompt Maestro
    const supabaseAdmin = createSupabaseAdminClient();
    const { data: promptFile, error: promptError } = await supabaseAdmin.storage
      .from("prompts")
      .download("analyze-user-behavior-pattern.md");
    if (promptError) {
      throw new Error(
        `No se pudo cargar el prompt maestro: ${promptError.message}`
      );
    }
    const masterPrompt = await promptFile.text();
    logger.trace("Prompt maestro cargado.", { traceId });

    // 3. Ensamblaje del Prompt y Llamada a la IA
    const finalPrompt = `${masterPrompt}\n\n--- INPUT DATA ---\n\n${JSON.stringify(validation.data, null, 2)}`;
    const modelToUse =
      Deno.env.get("AURA_INSIGHTS_MODEL") || "gemini-1.5-flash";
    logger.info(`Usando modelo de IA: ${modelToUse}`, { traceId });

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: finalPrompt }] }],
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text();
      throw new Error(
        `Error en la API de Gemini [${geminiResponse.status}]: ${errorBody}`
      );
    }

    const aiResult = await geminiResponse.json();
    const aiResultText = aiResult.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiResultText) {
      throw new Error("La respuesta de la IA no contiene el texto esperado.");
    }
    logger.trace("Respuesta de la IA recibida.", { traceId });

    // 4. Validación de la Respuesta de la IA
    const aiResponseJson = JSON.parse(
      aiResultText.replace(/```json\n?|\n?```/g, "").trim()
    );
    const aiResponseValidation =
      AIInsightResponseSchema.safeParse(aiResponseJson);
    if (!aiResponseValidation.success) {
      throw new Error(
        `La respuesta de la IA tiene un formato inválido: ${aiResponseValidation.error.message}`
      );
    }
    logger.trace("Respuesta de la IA validada.", { traceId });

    // 5. Persistencia del Insight en la Base de Datos
    const { error: insertError } = await supabaseAdmin
      .from("aura_insights")
      .insert({
        workspace_id,
        ...aiResponseValidation.data,
        related_data: raw_data,
      });
    if (insertError) {
      throw new Error(`Fallo al persistir el insight: ${insertError.message}`);
    }
    logger.info("Insight generado y persistido.", { traceId });

    return new Response(
      JSON.stringify({ success: true, message: "Insight generado." }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("Fallo crítico en Edge Function.", {
      error: errorMessage,
      traceId,
    });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
});
