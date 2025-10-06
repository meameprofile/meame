// RUTA: src/app/[locale]/(dev)/raz-prompts/page.tsx
/**
 * @file page.tsx
 * @description Página de RaZPrompts, nivelada con observabilidad hiper-granular
 *              y resiliencia de contrato de élite.
 * @version 16.0.0 (Holistic Observability & Contract Integrity)
 * @author L.I.A. Legacy
 */
import React from "react";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { PromptCreator, PromptVault } from "@/components/features/raz-prompts";

interface RaZPromptsHomePageProps {
  params: { locale: Locale };
}

export default async function RaZPromptsHomePage({
  params: { locale },
}: RaZPromptsHomePageProps) {
  const traceId = logger.startTrace("RaZPromptsHomePage_Render_v16.0");
  // --- [INICIO DE CORRECCIÓN DE CONTRATO v16.0.0] ---
  const groupId = logger.startGroup(
    `[RaZPrompts Shell] Renderizando panel de contenido v16.0 para locale: ${locale}`
  );
  // --- [FIN DE CORRECCIÓN DE CONTRATO v16.0.0] ---

  try {
    logger.traceEvent(traceId, "Iniciando obtención de diccionario i18n...");
    const { dictionary, error: dictError } = await getDictionary(locale);
    logger.traceEvent(traceId, "Obtención de diccionario completada.");

    // Se extrae y valida el contenido necesario.
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
    logger.traceEvent(traceId, "Contenido i18n validado. Renderizando UI...");

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
    // --- [INICIO DE CORRECCIÓN DE CONTRATO v16.0.0] ---
    logger.endGroup(groupId);
    logger.endTrace(traceId);
    // --- [FIN DE CORRECCIÓN DE CONTRATO v16.0.0] ---
  }
}
