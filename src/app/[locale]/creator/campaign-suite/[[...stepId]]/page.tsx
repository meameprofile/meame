// RUTA: src/app/[locale]/creator/campaign-suite/[[...stepId]]/page.tsx
/**
 * @file page.tsx
 * @description Página de renderizado de pasos para la SDC, ahora como punto de
 *              entrada soberano y resiliente.
 * @version 1.0.0 (Sovereign & Elite)
 * @author L.I.A. Legacy
 */
import "server-only";
import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { logger } from "@/shared/lib/logging";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { StepClientWrapper } from "@/components/features/campaign-suite/_components";
import { stepsDataConfig } from "@/shared/lib/config/campaign-suite/wizard.data.config";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/";

interface StepPageProps {
  params: { locale: Locale; stepId?: string[] };
}

export default async function StepPage({
  params: { locale, stepId },
}: StepPageProps) {
  const traceId = logger.startTrace("SDC_StepPage_Shell_v1.0");

  const currentStepId = parseInt(stepId?.[0] || "0", 10);
  const stepConfig = stepsDataConfig.find((s) => s.id === currentStepId);

  logger.startGroup(
    `[SDC Step Shell] Renderizando paso ${currentStepId} para [${locale}]...`
  );

  try {
    if (!stepConfig) {
      logger.error(
        `[Guardián] Configuración no encontrada para el paso ${currentStepId}.`,
        { traceId }
      );
      return notFound();
    }
    logger.traceEvent(
      traceId,
      `Configuración encontrada para el paso: ${stepConfig.titleKey}`
    );

    const { dictionary, error } = await getDictionary(locale);
    const stepContent = dictionary[stepConfig.i18nKey];

    if (error || !stepContent) {
      throw new Error(
        `No se pudo cargar o validar el contenido para el paso ${currentStepId} (clave: ${stepConfig.i18nKey}).`
      );
    }
    logger.traceEvent(
      traceId,
      `Contenido i18n para el paso ${currentStepId} validado.`
    );

    return (
      <Suspense fallback={<div>Cargando paso del asistente...</div>}>
        <StepClientWrapper stepContent={stepContent} />
      </Suspense>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(`[SDC Step Shell] Fallo crítico al renderizar el paso.`, {
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
