// app/[locale]/about/page.tsx
/**
 * @file page.tsx
 * @description Página "Sobre Nosotros", nivelada a un estándar de élite.
 * @version 4.0.0 (Holistic Elite Leveling & MEA)
 * @author RaZ Podestá - MetaShark Tech
 */
import { notFound } from "next/navigation";
import React from "react";

import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionAnimator } from "@/components/layout/SectionAnimator";
import { TextSection } from "@/components/sections/TextSection";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";

interface AboutPageProps {
  params: { locale: Locale };
}

export default async function AboutPage({
  params: { locale },
}: AboutPageProps) {
  logger.info(
    `[AboutPage] Renderizando v4.0 (Elite & MEA) para locale: ${locale}`
  );

  const { dictionary, error } = await getDictionary(locale);
  const content = dictionary.aboutPage;

  if (error || !content) {
    const errorMessage =
      "Fallo al cargar el contenido i18n para la página 'Sobre Nosotros'.";
    logger.error(`[AboutPage] ${errorMessage}`, { error });
    if (process.env.NODE_ENV === "production") return notFound();
    return (
      <DeveloperErrorDisplay
        context="AboutPage"
        errorMessage={errorMessage}
        errorDetails={error || "La clave 'aboutPage' falta en el diccionario."}
      />
    );
  }

  return (
    <SectionAnimator>
      <PageHeader
        content={{ title: content.title, subtitle: content.subtitle }}
      />
      <TextSection content={content.content} />
    </SectionAnimator>
  );
}
// app/[locale]/about/page.tsx
