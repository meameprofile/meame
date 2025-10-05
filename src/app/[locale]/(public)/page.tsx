// RUTA (SIN CAMBIOS): src/app/[locale]/(public)/page.tsx
/**
 * @file page.tsx
 * @description Homepage del portal, actuando como un "Ensamblador de Servidor"
 *              de élite. No requiere modificaciones.
 * @version 16.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import React from "react";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/";
import { SectionAnimator } from "@/components/layout/SectionAnimator";
import { SocialProofLogos } from "@/components/sections/SocialProofLogos";
import { CommunitySection } from "@/components/sections/CommunitySection";
import { ScrollingBanner } from "@/components/sections/ScrollingBanner";
import { getPublishedArticlesAction } from "@/shared/lib/actions/cogniread";
import { HomePageClient } from "../HomePageClient";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

interface HomePageProps {
  params: { locale: Locale };
}

export default async function HomePage({ params: { locale } }: HomePageProps) {
  const traceId = logger.startTrace("HomePage_Render_v16.0");
  logger.startGroup(
    `[HomePage Shell] Renderizando v16.0 para locale: ${locale}`
  );

  try {
    const { dictionary, error: dictError } = await getDictionary(locale);
    const {
      socialProofLogos,
      communitySection,
      scrollingBanner,
      heroNews,
      newsGrid,
    } = dictionary;

    // --- GUARDIÁN DE RESILIENCIA DE CONTRATO ---
    if (
      dictError ||
      !socialProofLogos ||
      !communitySection ||
      !scrollingBanner ||
      !heroNews ||
      !newsGrid
    ) {
      const missingKeys = [
        !socialProofLogos && "socialProofLogos",
        !communitySection && "communitySection",
        !scrollingBanner && "scrollingBanner",
        !heroNews && "heroNews",
        !newsGrid && "newsGrid",
      ]
        .filter(Boolean)
        .join(", ");

      throw new Error(
        `Faltan una o más claves de i18n esenciales. Claves ausentes: ${missingKeys}`
      );
    }

    // El servidor pre-carga los artículos para el primer renderizado (SSR).
    const articlesResult = await getPublishedArticlesAction({
      page: 1,
      limit: 4,
    });
    if (!articlesResult.success && process.env.NODE_ENV === "development") {
      return (
        <DeveloperErrorDisplay
          context="HomePage Data Fetching"
          errorMessage="Fallo al obtener artículos publicados."
          errorDetails={articlesResult.error}
        />
      );
    }

    const fullDictionary = dictionary as Dictionary;
    logger.success(
      "[HomePage Shell] Datos obtenidos. Delegando a HomePageClient...",
      { traceId }
    );

    return (
      <SectionAnimator>
        <ScrollingBanner content={scrollingBanner} locale={locale} />
        <SocialProofLogos content={socialProofLogos} locale={locale} />
        {/* HomePageClient gestionará la caché y la UI de noticias */}
        <HomePageClient locale={locale} dictionary={fullDictionary} />
        <CommunitySection content={communitySection} locale={locale} />
      </SectionAnimator>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(`[HomePage Shell] ${errorMessage}`, { error: error, traceId });
    return (
      <DeveloperErrorDisplay
        context="HomePage Server Shell"
        errorMessage="Fallo crítico al renderizar el Server Shell del Homepage."
        errorDetails={error instanceof Error ? error : errorMessage}
      />
    );
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
