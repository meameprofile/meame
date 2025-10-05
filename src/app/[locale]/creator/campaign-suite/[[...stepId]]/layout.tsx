// RUTA: src/app/[locale]/creator/campaign-suite/[[...stepId]]/layout.tsx
/**
 * @file layout.tsx
 * @description Layout Orquestador y "Server Shell" de élite para la SDC,
 *              con una arquitectura de composición Cliente-Servidor soberana.
 * @version 2.0.0 (Server Shell Pattern & Elite Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import React from "react";
import { notFound } from "next/navigation";
import { CampaignSuiteWizard } from "@/components/features/campaign-suite";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import { type Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/";
import { loadAllThemeFragmentsAction } from "@/shared/lib/actions/campaign-suite";
import { getBaviManifest } from "@/shared/lib/bavi";
import { i18nSchema } from "@/shared/lib/schemas/i18n.schema";

interface WizardLayoutProps {
  children: React.ReactNode;
  params: { locale: Locale };
}

export default async function WizardLayout({
  children,
  params: { locale },
}: WizardLayoutProps) {
  const traceId = logger.startTrace("SDC_SovereignLayout_v2.0");
  logger.startGroup(`[SDC Layout Shell] Ensamblando datos para [${locale}]...`);

  try {
    const [dictionaryResult, fragmentsResult, baviManifestResult] =
      await Promise.all([
        getDictionary(locale),
        loadAllThemeFragmentsAction(),
        getBaviManifest(),
      ]);

    const { dictionary: partialDictionary, error: dictError } =
      dictionaryResult;
    const validation = i18nSchema.safeParse(partialDictionary);

    if (dictError || !validation.success) {
      throw new Error(
        "Fallo al cargar o validar el diccionario i18n principal.",
        { cause: dictError || validation.error }
      );
    }

    const dictionary = validation.data;
    const pageContent = dictionary.campaignSuitePage;

    if (!pageContent) {
      throw new Error(
        "Guardián de Contrato: Falta la clave 'campaignSuitePage' en el diccionario."
      );
    }
    if (!fragmentsResult.success) {
      throw new Error(
        `Fallo al cargar los fragmentos de tema: ${fragmentsResult.error}`
      );
    }
    if (!baviManifestResult) {
      throw new Error("Fallo al cargar el manifiesto BAVI.");
    }

    return (
      <CampaignSuiteWizard
        content={pageContent}
        loadedFragments={fragmentsResult.data}
        baviManifest={baviManifestResult}
        dictionary={dictionary}
      >
        {children}
      </CampaignSuiteWizard>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[SDC Layout Shell] Fallo crítico en la obtención de datos.", {
      error: errorMessage,
      cause: error instanceof Error ? error.cause : undefined,
      traceId,
    });
    if (process.env.NODE_ENV === "production") return notFound();
    return (
      <DeveloperErrorDisplay
        context="WizardLayout (Shell de Datos)"
        errorMessage={errorMessage}
        errorDetails={error instanceof Error ? error : undefined}
      />
    );
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
