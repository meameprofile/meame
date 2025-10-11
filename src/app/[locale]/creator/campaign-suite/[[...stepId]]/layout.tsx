// RUTA: src/app/[locale]/creator/campaign-suite/[[...stepId]]/layout.tsx
/**
 * @file layout.tsx
 * @description Layout soberano de la SDC, con la nueva arquitectura inspirada en Canva.
 * @version 4.0.0 (Canva-Inspired Architecture)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server-only";

import { notFound } from "next/navigation";
import React from "react";

import { CampaignSuiteWizard } from "@/components/features/campaign-suite";
import { WizardSidebar } from "@/components/features/campaign-suite/_components/WizardSidebar";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { loadAllThemeFragmentsAction } from "@/shared/lib/actions/campaign-suite/getThemeFragments.action";
import { getBaviManifest } from "@/shared/lib/bavi";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import { type Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import { i18nSchema } from "@/shared/lib/schemas/i18n.schema";

interface WizardLayoutProps {
  children: React.ReactNode;
  params: { locale: Locale };
}

export default async function WizardLayout({
  children,
  params: { locale },
}: WizardLayoutProps) {
  const traceId = logger.startTrace("SDC_SovereignLayout_v4.0");
  const groupId = logger.startGroup(
    `[SDC Layout Shell] Ensamblando datos para [${locale}]...`
  );

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
      <div className="relative pl-20 bg-muted/20">
        <WizardSidebar />
        <main className="min-h-screen p-4 sm:p-6 lg:p-8">
          <CampaignSuiteWizard
            content={pageContent}
            loadedFragments={fragmentsResult.data}
            baviManifest={baviManifestResult}
            dictionary={dictionary}
          >
            {children}
          </CampaignSuiteWizard>
        </main>
      </div>
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
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
