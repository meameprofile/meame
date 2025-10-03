// RUTA: components/forms/NewsletterForm.tsx

/**
 * @file NewsletterForm.tsx
 * @description Componente de cliente atómico para el formulario de suscripción a la newsletter.
 *              v2.0.0 (Holistic Elite Leveling): Refactorizado a un componente de
 *              presentación puro, 100% data-driven a través de su contrato de props,
 *              y cumpliendo con todos los pilares de calidad.
 * @version 2.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { logger } from "@/shared/lib/logging";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

type NewsletterContent = NonNullable<
  NonNullable<Dictionary["footer"]>["newsletter"]
>;

interface NewsletterFormProps {
  content: NewsletterContent;
}

export function NewsletterForm({
  content,
}: NewsletterFormProps): React.ReactElement {
  logger.info("[NewsletterForm] Renderizando componente de élite (v2.0).");
  const [email, setEmail] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    logger.success("Suscripción a la newsletter (simulado):", { email });
    // Aquí iría la lógica de envío a un servicio de email marketing.
    setEmail("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm items-center space-x-2"
    >
      <Input
        type="email"
        placeholder={content.placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="bg-background/80"
        aria-label={content.placeholder}
      />
      <Button
        type="submit"
        variant="default"
        aria-label={content.buttonAriaLabel}
      >
        <span className="hidden sm:inline">{content.buttonText}</span>
        <DynamicIcon name="Send" className="h-4 w-4 sm:hidden" />
      </Button>
    </form>
  );
}
