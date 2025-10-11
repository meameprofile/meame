// RUTA: src/app/[locale]/(public)/page.tsx
/**
 * @file page.tsx
 * @description Homepage del portal, actuando como un "Ensamblador de Servidor"
 *              de élite, ahora con instrumentación de Tareas de Heimdall para
 *              el Sismógrafo de Salud del Ecosistema.
 * @version 29.0.0 (Semantic Telemetry Instrumentation)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";

import React from "react";

import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { SectionAnimator } from "@/components/layout/SectionAnimator";
import { CommunitySection } from "@/components/sections/CommunitySection";
import { ScrollingBanner } from "@/components/sections/ScrollingBanner";
import { SocialProofLogos } from "@/components/sections/SocialProofLogos";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import { logger } from "@/shared/lib/telemetry/heimdall.emitter";

import { HomePageClient } from "../HomePageClient";

interface HomePageProps {
  params: { locale: Locale };
}

export default async function HomePage({ params: { locale } }: HomePageProps) {
  const taskId = logger.startTask(
    { domain: "HOMEPAGE_RENDER", entity: "PAGE_SHELL", action: "EXECUTION" },
    `Render HomePage Shell for locale: ${locale}`
  );
  let finalStatus: "SUCCESS" | "FAILURE" = "SUCCESS";

  try {
    // --- PASO 1: OBTENER DICCIONARIO ---
    logger.taskStep(taskId, "GET_DICTIONARY", "IN_PROGRESS");
    const { dictionary, error: dictError } = await getDictionary(locale);
    if (dictError) {
      logger.taskStep(taskId, "GET_DICTIONARY", "FAILURE", {
        error: dictError.message,
      });
      throw new Error("Fallo al cargar el diccionario i18n.");
    }
    logger.taskStep(taskId, "GET_DICTIONARY", "SUCCESS");

    // --- PASO 2: VALIDAR CONTRATO DE CONTENIDO ---
    logger.taskStep(taskId, "VALIDATE_CONTENT", "IN_PROGRESS");
    const {
      socialProofLogos,
      communitySection,
      scrollingBanner,
      heroNews,
      newsGrid,
    } = dictionary;

    if (
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

      logger.taskStep(taskId, "VALIDATE_CONTENT", "FAILURE", { missingKeys });
      throw new Error(
        `Faltan claves de i18n esenciales. Claves ausentes: ${missingKeys}`
      );
    }
    logger.taskStep(taskId, "VALIDATE_CONTENT", "SUCCESS");

    // --- PASO 3: DELEGAR A CLIENTE Y RENDERIZAR ---
    logger.taskStep(taskId, "DELEGATE_TO_CLIENT", "IN_PROGRESS");
    const fullDictionary = dictionary as Dictionary;

    const renderedJsx = (
      <SectionAnimator>
        <ScrollingBanner
          content={fullDictionary.scrollingBanner!}
          locale={locale}
        />
        <SocialProofLogos
          content={fullDictionary.socialProofLogos!}
          locale={locale}
        />
        <HomePageClient locale={locale} dictionary={fullDictionary} />
        <CommunitySection
          content={fullDictionary.communitySection!}
          locale={locale}
        />
      </SectionAnimator>
    );
    logger.taskStep(taskId, "DELEGATE_TO_CLIENT", "SUCCESS");
    return renderedJsx;
  } catch (error) {
    finalStatus = "FAILURE";
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(`[HomePage Shell] Fallo crítico durante el renderizado.`, {
      error: errorMessage,
      taskId,
    });
    return (
      <DeveloperErrorDisplay
        context="HomePage Server Shell"
        errorMessage="Fallo crítico al renderizar el Server Shell del Homepage."
        errorDetails={error instanceof Error ? error : errorMessage}
      />
    );
  } finally {
    logger.endTask(taskId, finalStatus);
  }
}
