// RUTA: src/app/[locale]/creator/campaign-suite/[[...stepId]]/page.tsx
/**
 * @file page.tsx
 * @description Despachador de Pasos dinámico para la SDC. Renderiza el
 *              componente de paso correcto del lado del servidor.
 * @version 2.0.0 (Server-Side Dispatcher)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { logger } from "@/shared/lib/logging";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { stepsConfig } from "@/shared/lib/config/campaign-suite/wizard.config";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";

interface StepPageProps {
  params: { locale: Locale; stepId?: string[] };
}

export default async function StepPage({
  params: { locale, stepId },
}: StepPageProps) {
  const traceId = logger.startTrace("SDC_StepPage_v2.0");

  const currentStepId = parseInt(stepId?.[0] || "0", 10);
  const stepConfig = stepsConfig.find((s) => s.id === currentStepId);

  logger.startGroup(
    `[Step Page] Renderizando paso ${currentStepId} en el servidor...`
  );

  try {
    if (!stepConfig) {
      logger.error(
        `[Guardián] Configuración no encontrada para el paso ${currentStepId}.`,
        { traceId }
      );
      return notFound();
    }

    const { dictionary, error } = await getDictionary(locale);
    const stepContent = dictionary[stepConfig.i18nKey];

    if (error || !stepContent) {
      throw new Error(
        `No se pudo cargar el contenido para el paso ${currentStepId} (clave: ${stepConfig.i18nKey}).`
      );
    }

    const StepComponent = stepConfig.component;

    return (
      <Suspense fallback={<div>Cargando paso del asistente...</div>}>
        <StepComponent content={stepContent} />
      </Suspense>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(`[Step Page] Fallo crítico al renderizar el paso.`, {
      error: errorMessage,
      traceId,
    });
    return (
      <DeveloperErrorDisplay
        context={`SDC Step ${currentStepId} Page`}
        errorMessage={errorMessage}
        errorDetails={error instanceof Error ? error : undefined}
      />
    );
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
