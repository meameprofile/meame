// RUTA: src/app/[locale]/(dev)/cogniread/editor/page.tsx
/**
 * @file page.tsx
 * @description Página "Shell" de servidor para el editor de artículos de CogniRead.
 *              v5.0.0 (Holistic & Sovereign Path Restoration): Se refactoriza la
 *              importación del componente de cliente para que apunte a su SSoT
 *              canónica en la capa de features, resolviendo el error TS2307.
 * @version 5.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import React from "react";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui";
import { PageHeader } from "@/components/layout/PageHeader";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import type { CogniReadArticle } from "@/shared/lib/schemas/cogniread/article.schema";
import { getArticleByIdAction } from "@/shared/lib/actions/cogniread";
// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
// La importación ahora apunta a la ruta soberana del componente en la capa de features.
import { ArticleEditorClient } from "@/components/features/cogniread/editor/ArticleEditorClient";
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA] ---

interface ArticleEditorPageProps {
  params: { locale: Locale };
  searchParams: { id?: string };
}

export default async function ArticleEditorPage({
  params: { locale },
  searchParams,
}: ArticleEditorPageProps) {
  const { id } = searchParams;
  const isEditing = !!id;

  logger.info(
    `[ArticleEditorPage] Renderizando v5.0. Modo: ${isEditing ? `Edición (ID: ${id})` : "Creación"}`
  );

  const { dictionary, error: dictError } = await getDictionary(locale);
  const pageContent = dictionary.cogniReadEditor;

  if (dictError || !pageContent) {
    const errorMessage =
      "Fallo al cargar el contenido i18n para el editor de CogniRead.";
    if (process.env.NODE_ENV === "production") return notFound();
    return (
      <DeveloperErrorDisplay
        context="ArticleEditorPage"
        errorMessage={errorMessage}
        errorDetails={
          dictError || "La clave 'cogniReadEditor' falta en el diccionario."
        }
      />
    );
  }

  let initialArticleData: CogniReadArticle | null = null;
  let fetchError: string | null = null;

  if (isEditing) {
    const articleResult = await getArticleByIdAction(id);
    if (articleResult.success) {
      initialArticleData = articleResult.data.article;
      if (!initialArticleData) {
        fetchError =
          pageContent.articleNotFoundError || "Artículo no encontrado.";
      }
    } else {
      fetchError = articleResult.error;
    }
  }

  return (
    <>
      <PageHeader
        content={{
          title: isEditing
            ? pageContent.pageHeader.editTitle
            : pageContent.pageHeader.createTitle,
          subtitle: isEditing
            ? pageContent.pageHeader.editSubtitle
            : pageContent.pageHeader.createSubtitle,
        }}
      />
      <Container className="py-12">
        {fetchError ? (
          <DeveloperErrorDisplay
            context="ArticleEditorPage"
            errorMessage={fetchError}
          />
        ) : (
          <ArticleEditorClient
            initialData={initialArticleData}
            content={pageContent}
          />
        )}
      </Container>
    </>
  );
}
// RUTA: src/app/[locale]/(dev)/cogniread/editor/page.tsx
