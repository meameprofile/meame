// RUTA: supabase/functions/generate-aura-insight/index.ts
/**
 * @file index.ts
 * @description Edge Function soberana. Actúa como un puente neuronal seguro entre la
 *              base de datos y el motor de IA para la generación de insights.
 * @version 4.1.0 (Complete & Unabbreviated)
 * @author L.I.A. Legacy
 */

// NOTA ARQUITECTÓNICA: Las importaciones utilizan los alias definidos en import_map.json.
// Esto es reconocido por el runtime de Deno de Supabase.
import { serve } from "std/http/server.ts";
import { z } from "zod";
import { corsHeaders } from "@/cors.ts";
import { createSupabaseAdminClient } from "@/supabase-client.ts";

// En un entorno de producción real, estas serían importaciones completas,
// pero mantenemos los mocks para que el código sea funcional en un contexto de desarrollo local.
// import { GoogleGenerativeAI } from "npm:@google/generative-ai";
// import { logger } from "@/logging.ts";

const logger = {
  startTrace: (name: string) => {
    console.log(`[TRACE START] ${name}`);
    return name;
  },
  endTrace: (id: string) => {
    console.log(`[TRACE END] ${id}`);
  },
  startGroup: (label: string) => console.log(`[GROUP START] ${label}`),
  endGroup: () => {
    console.log(`[GROUP END]`);
  },
  info: console.log,
  error: console.error,
  traceEvent: console.log,
};

// --- SSoT de Contratos de Datos ---
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

// --- APARATO PRINCIPAL ---

serve(async (req: Request) => {
  const traceId = logger.startTrace("edge.generate-aura-insight_v4.1");

  // Guardián de CORS: Responde a las peticiones OPTIONS inmediatamente.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  logger.startGroup(`[Edge Function] Procesando solicitud de insight...`);

  try {
    // 1. Validación de la Petición Entrante
    const payload = await req.json();
    const validation = InsightRequestSchema.safeParse(payload);
    if (!validation.success) {
      throw new Error(
        "Payload de entrada inválido: " + validation.error.message
      );
    }
    const { workspace_id, description, raw_data } = validation.data;
    logger.traceEvent(traceId, "Payload de entrada validado con éxito.");

    const supabaseAdmin = createSupabaseAdminClient();

    // 2. Obtención del Prompt Maestro desde el Bucket de Almacenamiento
    //    Esto desacopla la lógica del prompt del código de la función.
    const { data: promptFile, error: promptError } = await supabaseAdmin.storage
      .from("prompts") // Asume que tienes un bucket llamado 'prompts'
      .download("analyze-user-behavior-pattern.md");

    if (promptError) {
      throw new Error(
        "No se pudo cargar el prompt maestro desde el almacenamiento: " +
          promptError.message
      );
    }
    const masterPrompt = await promptFile.text();
    logger.traceEvent(
      traceId,
      "Prompt maestro cargado desde Supabase Storage."
    );

    // 3. Ensamblaje del Prompt Final
    const finalPrompt = `${masterPrompt}\n\n--- INPUT DATA ---\n\n${JSON.stringify(validation.data, null, 2)}`;
    const modelToUse =
      Deno.env.get("AURA_INSIGHTS_MODEL") || "gemini-1.5-flash";
    logger.info(`[Edge Function] Usando modelo de IA: ${modelToUse}`, {
      traceId,
    });

    // 4. Invocación del Motor de IA (TEMEO)
    //    Esta sección se reemplazaría con la llamada real a la API de Gemini.
    //    const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY"));
    //    const model = genAI.getGenerativeModel({ model: modelToUse });
    //    const result = await model.generateContent(finalPrompt);
    //    const aiResultText = result.response.text();

    // --- Lógica simulada para la respuesta de la IA ---
    const aiResultText = JSON.stringify({
      title: "Fuga Crítica de Clientes Móviles (Simulado)",
      description: `Se ha detectado una tasa de abandono del 85% en los primeros 10 segundos para usuarios en el segmento: ${raw_data.cohort?.device_type || "desconocido"}.`,
      severity: "critical",
      recommendation:
        "Auditar de inmediato los Tiempos de Carga (LCP) y la usabilidad de la sección 'Hero' en móviles para la campaña afectada.",
    });
    // --- Fin de la lógica simulada ---

    logger.traceEvent(traceId, "Respuesta de la IA recibida.");

    // 5. Validación de la Respuesta de la IA
    const aiResponseValidation = AIInsightResponseSchema.safeParse(
      JSON.parse(aiResultText)
    );
    if (!aiResponseValidation.success) {
      throw new Error(
        "La respuesta de la IA tiene un formato inválido: " +
          aiResponseValidation.error.message
      );
    }
    logger.traceEvent(traceId, "Respuesta de la IA validada con éxito.");

    // 6. Persistencia del Insight en la Base de Datos
    const { error: insertError } = await supabaseAdmin
      .from("aura_insights")
      .insert({
        workspace_id,
        ...aiResponseValidation.data,
        related_data: raw_data, // Persiste el contexto original para trazabilidad.
      });

    if (insertError) {
      throw new Error(
        "Fallo al persistir el insight en la base de datos: " +
          insertError.message
      );
    }
    logger.info(
      "[Edge Function] Insight de IA generado y persistido con éxito.",
      { traceId }
    );

    // 7. Retorno de Éxito
    return new Response(
      JSON.stringify({
        success: true,
        message: "Insight generado y guardado.",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    // Guardián de Resiliencia Holístico
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error desconocido en Edge Function.";
    logger.error(
      "[Edge Function] Fallo crítico en el pipeline de generación de insight.",
      { error: errorMessage, traceId }
    );

    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
});
