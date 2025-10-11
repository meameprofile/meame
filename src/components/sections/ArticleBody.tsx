// RUTA: src/components/sections/ArticleBody.tsx
"use client";
import React, { forwardRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { Container } from "@/components/ui";
import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";
interface ArticleBodyProps {
  content: string;
  isFocused?: boolean;
}

export const ArticleBody = forwardRef<HTMLElement, ArticleBodyProps>(
  ({ content, isFocused }, ref) => {
    const traceId = logger.startTrace("ArticleBody_Render_v3.1");
    logger.info(
      "[ArticleBody] Renderizando contenido Markdown (Focus-Aware).",
      { traceId }
    );

    if (typeof content !== "string") {
      logger.error(
        "[Guardián] Prop 'content' inválida para ArticleBody. Se esperaba un string.",
        { traceId, receivedType: typeof content }
      );
      logger.endTrace(traceId);
      return (
        <Container className="py-12">
          <DeveloperErrorDisplay
            context="ArticleBody"
            errorMessage="Contrato de UI violado: La prop 'content' debe ser un string de Markdown."
          />
        </Container>
      );
    }

    logger.endTrace(traceId);

    return (
      <section
        ref={ref}
        className={cn(
          "transition-all duration-300",
          isFocused && "ring-2 ring-primary rounded-lg"
        )}
      >
        <Container className="max-w-4xl py-12">
          <article className="prose dark:prose-invert lg:prose-xl mx-auto">
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
              {content}
            </ReactMarkdown>
          </article>
        </Container>
      </section>
    );
  }
);
ArticleBody.displayName = "ArticleBody";
