// RUTA: src/app/[locale]/login/_components/LoginClientOrchestrator.tsx
/**
 * @file LoginClientOrchestrator.tsx
 * @description Orquestador de cliente "cerebro" para la página de login.
 *              v3.0.0 (Interactive Inactivity & Resilient Redirect): Implementa un
 *              temporizador de inactividad de 2 minutos y una notificación interactiva.
 *              Refuerza la lógica de redirección post-login para una UX sin interrupciones.
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import Cookies from "js-cookie";
import { useSearchParams, useRouter } from "next/navigation";
import React, {
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useTransition,
} from "react";
import { toast } from "sonner";

import { AuthForm } from "@/components/features/auth/AuthForm";
import { Button } from "@/components/ui/Button";
import {
  loginWithPasswordAction,
  linkAnonymousSessionToUserAction,
} from "@/shared/lib/actions/auth";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import { routes } from "@/shared/lib/navigation";
import type { LoginFormData } from "@/shared/lib/schemas/auth/login.schema";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

type AuthFormContent = NonNullable<Dictionary["devLoginPage"]>;
type OAuthButtonsContent = NonNullable<Dictionary["oAuthButtons"]>;

const FINGERPRINT_COOKIE = "visitor_fingerprint";
const INACTIVITY_TIMEOUT = 120000; // 2 minutos en milisegundos

interface LoginClientOrchestratorProps {
  content: AuthFormContent;
  oAuthContent: OAuthButtonsContent;
  locale: Locale;
}

export function LoginClientOrchestrator({
  content,
  oAuthContent,
  locale,
}: LoginClientOrchestratorProps) {
  const traceId = useMemo(
    () => logger.startTrace("LoginClientOrchestrator_v3.0"),
    []
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const redirectedFrom = searchParams.get("redirectedFrom");
  const reason = searchParams.get("reason");
  const contextualMessage =
    reason &&
    content.contextualMessages[
      reason as keyof typeof content.contextualMessages
    ]
      ? content.contextualMessages[
          reason as keyof typeof content.contextualMessages
        ]
      : undefined;

  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const toastIdRef = useRef<string | number | null>(null);

  const clearInactivityTimers = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
  }, []);

  const resetInactivityTimer = useCallback(() => {
    clearInactivityTimers();
    inactivityTimerRef.current = setTimeout(() => {
      toastIdRef.current = toast.warning(content.inactivityToast.title, {
        description: content.inactivityToast.description,
        duration: INACTIVITY_TIMEOUT,
        action: (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => resetInactivityTimer()}>
              {content.inactivityToast.renewButton}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                clearInactivityTimers();
                router.push(`/${locale}`);
              }}
            >
              {content.inactivityToast.redirectNowButton}
            </Button>
          </div>
        ),
        onDismiss: () => {
          // Solo redirigir si el toast no fue renovado o accionado manualmente
          if (toastIdRef.current) {
            router.push(`/${locale}`);
          }
        },
      });
    }, INACTIVITY_TIMEOUT);
  }, [clearInactivityTimers, content.inactivityToast, router, locale]);

  const handleSuccessfulLogin = useCallback(() => {
    const successTraceId = logger.startTrace("loginSuccessHandler");
    logger.info("[LoginOrchestrator] Login exitoso. Manejando redirección...", {
      traceId: successTraceId,
    });
    toast.success("Login exitoso. Redirigiendo...");

    const fingerprintId = Cookies.get(FINGERPRINT_COOKIE);
    if (fingerprintId) {
      logger.traceEvent(
        successTraceId,
        "Invocando vinculación de sesión anónima en segundo plano."
      );
      linkAnonymousSessionToUserAction({ fingerprintId });
    }

    const redirectTo = redirectedFrom || routes.devDashboard.path({ locale });
    logger.success(`[LoginOrchestrator] Redirigiendo a: ${redirectTo}`, {
      traceId: successTraceId,
    });
    router.push(redirectTo);
    logger.endTrace(successTraceId);
  }, [redirectedFrom, locale, router]);

  const handleLoginSubmit = useCallback(
    (data: LoginFormData) => {
      const submitTraceId = logger.startTrace("login.onSubmit");
      logger.info("[LoginOrchestrator] Iniciando envío de login.", {
        traceId: submitTraceId,
      });

      clearInactivityTimers();

      startTransition(async () => {
        const result = await loginWithPasswordAction(data);
        if (result.success) {
          handleSuccessfulLogin();
        } else {
          toast.error("Error de Login", { description: result.error });
          logger.warn("[LoginOrchestrator] loginWithPasswordAction falló.", {
            error: result.error,
            traceId: submitTraceId,
          });
          resetInactivityTimer();
        }
        logger.endTrace(submitTraceId);
      });
    },
    [clearInactivityTimers, handleSuccessfulLogin, resetInactivityTimer]
  );

  useEffect(() => {
    logger.info(
      "[LoginOrchestrator] Montado. Iniciando temporizador de inactividad.",
      { traceId }
    );
    resetInactivityTimer();
    const events: (keyof WindowEventMap)[] = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
    ];
    events.forEach((event) =>
      window.addEventListener(event, resetInactivityTimer)
    );
    return () => {
      clearInactivityTimers();
      events.forEach((event) =>
        window.removeEventListener(event, resetInactivityTimer)
      );
      logger.endTrace(traceId);
    };
  }, [resetInactivityTimer, clearInactivityTimers, traceId]);

  return (
    <AuthForm
      content={content}
      oAuthContent={oAuthContent}
      locale={locale}
      contextualMessage={contextualMessage}
      onLoginSubmit={handleLoginSubmit}
      isPending={isPending}
    />
  );
}
