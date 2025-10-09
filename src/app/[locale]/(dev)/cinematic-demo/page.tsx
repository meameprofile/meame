// RUTA: src/app/[locale]/(dev)/cinematic-demo/page.tsx
/**
 * @file page.tsx
 * @description Página "Sandbox" de élite para el motor "Aether", nivelada para
 *              restaurar la integridad del contrato de datos i18n y con
 *              observabilidad hiper-granular inyectada.
 * @version 8.0.0 (Client-Server Boundary Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server-only";
import React from "react";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { Container } from "@/components/ui";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";

// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA v8.0.0] ---
// Se utiliza `next/dynamic` con `ssr: false` para crear un límite explícito
// entre el Servidor y el Cliente. Esto asegura que el componente <Aether /> y
// sus dependencias (que usan APIs de navegador como WebGL) NUNCA se ejecuten
// durante el renderizado en el servidor (SSR/SSG), resolviendo la causa raíz
// de los errores de hidratación y build.
const Aether = dynamic(
  () => import("@/components/features/aether/Aether").then((mod) => mod.Aether),
  {
    ssr: false, // ¡Solución Definitiva!
    loading: () => <Skeleton className="w-full aspect-video rounded-lg" />, // MEA/UX
  }
);
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA] ---

interface CinematicDemoPageProps {
  params: { locale: Locale };
}

export default async function CinematicDemoPage({
  params: { locale },
}: CinematicDemoPageProps) {
  const traceId = logger.startTrace("CinematicDemoPage_Shell_v8.0");
  const groupId = logger.startGroup(
    `[CinematicDemo Shell] Ensamblando para [${locale}]...`
  );

  try {
    logger.traceEvent(traceId, "Paso 1/3: Obteniendo diccionario...");
    const { dictionary, error } = await getDictionary(locale);

    logger.traceEvent(
      traceId,
      "Paso 2/3: Validando contratos de contenido requeridos..."
    );
    const pageContent = dictionary.cinematicDemoPage;
    const aetherControlsContent = dictionary.aetherControls;

    if (error || !pageContent || !aetherControlsContent) {
      const missingKeys = [
        !pageContent && "cinematicDemoPage",
        !aetherControlsContent && "aetherControls",
      ]
        .filter(Boolean)
        .join(", ");
      throw new Error(
        `Fallo al cargar contenido i18n. Claves ausentes: ${missingKeys}`,
        { cause: error }
      );
    }
    logger.success(
      "[CinematicDemo Shell] Contenido i18n completo y validado.",
      { traceId }
    );

    logger.traceEvent(traceId, "Paso 3/3: Datos listos. Renderizando UI...");
    return (
      <>
        <PageHeader
          content={pageContent.pageHeader}
          titleClassName="text-3xl sm:text-4xl"
          subtitleClassName="text-md"
        />
        <Container className="py-16 min-h-screen">
          <Aether
            src="/videos/cinematic-placeholder.mp4"
            audioSrc="/audio/cinematic-ambient.mp3"
            content={aetherControlsContent}
          />
        </Container>
      </>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[CinematicDemo Shell] Fallo crítico irrecuperable.", {
      error: errorMessage,
      cause: error instanceof Error ? error.cause : undefined,
      traceId,
    });
    if (process.env.NODE_ENV === "production") return notFound();
    return (
      <DeveloperErrorDisplay
        context="CinematicDemoPage (Server Shell)"
        errorMessage={errorMessage}
        errorDetails={error instanceof Error ? error : errorMessage}
      />
    );
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
