// RUTA: src/components/features/auth/components/OAuthButtons.tsx
/**
 * @file OAuthButtons.tsx
 * @description Componente de cliente para los botones de inicio de sesión OAuth, ahora
 *              con funcionalidad completa para Google y observabilidad de élite.
 * @version 4.0.0 (Functional & Observable)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useTransition, useMemo, useEffect } from "react";
import { toast } from "sonner";
import type { z } from "zod";

import { Button, DynamicIcon } from "@/components/ui";
import { logger } from "@/shared/lib/logging";
import type { OAuthButtonsContentSchema } from "@/shared/lib/schemas/components/auth/oauth-buttons.schema";
import { createClient } from "@/shared/lib/supabase/client";

type Content = z.infer<typeof OAuthButtonsContentSchema>;

interface OAuthButtonsProps {
  content: Content;
}

export function OAuthButtons({ content }: OAuthButtonsProps) {
  const traceId = useMemo(
    () => logger.startTrace("OAuthButtons_Lifecycle_v4.0"),
    []
  );
  useEffect(() => {
    logger.info("[OAuthButtons] Componente funcional montado.", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  const handleOAuthLogin = (provider: "google") => {
    logger.traceEvent(traceId, `Iniciando login con: ${provider}`);
    startTransition(async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        logger.error(
          `[OAuthButtons] Fallo en signInWithOAuth para ${provider}.`,
          {
            error,
            traceId,
          }
        );
        toast.error("Error de Autenticación", {
          description:
            "No se pudo iniciar sesión con Google. Por favor, inténtalo de nuevo.",
        });
      }
    });
  };

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => handleOAuthLogin("google")}
        disabled={isPending}
      >
        {isPending ? (
          <DynamicIcon
            name="LoaderCircle"
            className="mr-2 h-4 w-4 animate-spin"
          />
        ) : (
          <DynamicIcon name="KeyRound" className="mr-2 h-4 w-4" />
        )}
        {content.google}
      </Button>
      {/* Los otros botones permanecen como placeholders por ahora */}
      <Button variant="outline" className="w-full" disabled>
        <DynamicIcon name="Apple" className="mr-2 h-4 w-4" />
        {content.apple}
      </Button>
    </div>
  );
}
