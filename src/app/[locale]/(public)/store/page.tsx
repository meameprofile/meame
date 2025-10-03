// RUTA: src/app/[locale]/store/page.tsx
/**
 * @file page.tsx
 * @description Página de la Tienda (Server Shell). Obtiene los datos
 *              iniciales y los delega al componente de cliente interactivo.
 * @version 3.0.0 (Definitive Build Fix)
 * @author RaZ Podestá - MetaShark Tech
 */
import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StoreClient } from "@/components/features/commerce/StoreClient";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import { getProducts } from "@/shared/lib/commerce";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/";
import { notFound } from "next/navigation";
import { SectionAnimator } from "@/components/layout/SectionAnimator";

interface StorePageProps {
  params: { locale: Locale };
}

export default async function StorePage({
  params: { locale },
}: StorePageProps): Promise<React.ReactElement> {
  logger.info(
    `[StorePage Shell] Obteniendo datos de servidor para locale: ${locale} (v3.0)`
  );

  // 1. Obtención de Datos en Paralelo en el Servidor.
  const [{ dictionary, error: dictError }, initialProducts] = await Promise.all(
    [getDictionary(locale), getProducts({ locale })]
  );

  const { storePage, faqAccordion, communitySection } = dictionary;

  // 2. Guardia de Resiliencia: Si falta contenido esencial, falla de forma controlada.
  if (dictError || !storePage) {
    const errorMessage =
      "Fallo al cargar el contenido i18n esencial para la Tienda.";
    logger.error(`[StorePage Shell] ${errorMessage}`, { error: dictError });

    if (process.env.NODE_ENV === "production") {
      return notFound();
    }
    return (
      <DeveloperErrorDisplay
        context="StorePage Shell"
        errorMessage={errorMessage}
        errorDetails={
          dictError || "La clave 'storePage' falta en el diccionario."
        }
      />
    );
  }

  // 3. Renderizado del Shell y Delegación al Cliente.
  //    Se pasan todos los datos necesarios como props al componente de cliente.
  return (
    <SectionAnimator>
      <PageHeader content={storePage} />
      <StoreClient
        initialProducts={initialProducts}
        content={{
          storePage,
          faqAccordion,
          communitySection,
        }}
        locale={locale}
      />
    </SectionAnimator>
  );
}
