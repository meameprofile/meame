// RUTA: src/components/sections/CommentSection.tsx
/**
 * @file CommentSection.tsx
 * @description Aparato "Server Shell" para la sección de comentarios, alineado
 *              con el contrato de props soberano y con resiliencia de élite.
 * @version 4.0.0 (Sovereign Prop Contract & Elite Resilience)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import React from "react";

import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { Container, Separator } from "@/components/ui";
import { getCommentsByArticleIdAction } from "@/shared/lib/actions/cogniread";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import { defaultLocale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import { createServerClient } from "@/shared/lib/supabase/server";

import { CommentSectionClient } from "./comments/CommentSectionClient";

interface CommentSectionProps {
  articleId: string;
  articleSlug: string;
}

export async function CommentSection({
  articleId,
  articleSlug,
}: CommentSectionProps) {
  const traceId = logger.startTrace(`CommentSection_Shell_v4.0:${articleId}`);
  const groupId = logger.startGroup(
    `[CommentSection Shell] Ensamblando datos para artículo ${articleId}...`
  );

  try {
    const [commentsResult, supabase, { dictionary, error: dictError }] =
      await Promise.all([
        getCommentsByArticleIdAction(articleId),
        createServerClient(),
        getDictionary(defaultLocale),
      ]);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (dictError || !dictionary.commentSection) {
      throw (
        dictError ||
        new Error("La clave 'commentSection' falta en el diccionario.")
      );
    }
    if (!commentsResult.success) {
      throw new Error(commentsResult.error);
    }

    logger.success(
      "[CommentSection Shell] Datos obtenidos con éxito. Delegando a cliente.",
      { traceId }
    );

    return (
      <section className="py-12 sm:py-16">
        <Container className="max-w-4xl">
          <Separator className="my-8" />
          <h2 className="text-2xl font-bold mb-6">
            {dictionary.commentSection.title}
          </h2>
          <CommentSectionClient
            initialComments={commentsResult.data.comments}
            articleId={articleId}
            articleSlug={articleSlug}
            isAuthenticated={!!user}
            currentUser={
              user
                ? {
                    name: user.email!,
                    avatarUrl: user.user_metadata.avatar_url,
                  }
                : undefined
            }
            content={dictionary.commentSection}
            locale={defaultLocale}
          />
        </Container>
      </section>
    );
  } catch (error) {
    logger.error("[CommentSection Shell] Fallo crítico irrecuperable.", {
      error: error instanceof Error ? error.message : String(error),
      traceId,
    });
    if (process.env.NODE_ENV === "development") {
      return (
        <Container className="max-w-4xl py-12">
          <DeveloperErrorDisplay
            context="CommentSection Server Shell"
            errorMessage="No se pudo construir la sección de comentarios."
            errorDetails={error instanceof Error ? error : String(error)}
          />
        </Container>
      );
    }
    return null;
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
