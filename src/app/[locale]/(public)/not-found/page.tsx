// RUTA: app/[locale]/not-found/page.tsx
/**
 * @file page.tsx
 * @description Server Component "Shell" para la página 404. Su única
 *              responsabilidad es obtener los datos de i18n del servidor y
 *              pasarlos al componente de cliente para su renderizado.
 * @version 1.0.1
 * @author RaZ Podestá - MetaShark Tech
 */
import { notFound } from "next/navigation";
import React from "react";

import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";

import { NotFoundClient } from "./NotFoundClient";

interface NotFoundPageProps {
  params: { locale: Locale };
}

export default async function NotFoundPage({
  params: { locale },
}: NotFoundPageProps) {
  logger.info(
    `[NotFoundPage Shell] Obteniendo contenido para locale: ${locale}`
  );
  const { dictionary, error } = await getDictionary(locale);
  const content = dictionary.notFoundPage;

  if (error || !content) {
    const errorMessage =
      "Fallo al cargar el contenido i18n para la página 404.";
    logger.error(`[NotFoundPage Shell] ${errorMessage}`, { error });
    if (process.env.NODE_ENV === "production") {
      return notFound();
    }
    return (
      <DeveloperErrorDisplay
        context="NotFoundPage Shell"
        errorMessage={errorMessage}
        errorDetails={error}
      />
    );
  }
  return <NotFoundClient content={content} locale={locale} />;
}
