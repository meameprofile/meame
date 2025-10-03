// RUTA: src/app/[locale]/(dev)/bavi/page.tsx
/**
 * @file page.tsx
 * @description Página principal de la Central de Operaciones BAVI.
 * @version 4.0.0 (Architectural Integrity Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
import React from "react";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui";
import { AssetUploader } from "@/components/features/bavi/components/AssetUploader";
import { logger } from "@/shared/lib/logging";

export default async function BaviHomePage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  logger.info(
    "[BaviHomePage] Renderizando la página principal de la BAVI (v4.0)."
  );
  const { dictionary } = await getDictionary(locale);
  const pageContent = dictionary.baviHomePage;
  const uploaderContent = dictionary.baviUploader;
  const promptCreatorContent = dictionary.promptCreator;

  if (!uploaderContent || !promptCreatorContent || !pageContent) {
    return <div>Error: Contenido de la página BAVI no encontrado.</div>;
  }

  return (
    <>
      <PageHeader
        content={{
          title: pageContent.title,
          subtitle: pageContent.subtitle,
        }}
      />
      <Container className="py-12 space-y-12">
        <Card>
          <CardHeader>
            <CardTitle>{pageContent.ingestCardTitle}</CardTitle>
            <CardDescription>
              {pageContent.ingestCardDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AssetUploader
              content={uploaderContent}
              sesaLabels={promptCreatorContent.sesaLabels}
              sesaOptions={promptCreatorContent.sesaOptions}
            />
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-muted-foreground">
              {pageContent.aiBoilerCardTitle}
            </CardTitle>
            <CardDescription>
              {pageContent.aiBoilerCardDescription}
            </CardDescription>
          </CardHeader>
        </Card>
      </Container>
    </>
  );
}
