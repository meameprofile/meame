// RUTA: src/app/[locale]/(dev)/heimdall-observatory/page.tsx
/**
 * @file page.tsx
 * @description Página "Server Shell" soberana para el Observatorio Heimdall,
 *              forjada con un Guardián de Resiliencia y auto-instrumentación.
 * @version 2.0.0 (Resilient & Self-Observable)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server-only";

import React from "react";

import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { PageHeader } from "@/components/layout";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import { type Locale } from "@/shared/lib/i18n/i18n.config";
import { HeimdallObservatoryContentSchema } from "@/shared/lib/schemas/pages/dev/heimdall-observatory.i18n.schema";
import { createServerClient } from "@/shared/lib/supabase/server";
import type { HeimdallEventRow } from "@/shared/lib/telemetry/heimdall.contracts";
import { logger } from "@/shared/lib/telemetry/heimdall.emitter";

import { HeimdallObservatoryClient } from "./_components/HeimdallObservatoryClient";

export default async function HeimdallObservatoryPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const taskId = logger.startTask(
    { domain: "HEIMDALL_OBSERVATORY", entity: "UI_SHELL", action: "RENDER" },
    `Render Heimdall Page Shell for locale: ${locale}`
  );
  let finalStatus: "SUCCESS" | "FAILURE" = "SUCCESS";

  try {
    logger.taskStep(taskId, "FETCH_DATA", "IN_PROGRESS");
    const supabase = createServerClient();
    const [dictionaryResult, eventsResult] = await Promise.all([
      getDictionary(locale),
      supabase
        .from("heimdall_events")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(100),
    ]);
    const { dictionary, error: dictError } = dictionaryResult;
    const { data: eventsData, error: eventsError } = eventsResult;
    logger.taskStep(taskId, "FETCH_DATA", "SUCCESS", {
      eventCount: eventsData?.length || 0,
    });

    logger.taskStep(taskId, "VALIDATE_CONTRACTS", "IN_PROGRESS");
    if (eventsError) throw eventsError;

    const contentValidation = HeimdallObservatoryContentSchema.safeParse(
      dictionary.heimdallObservatory
    );
    if (dictError || !contentValidation.success) {
      const errorDetail = dictError || contentValidation.error;
      logger.taskStep(taskId, "VALIDATE_CONTRACTS", "FAILURE", {
        error: errorDetail,
      });
      throw new Error(
        "Contenido i18n para el Observatorio no encontrado o inválido.",
        { cause: errorDetail }
      );
    }
    const content = contentValidation.data;
    logger.taskStep(taskId, "VALIDATE_CONTRACTS", "SUCCESS");

    logger.taskStep(taskId, "DELEGATE_TO_CLIENT", "IN_PROGRESS");
    const clientComponent = (
      <div className="p-4 sm:p-6 lg:p-8">
        <HeimdallObservatoryClient
          initialEvents={eventsData as HeimdallEventRow[]}
          content={content}
        />
      </div>
    );
    logger.taskStep(taskId, "DELEGATE_TO_CLIENT", "SUCCESS");

    return (
      <>
        <PageHeader content={content.pageHeader} />
        {clientComponent}
      </>
    );
  } catch (error) {
    finalStatus = "FAILURE";
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Heimdall Shell] Fallo crítico al ensamblar.", {
      error: errorMessage,
      taskId,
    });
    return (
      <DeveloperErrorDisplay
        context="HeimdallObservatoryPage Shell"
        errorMessage="No se pudieron cargar los recursos para el Observatorio."
        errorDetails={error instanceof Error ? error : errorMessage}
      />
    );
  } finally {
    logger.endTask(taskId, finalStatus);
  }
}
