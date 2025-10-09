// RUTA: src/app/[locale]/(public)/page.tsx
/**
 * @file page.tsx
 * @description Homepage del portal, actuando como un "Ensamblador de Servidor"
 *              de élite. No requiere modificaciones.
 * @version 16.1.0 (Logger v20+ Contract Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import React from "react";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { SectionAnimator } from "@/components/layout/SectionAnimator";
import { SocialProofLogos } from "@/components/sections/SocialProofLogos";
import { CommunitySection } from "@/components/sections/CommunitySection";
import { ScrollingBanner } from "@/components/sections/ScrollingBanner";
import { HomePageClient } from "../HomePageClient";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

interface HomePageProps {
  params: { locale: Locale };
}

export default async function HomePage({ params: { locale } }: HomePageProps) {
  const traceId = logger.startTrace("HomePage_Render_v16.1");
  const groupId = logger.startGroup(
    `[HomePage Shell] Renderizando v16.1 para locale: ${locale}`
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

    const fullDictionary = dictionary as Dictionary;
    logger.success(
      "[HomePage Shell] Datos obtenidos. Delegando a HomePageClient...",
      { traceId }
    );

    return (
      <SectionAnimator>
        <ScrollingBanner content={scrollingBanner} locale={locale} />
        <SocialProofLogos content={socialProofLogos} locale={locale} />
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
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
