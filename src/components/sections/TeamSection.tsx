// RUTA: src/components/sections/TeamSection.tsx
/**
 * @file TeamSection.tsx
 * @description Componente de sección para presentar a los miembros del equipo.
 * @version 2.0.0 (Sovereign Contract & Focus-Aware)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { DynamicIcon } from "@/components/ui";
import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";
import type { SectionProps } from "@/shared/lib/types/sections.types";
import type { TeamMember } from "@/shared/lib/schemas/components/team-section.schema";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";

interface TeamSectionProps extends SectionProps<"teamSection"> {
  isFocused?: boolean;
}

export const TeamSection = forwardRef<HTMLElement, TeamSectionProps>(
  ({ content, isFocused }, ref) => {
    logger.info("[TeamSection] Renderizando v2.0 (Focus-Aware).");

    if (!content) {
      logger.error("[Guardián] Prop 'content' no proporcionada a TeamSection.");
      return (
        <DeveloperErrorDisplay
          context="TeamSection"
          errorMessage="Contrato de UI violado: La prop 'content' es requerida."
        />
      );
    }

    const { eyebrow, title, members } = content;

    return (
      <section
        ref={ref}
        id="team"
        className={cn(
          "py-24 sm:py-32 transition-all duration-300",
          isFocused && "ring-2 ring-primary"
        )}
      >
        <Container>
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-lg text-primary mb-2 tracking-wider">
              {eyebrow}
            </h2>
            <p className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {title}
            </p>
          </div>
          <ul className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {members.map((member: TeamMember) => (
              <li key={`${member.firstName}-${member.lastName}`}>
                <Image
                  className="aspect-[3/2] w-full rounded-2xl object-cover"
                  src={member.imageUrl}
                  alt={`Fotografía de ${member.firstName} ${member.lastName}`}
                  width={400}
                  height={267}
                />
                <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-foreground">
                  {member.firstName} {member.lastName}
                </h3>
                <div className="text-base leading-7 text-muted-foreground">
                  {member.positions.map((position, index) => (
                    <p key={index}>{position}</p>
                  ))}
                </div>
                <ul className="mt-6 flex gap-x-6">
                  {member.socialNetworks.map((social) => (
                    <li key={social.name}>
                      <Link
                        href={social.url}
                        className="text-muted-foreground hover:text-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="sr-only">{social.name}</span>
                        <DynamicIcon name={social.icon} className="h-6 w-6" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    );
  }
);
TeamSection.displayName = "TeamSection";
