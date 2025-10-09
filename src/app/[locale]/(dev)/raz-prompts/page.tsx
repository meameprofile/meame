// RUTA: src/app/[locale]/(dev)/raz-prompts/page.tsx
/**
 * @file page.tsx
 * @description Página de RaZPrompts, nivelada con observabilidad hiper-granular
 *              y resiliencia de contrato de élite.
 * @version 17.0.0 (Holistic Observability & Contract Integrity)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import React from "react";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/telemetry/heimdall.emitter";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { PromptCreator, PromptVault } from "@/components/features/raz-prompts";

interface RaZPromptsHomePageProps {
  params: { locale: Locale };
}

export default async function RaZPromptsHomePage({
  params: { locale },
}: RaZPromptsHomePageProps) {
  const traceId = logger.startTrace("RaZPromptsHomePage_Render_v17.0");
  const groupId = logger.startGroup(
    `[RaZPrompts Shell] Renderizando panel de contenido v17.0 para locale: ${locale}`
  );

  try {
    // EVENTO DE TRAZA 1: Obtención de Datos
    logger.traceEvent(
      traceId,
      "Paso 1/3: Iniciando obtención de diccionario i18n..."
    );
    const { dictionary, error: dictError } = await getDictionary(locale);
    logger.traceEvent(
      traceId,
      "Paso 1/3 Completado: Obtención de diccionario finalizada."
    );

    // EVENTO DE TRAZA 2: Guardián de Contrato y Validación
    logger.traceEvent(traceId, "Paso 2/3: Validando contrato de datos i18n...");
    const {
      razPromptsHomePage: pageContent,
      promptCreator: promptCreatorContent,
      promptVault: promptVaultContent,
    } = dictionary;

    if (
      dictError ||
      !pageContent ||
      !promptCreatorContent ||
      !promptVaultContent
    ) {
      const missingKeys = [
        !pageContent && "razPromptsHomePage",
        !promptCreatorContent && "promptCreator",
        !promptVaultContent && "promptVault",
      ]
        .filter(Boolean)
        .join(", ");

      throw new Error(
        `Faltan una o más claves de i18n esenciales. Claves ausentes: ${missingKeys}`
      );
    }
    logger.traceEvent(traceId, "Paso 2/3 Completado: Contenido i18n validado.");

    // EVENTO DE TRAZA 3: Renderizado
    logger.traceEvent(
      traceId,
      "Paso 3/3: Ensamblaje de datos completado. Renderizando UI..."
    );
    return (
      <Tabs defaultValue="vault">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px] mb-8">
          <TabsTrigger value="create">
            {pageContent.createPromptTab}
          </TabsTrigger>
          <TabsTrigger value="vault">{pageContent.viewVaultTab}</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <PromptCreator content={promptCreatorContent} />
        </TabsContent>
        <TabsContent value="vault">
          <PromptVault
            content={promptCreatorContent}
            vaultContent={promptVaultContent}
          />
        </TabsContent>
      </Tabs>
    );
  } catch (error) {
    const errorMessage =
      "Fallo crítico durante el renderizado de la página RaZPrompts.";
    logger.error(`[RaZPrompts Shell] ${errorMessage}`, {
      error: error instanceof Error ? error : String(error),
      traceId,
    });
    return (
      <DeveloperErrorDisplay
        context="RaZPromptsHomePage"
        errorMessage={errorMessage}
        errorDetails={error instanceof Error ? error : String(error)}
      />
    );
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
