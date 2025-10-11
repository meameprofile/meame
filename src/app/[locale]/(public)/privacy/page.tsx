// app/[locale]/privacy/page.tsx
/**
 * @file page.tsx
 * @description Página de Política de Privacidad, elevada a un estándar de élite.
 * @version 2.0.0 (Holistic Elite Compliance & MEA/UX)
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

interface PrivacyPageProps {
  params: { locale: Locale };
}

export default async function PrivacyPage({
  params: { locale },
}: PrivacyPageProps) {
  logger.info(
    `[PrivacyPage] Renderizando v2.0 (Elite Compliance) para locale: ${locale}`
  );

  const { dictionary, error } = await getDictionary(locale);
  const content = dictionary.privacyPage;

  if (error || !content) {
    const errorMessage =
      "Fallo al cargar el contenido i18n para la página de Política de Privacidad.";
    logger.error(`[PrivacyPage] ${errorMessage}`, { error });
    if (process.env.NODE_ENV === "production") return notFound();
    return (
      <DeveloperErrorDisplay
        context="PrivacyPage"
        errorMessage={errorMessage}
        errorDetails={
          error || "La clave 'privacyPage' falta en el diccionario."
        }
      />
    );
  }

  return (
    <SectionAnimator>
      <PageHeader content={content} />
      <TextSection content={content.content} />
    </SectionAnimator>
  );
}
// app/[locale]/privacy/page.tsx
