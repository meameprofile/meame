// RUTA: src/components/sections/comments/CommentList.tsx
/**
 * @file CommentList.tsx
 * @description Componente de presentación para renderizar una lista de comentarios con animación.
 * @version 2.1.0 (Decoupled Contract & Elite Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";

import { DynamicIcon } from "@/components/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { logger } from "@/shared/lib/logging";
import type { Comment } from "@/shared/lib/schemas/community/comment.schema";

// --- [INICIO DE REFACTORIZACIÓN DE CONTRATO] ---
interface CommentListProps {
  comments: Comment[];
  content: {
    emptyState: string;
  };
}
// --- [FIN DE REFACTORIZACIÓN DE CONTRATO] ---

export function CommentList({ comments, content }: CommentListProps) {
  logger.trace("[CommentList] Renderizando v2.1 (Decoupled Contract).");

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>{content.emptyState}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {comments.map((comment) => (
          <motion.div
            key={comment.commentId}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-start space-x-4"
          >
            <Avatar>
              <AvatarImage src={comment.authorAvatarUrl ?? undefined} />
              <AvatarFallback>
                <DynamicIcon name="User" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-semibold text-foreground">
                  {comment.authorName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
              <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
                {comment.commentText}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
