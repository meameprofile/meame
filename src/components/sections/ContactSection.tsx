// RUTA: src/components/sections/ContactSection.tsx
/**
 * @file ContactSection.tsx
 * @description Sección de Contacto. Orquestador que compone la información
 *              de contacto y el formulario atómico.
 * @version 6.0.0 (Sovereign Contract & Focus-Aware)
 * @author L.I.A. Legacy
 */
"use client";

import React, { forwardRef } from "react";
import { Container } from "@/components/ui/Container";
import { DynamicIcon } from "@/components/ui";
import { ContactForm } from "@/components/features/contact/ContactForm";
import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";
import type { SectionProps } from "@/shared/lib/types/sections.types";
import type { ContactInfoItem } from "@/shared/lib/schemas/components/contact-section.schema";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";

interface ContactSectionProps extends SectionProps<"contactSection"> {
  isFocused?: boolean;
}

export const ContactSection = forwardRef<HTMLElement, ContactSectionProps>(
  ({ content, isFocused }, ref) => {
    logger.info("[ContactSection] Renderizando v6.0 (Focus-Aware).");

    if (!content) {
      logger.error(
        "[Guardián] Prop 'content' no proporcionada a ContactSection."
      );
      return (
        <DeveloperErrorDisplay
          context="ContactSection"
          errorMessage="Contrato de UI violado: La prop 'content' es requerida."
        />
      );
    }

    const { eyebrow, title, description, contactInfo, form } = content;

    return (
      <section
        ref={ref}
        id="contact"
        className={cn(
          "py-24 sm:py-32 transition-all duration-300 rounded-lg",
          isFocused &&
            "ring-2 ring-primary ring-offset-4 ring-offset-background"
        )}
      >
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="mb-4">
                <h2 className="text-lg text-primary mb-2 tracking-wider">
                  {eyebrow}
                </h2>
                <h3 className="text-3xl md:text-4xl font-bold">{title}</h3>
              </div>
              <p className="mb-8 text-muted-foreground lg:w-5/6">
                {description}
              </p>
              <div className="flex flex-col gap-4">
                {contactInfo.map((info: ContactInfoItem) => (
                  <div key={info.label} className="flex items-center gap-4">
                    <DynamicIcon
                      name={info.iconName}
                      className="h-6 w-6 text-primary"
                    />
                    <div>
                      <p className="font-semibold text-foreground">
                        {info.label}
                      </p>
                      <p className="text-muted-foreground">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <ContactForm content={form} />
          </div>
        </Container>
      </section>
    );
  }
);
ContactSection.displayName = "ContactSection";
