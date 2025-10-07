// RUTA: src/app/[locale]/(dev)/heimdall-observatory/page.tsx
/**
 * @file page.tsx
 * @description Página "Server Shell" soberana para el Observatorio Heimdall.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server-only";
import React from "react";
import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { HeimdallObservatoryClient } from "./_components/HeimdallObservatoryClient";
import type { HeimdallEventRow } from "@/shared/lib/telemetry/heimdall.contracts";

export default async function HeimdallObservatoryPage() {
  const traceId = logger.startTrace("HeimdallObservatoryPage_Shell");
  const groupId = logger.startGroup(
    "[Heimdall Shell] Ensamblando datos iniciales..."
  );

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("heimdall_events")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(100);

    if (error) throw error;

    // Aquí iría la carga del i18n para la página.

    return (
      <HeimdallObservatoryClient initialEvents={data as HeimdallEventRow[]} />
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Heimdall Shell] Fallo crítico.", { error: msg, traceId });
    return (
      <DeveloperErrorDisplay
        context="HeimdallObservatoryPage Shell"
        errorMessage="No se pudieron cargar los eventos."
        errorDetails={msg}
      />
    );
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
