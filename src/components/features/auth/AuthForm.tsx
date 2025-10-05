// APARATO REVISADO Y NIVELADO POR L.I.A. LEGACY - VERSIÓN 5.1.0
// ADVERTENCIA: No modificar sin consultar para evaluar el impacto holístico.

// RUTA: src/components/features/auth/AuthForm.tsx
/**
 * @file AuthForm.tsx
 * @description Orquestador de UI para autenticación, con soporte para mensajes
 *              contextuales y redirección post-login.
 * @version 5.1.0 (Contextual Message Rendering & Prop Flow)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TiltCard } from "@/components/ui/TiltCard";
import { LoginForm } from "./components/LoginForm";
import { SignUpForm } from "./components/SignUpForm";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { DynamicIcon } from "@/components/ui";

type AuthFormContent = NonNullable<Dictionary["devLoginPage"]>;
type OAuthButtonsContent = NonNullable<Dictionary["oAuthButtons"]>;

interface AuthFormProps {
  content: AuthFormContent;
  oAuthContent: OAuthButtonsContent;
  locale: Locale;
  contextualMessage?: string;
  redirectUrl?: string;
}

export function AuthForm({
  content,
  oAuthContent,
  locale,
  contextualMessage,
  redirectUrl,
}: AuthFormProps) {
  const traceId = useMemo(
    () => logger.startTrace("AuthForm_Lifecycle_v5.1"),
    []
  );
  useEffect(() => {
    logger.info("[AuthForm] Orquestador montado.", {
      traceId,
      hasContextualMessage: !!contextualMessage,
    });
    return () => logger.endTrace(traceId);
  }, [traceId, contextualMessage]);

  const [view, setView] = useState<"login" | "signup">("login");

  if (!content || !oAuthContent) {
    return (
      <DeveloperErrorDisplay
        context="AuthForm"
        errorMessage="Contenido i18n incompleto."
      />
    );
  }

  const handleSwitchView = (newView: "login" | "signup") => {
    logger.traceEvent(
      traceId,
      `Acción de usuario: Cambiando vista a '${newView}'.`
    );
    setView(newView);
  };

  return (
    <div className="w-full">
      <AnimatePresence>
        {contextualMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mb-4"
          >
            <Alert>
              <DynamicIcon name="ShieldCheck" className="h-4 w-4" />
              <AlertTitle>Acceso Requerido</AlertTitle>
              <AlertDescription>{contextualMessage}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
      <TiltCard
        options={{
          max: 5,
          scale: 1.01,
          speed: 500,
          glare: true,
          "max-glare": 0.1,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, x: view === "login" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: view === "login" ? 20 : -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {view === "login" ? (
              <LoginForm
                content={content}
                oAuthContent={oAuthContent}
                locale={locale}
                onSwitchView={() => handleSwitchView("signup")}
                redirectUrl={redirectUrl}
              />
            ) : (
              <SignUpForm
                content={content}
                oAuthContent={oAuthContent}
                locale={locale}
                onSwitchView={() => handleSwitchView("login")}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </TiltCard>
    </div>
  );
}
