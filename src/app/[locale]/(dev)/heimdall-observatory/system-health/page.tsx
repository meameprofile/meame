// RUTA: src/app/[locale]/(dev)/heimdall-observatory/system-health/page.tsx
/**
 * @file page.tsx
 * @description Página "Server Shell" soberana para el Sismógrafo de Salud del Sistema.
 *              Orquesta la obtención de datos y delega la presentación al cliente.
 * @version 2.0.0 (Client Core Integration)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import React from "react";

import { DeveloperErrorDisplay } from "@/components/features/dev-tools";
import { PageHeader } from "@/components/layout";
import { getTaskHealthSummariesAction } from "@/shared/lib/actions/telemetry/getTaskHealthSummaries.action";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import { type Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/telemetry/heimdall.emitter";

import { SystemHealthClient } from "./_components/SystemHealthClient";

export default async function SystemHealthPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const taskId = logger.startTask(
    {
      domain: "HEIMDALL_OBSERVATORY",
      entity: "SYSTEM_HEALTH_UI",
      action: "RENDER_SHELL",
    },
    `Render System Health Page Shell for locale: ${locale}`
  );
  let finalStatus: "SUCCESS" | "FAILURE" = "SUCCESS";

  try {
    logger.taskStep(taskId, "FETCH_DATA", "IN_PROGRESS");
    const [summariesResult, dictionaryResult] = await Promise.all([
      getTaskHealthSummariesAction(),
      getDictionary(locale),
    ]);
    logger.taskStep(taskId, "FETCH_DATA", "SUCCESS");

    logger.taskStep(taskId, "VALIDATE_DATA", "IN_PROGRESS");
    const { dictionary, error: dictError } = dictionaryResult;
    const content = dictionary.heimdallObservatory;

    if (dictError || !content) {
      throw new Error(
        "Contenido i18n para el Observatorio no encontrado o inválido."
      );
    }

    if (!summariesResult.success) {
      throw new Error(summariesResult.error);
    }
    logger.taskStep(taskId, "VALIDATE_DATA", "SUCCESS");

    logger.taskStep(taskId, "DELEGATE_TO_CLIENT", "IN_PROGRESS");
    // [ENSAMBLAJE FINAL] Se instancia el Client Core con los datos obtenidos.
    const clientComponent = (
      <div className="p-4 sm:p-6 lg:p-8">
        <SystemHealthClient initialData={summariesResult.data} />
      </div>
    );
    logger.taskStep(taskId, "DELEGATE_TO_CLIENT", "SUCCESS");

    return (
      <>
        <PageHeader
          content={{
            title: "Sismógrafo de Salud del Sistema",
            subtitle:
              "Monitor en tiempo real de las tareas críticas del ecosistema.",
          }}
        />
        {clientComponent}
      </>
    );
  } catch (error) {
    finalStatus = "FAILURE";
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[SystemHealthPage Shell] Fallo crítico al ensamblar.", {
      error: errorMessage,
      taskId,
    });
    return (
      <>
        <PageHeader
          content={{
            title: "Sismógrafo de Salud del Sistema",
            subtitle:
              "Monitor en tiempo real de las tareas críticas del ecosistema.",
          }}
        />
        <DeveloperErrorDisplay
          context="SystemHealthPage Shell"
          errorMessage="No se pudieron cargar los datos de salud del sistema."
          errorDetails={error instanceof Error ? error : errorMessage}
        />
      </>
    );
  } finally {
    logger.endTask(taskId, finalStatus);
  }
}
