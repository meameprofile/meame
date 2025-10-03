// RUTA: src/components/features/auth/components/OAuthButtons.tsx
/**
 * @file OAuthButtons.tsx
 * @description Componente de cliente para los botones de inicio de sesión OAuth.
 * @version 3.0.0 (Boilerplate & Mock Functionality)
 * @author L.I.A. Legacy
 */
"use client";

import React, { useMemo, useEffect } from "react";
import { toast } from "sonner";
import { Button, DynamicIcon } from "@/components/ui";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";
import type { z } from "zod";
import type { OAuthButtonsContentSchema } from "@/shared/lib/schemas/components/auth/oauth-buttons.schema";

type Content = z.infer<typeof OAuthButtonsContentSchema>;

interface OAuthButtonsProps {
  content: Content;
}

export function OAuthButtons({ content }: OAuthButtonsProps) {
  const traceId = useMemo(
    () => logger.startTrace("OAuthButtons_Lifecycle_v3.0"),
    []
  );
  useEffect(() => {
    logger.info("[OAuthButtons] Componente montado en modo boilerplate.", {
      traceId,
    });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  // --- Pilar de Resiliencia: Guardián de Contrato ---
  if (!content) {
    const errorMsg =
      "Contrato de UI violado: La prop 'content' para OAuthButtons es requerida.";
    logger.error(`[Guardián] ${errorMsg}`, { traceId });
    return (
      <DeveloperErrorDisplay context="OAuthButtons" errorMessage={errorMsg} />
    );
  }

  // --- Lógica de Boilerplate ---
  const handlePlaceholderClick = (
    provider: "Google" | "Apple" | "Facebook"
  ) => {
    logger.traceEvent(
      traceId,
      `Acción de usuario: Clic en botón placeholder de ${provider}.`
    );
    toast.info(
      `La autenticación con ${provider} está pendiente de configuración.`,
      {
        description: "Esta funcionalidad se activará pronto.",
      }
    );
  };

  return (
    <div className="grid grid-cols-1 gap-2">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => handlePlaceholderClick("Google")}
      >
        <DynamicIcon name="KeyRound" className="mr-2 h-4 w-4" />
        {content.google}
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => handlePlaceholderClick("Apple")}
      >
        <DynamicIcon name="Apple" className="mr-2 h-4 w-4" />
        {content.apple}
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => handlePlaceholderClick("Facebook")}
      >
        <DynamicIcon name="Facebook" className="mr-2 h-4 w-4" />
        {content.facebook}
      </Button>
    </div>
  );
}
