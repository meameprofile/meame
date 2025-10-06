// RUTA: src/app/[locale]/(dev)/cinematic-demo/page.tsx
/**
 * @file page.tsx
 * @description Página "Sandbox" de élite para el motor "Aether".
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
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

const CinematicRenderer = dynamic(
  () =>
    import("@/components/media/CinematicRenderer").then(
      (mod) => mod.CinematicRenderer
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full aspect-video rounded-lg" />,
  }
);

interface CinematicDemoPageProps {
  params: { locale: Locale };
}

export default async function CinematicDemoPage({
  params: { locale },
}: CinematicDemoPageProps) {
  logger.info(
    `[CinematicDemoPage] Renderizando (Server Component v3.0) para locale: ${locale}`
  );

  const { dictionary, error } = await getDictionary(locale);
  const content = dictionary.cinematicDemoPage;

  if (error || !content) {
    const errorMessage =
      "Fallo al cargar el contenido i18n para la página de demostración de Aether.";
    logger.error(`[CinematicDemoPage] ${errorMessage}`, { error });

    if (process.env.NODE_ENV === "production") {
      return notFound();
    }
    return (
      <DeveloperErrorDisplay
        context="CinematicDemoPage"
        errorMessage={errorMessage}
        errorDetails={
          error || "La clave 'cinematicDemoPage' falta en el diccionario."
        }
      />
    );
  }

  return (
    <>
      <PageHeader content={content.pageHeader} />
      <Container className="py-12">
        <CinematicRenderer
          src="/videos/cinematic-placeholder.mp4"
          audioSrc="/audio/cinematic-ambient.mp3"
        />
      </Container>
    </>
  );
}
