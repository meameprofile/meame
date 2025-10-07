// RUTA: src/components/sections/CommunitySection.tsx
/**
 * @file CommunitySection.tsx
 * @description Componente de sección, con integridad de build restaurada.
 * @version 5.1.0 (Build Integrity Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { forwardRef } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui";
import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";
import type { SectionProps } from "@/shared/lib/types/sections.types";
// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA] ---

interface CommunitySectionProps extends SectionProps<"communitySection"> {
  isFocused?: boolean;
}

export const CommunitySection = forwardRef<HTMLElement, CommunitySectionProps>(
  ({ content, isFocused }, ref) => {
    logger.info("[CommunitySection] Renderizando v5.1 (Focus-Aware).");

    if (!content) {
      logger.error(
        "[Guardián] Prop 'content' no proporcionada a CommunitySection."
      );
      return (
        <DeveloperErrorDisplay
          context="CommunitySection"
          errorMessage="Contrato de UI violado: La prop 'content' es requerida."
        />
      );
    }

    const { iconName, title, description, buttonLabel, buttonHref } = content;

    return (
      <section
        ref={ref}
        className={cn(
          "py-24 sm:py-32 transition-all duration-300 rounded-lg",
          isFocused &&
            "ring-2 ring-primary ring-offset-4 ring-offset-background"
        )}
      >
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <DynamicIcon
              name={iconName}
              size={48}
              className="mx-auto mb-6 text-primary"
            />
            <h2
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              {description}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" variant="default">
                <Link href={buttonHref}>{buttonLabel}</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    );
  }
);
CommunitySection.displayName = "CommunitySection";
