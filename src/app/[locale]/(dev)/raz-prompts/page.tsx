// RUTA: src/app/[locale]/(dev)/raz-prompts/page.tsx
/**
 * @file page.tsx
 * @description Página principal de élite para la Bóveda de RaZPrompts.
 *              v14.0.0 (Architectural Integrity & Resilience Guardian): Refactorizada
 *              para una integridad arquitectónica y un guardián de resiliencia de élite.
 * @version 14.0.0
 *@author RaZ Podestá - MetaShark Tech
 */
import React from "react";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Container,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/";
import { SectionAnimator } from "@/components/layout/SectionAnimator";
import { PromptCreator, PromptVault } from "@/components/features/raz-prompts";

interface RaZPromptsHomePageProps {
  params: { locale: Locale };
}

export default async function RaZPromptsHomePage({
  params: { locale },
}: RaZPromptsHomePageProps) {
  const traceId = logger.startTrace("RaZPromptsHomePage_Render_v14.0");
  logger.startGroup(
    `[RaZPrompts Shell] Renderizando v14.0 para locale: ${locale}`
  );

  try {
    const { dictionary, error: dictError } = await getDictionary(locale);
    logger.traceEvent(traceId, "Diccionario i18n cargado.", {
      hasError: !!dictError,
    });

    const {
      razPromptsHomePage: pageContent,
      promptCreator: promptCreatorContent,
      promptVault: promptVaultContent,
    } = dictionary;

    // --- [INICIO DE GUARDIÁN DE RESILIENCIA MEJORADO] ---
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

      // Este error ahora es mucho más informativo.
      throw new Error(
        `Faltan una o más claves de i18n esenciales. Claves ausentes: ${missingKeys}`
      );
    }
    // --- [FIN DE GUARDIÁN DE RESILIENCIA MEJORADO] ---

    logger.traceEvent(traceId, "Contenido i18n validado. Renderizando UI...");

    return (
      <SectionAnimator>
        <PageHeader content={pageContent} />
        <Container className="py-12">
          <Tabs defaultValue="vault">
            <TabsList className="grid w-full grid-cols-2 md:w-[400px] mb-8">
              <TabsTrigger value="create">
                {pageContent.createPromptTab}
              </TabsTrigger>
              <TabsTrigger value="vault">
                {pageContent.viewVaultTab}
              </TabsTrigger>
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
        </Container>
      </SectionAnimator>
    );
  } catch (error) {
    const errorMessage =
      "Fallo crítico durante el renderizado de la página RaZPrompts.";
    logger.error(`[RaZPrompts Shell] ${errorMessage}`, { error, traceId });
    return (
      <DeveloperErrorDisplay
        context="RaZPromptsHomePage"
        errorMessage={errorMessage}
        errorDetails={error instanceof Error ? error : String(error)}
      />
    );
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
