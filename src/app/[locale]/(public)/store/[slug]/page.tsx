// RUTA: src/app/[locale]/(public)/store/page.tsx
/**
 * @file page.tsx
 * @description Página de la Tienda ("Server Shell"), forjada con resiliencia de
 *              élite, observabilidad holística y una arquitectura de datos soberana.
 * @version 4.0.0 (Holistic Elite Leveling)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import React from "react";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { StoreClient } from "@/components/features/commerce/StoreClient";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import { getProducts } from "@/shared/lib/commerce";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { SectionAnimator } from "@/components/layout/SectionAnimator";

interface StorePageProps {
  params: { locale: Locale };
}

export default async function StorePage({
  params: { locale },
}: StorePageProps): Promise<React.ReactElement> {
  const traceId = logger.startTrace("StorePage_Shell_Render_v4.0");
  logger.startGroup(
    `[StorePage Shell] Ensamblando datos para [${locale}]...`,
    traceId
  );

  try {
    logger.traceEvent(
      traceId,
      "Iniciando obtención de datos en paralelo (Diccionario y Productos)..."
    );
    const [{ dictionary, error: dictError }, initialProducts] =
      await Promise.all([getDictionary(locale), getProducts({ locale })]);
    logger.traceEvent(traceId, "Obtención de datos completada.");

    const { storePage, faqAccordion, communitySection } = dictionary;

    // --- [INICIO] GUARDIÁN DE RESILIENCIA DE CONTRATO ---
    if (dictError || !storePage || !faqAccordion || !communitySection) {
      const missingKeys = [
        !storePage && "storePage",
        !faqAccordion && "faqAccordion",
        !communitySection && "communitySection",
      ]
        .filter(Boolean)
        .join(", ");
      throw new Error(
        `Faltan claves de i18n esenciales. Claves ausentes: ${missingKeys}`
      );
    }
    logger.traceEvent(traceId, "Contenido i18n validado.");
    // --- [FIN] GUARDIÁN DE RESILIENCIA DE CONTRATO ---

    logger.success(
      "[StorePage Shell] Datos obtenidos y validados. Delegando al cliente...",
      { traceId }
    );

    return (
      <SectionAnimator>
        <PageHeader content={storePage} />
        <StoreClient
          initialProducts={initialProducts}
          content={{ storePage, faqAccordion, communitySection }}
          locale={locale}
        />
      </SectionAnimator>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Guardián] Fallo crítico irrecuperable en StorePage Shell.", {
      error: errorMessage,
      traceId,
    });
    if (process.env.NODE_ENV === "production") return notFound();
    return (
      <DeveloperErrorDisplay
        context="StorePage Server Shell"
        errorMessage="No se pudieron cargar los datos de la tienda."
        errorDetails={error instanceof Error ? error : errorMessage}
      />
    );
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
