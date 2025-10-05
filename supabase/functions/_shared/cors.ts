// APARATO 2/4: UTILIDAD COMPARTIDA DE CORS (NIVELADA)
// RUTA: supabase/functions/_shared/cors.ts

/**
 * @file cors.ts
 * @description SSoT para las cabeceras CORS de las Edge Functions.
 * @version 2.0.0 (Holistic & Self-Contained)
 * @author RaZ Podestá - MetaShark Tech
 */

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};
