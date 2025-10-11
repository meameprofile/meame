// RUTA: src/components/sections/comments/CommentSectionClient.tsx
/**
 * @file CommentSectionClient.tsx
 * @description Componente "cerebro" de cliente para la sección de comentarios interactiva.
 *              Es 100% data-driven y no tiene conocimiento de la obtención de datos.
 * @version 2.0.0 (Elite & Decoupled)
 *@author RaZ Podestá - MetaShark Tech - Asistente de Refactorización
 */
"use client";

import React, { useState, useTransition } from "react";
import { toast } from "sonner";

import { postCommentAction } from "@/shared/lib/actions/cogniread";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import type { Comment } from "@/shared/lib/schemas/community/comment.schema";
import type { CommentSectionContent } from "@/shared/lib/schemas/components/comment-section.schema";

import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";

interface CommentSectionClientProps {
  initialComments: Comment[];
  articleId: string;
  articleSlug: string;
  isAuthenticated: boolean;
  currentUser?: {
    name: string;
    avatarUrl?: string | null;
  };
  content: CommentSectionContent;
  locale: Locale;
}

export function CommentSectionClient({
  initialComments,
  articleId,
  articleSlug,
  isAuthenticated,
  currentUser,
  content,
  locale,
}: CommentSectionClientProps) {
  logger.info("[CommentSectionClient] Renderizando UI interactiva v2.0.");
  const [comments, setComments] = useState(initialComments);
  const [isPending, startTransition] = useTransition();

  const handlePostComment = (data: { commentText: string }) => {
    startTransition(async () => {
      const result = await postCommentAction({
        articleId,
        articleSlug,
        commentText: data.commentText,
      });
      if (result.success) {
        toast.success(content.toast.success);
        setComments((prev) => [...prev, result.data.newComment]);
      } else {
        toast.error(content.toast.errorTitle, {
          description:
            result.error === "auth_required"
              ? content.toast.authError
              : result.error,
        });
      }
    });
  };

  return (
    <div className="space-y-8">
      <CommentForm
        isAuthenticated={isAuthenticated}
        userAvatarUrl={currentUser?.avatarUrl}
        userName={currentUser?.name}
        onSubmit={handlePostComment}
        isPending={isPending}
        content={content.form}
        locale={locale}
      />
      <CommentList comments={comments} content={content.list} />
    </div>
  );
}
