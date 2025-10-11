// RUTA: src/app/[locale]/(dev)/cogniread/page.tsx
/**
 * @file page.tsx
 * @description Dashboard principal de CogniRead. UI proactiva para la
 *              gestión de conocimiento científico.
 * @version 9.2.0 (Routing Contract Restoration): Se corrige una violación de
 *              contrato de tipo al llamar a la ruta soberana 'cognireadEditor'.
 * @author L.I.A. Legacy
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

import { ArticleList } from "@/components/features/cogniread/_components";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  DynamicIcon,
  Skeleton,
} from "@/components/ui";
import { getAllArticlesAction } from "@/shared/lib/actions/cogniread";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import { routes } from "@/shared/lib/navigation";

async function ArticleDataLoader({ locale }: { locale: Locale }) {
  const articlesResult = await getAllArticlesAction({ page: 1, limit: 100 });

  if (!articlesResult.success) {
    return (
      <DeveloperErrorDisplay
        context="CogniReadDashboardPage"
        errorMessage="No se pudieron cargar los análisis de estudios."
        errorDetails={articlesResult.error}
      />
    );
  }

  return (
    <ArticleList articles={articlesResult.data.articles} locale={locale} />
  );
}

export default async function CogniReadDashboardPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  logger.info(
    `[CogniReadDashboardPage] Renderizando v9.2 (Routing Contract Restoration) para locale: ${locale}`
  );

  const { dictionary, error: dictError } = await getDictionary(locale);
  const pageContent = dictionary.cogniReadDashboard;

  if (dictError || !pageContent) {
    if (process.env.NODE_ENV === "production") return notFound();
    return (
      <DeveloperErrorDisplay
        context="CogniReadDashboardPage"
        errorMessage="Contenido i18n no encontrado."
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {pageContent.pageHeader.title}
          </h1>
          <p className="text-muted-foreground mt-1">
            {pageContent.pageHeader.subtitle}
          </p>
        </div>
        <Button asChild size="lg">
          {/* --- [INICIO DE REFACTORIZACIÓN DE CONTRATO DE RUTA v9.2.0] --- */}
          <Link href={routes.cognireadEditor.path({ locale })}>
            {/* --- [FIN DE REFACTORIZACIÓN DE CONTRATO DE RUTA v9.2.0] --- */}
            <DynamicIcon name="CirclePlus" className="mr-2 h-5 w-5" />
            {pageContent.newArticleButton}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{pageContent.articlesListTitle}</CardTitle>
          <CardDescription>
            {pageContent.articlesListDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            }
          >
            <ArticleDataLoader locale={locale} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
