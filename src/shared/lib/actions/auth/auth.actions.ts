// RUTA: src/shared/lib/actions/auth/auth.actions.ts
/**
 * @file auth.actions.ts
 * @description SSoT para las Server Actions de autenticación.
 *              v13.0.0 (Holistic Auth Flow & Elite Error Handling): Refactorizado
 *              holísticamente para implementar el flujo de registro completo,
 *              inyectar un sistema de tracing de élite para una observabilidad
 *              total, y reforzar el manejo de errores para una máxima resiliencia.
 * @version 13.0.0
 *@author RaZ Podestá - MetaShark Tech - Asistente de Refactorización
 */
"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { logger } from "@/shared/lib/logging";
import { createServerClient } from "@/shared/lib/supabase/server";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import {
  SignUpSchema,
  type SignUpFormData,
} from "@/shared/lib/schemas/auth/signup.schema";
import {
  LoginSchema,
  type LoginFormData,
} from "@/shared/lib/schemas/auth/login.schema";
import {
  ForgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/shared/lib/schemas/auth/forgot-password.schema";

export async function loginWithPasswordAction(
  data: LoginFormData
): Promise<ActionResult<null>> {
  const traceId = logger.startTrace("loginWithPasswordAction_v13.0");
  logger.info("[AuthAction] Iniciando flujo de login...", { traceId });

  try {
    const validation = LoginSchema.safeParse(data);
    if (!validation.success) {
      const firstError = validation.error.errors[0].message;
      return { success: false, error: firstError };
    }

    const { email, password } = validation.data;
    const supabase = createServerClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    revalidatePath("/", "layout");
    return { success: true, data: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[AuthAction] Fallo en el flujo de login.", {
      error: errorMessage,
      traceId,
    });
    return {
      success: false,
      error:
        "Credenciales inválidas. Por favor, verifica tu email y contraseña.",
    };
  } finally {
    logger.endTrace(traceId);
  }
}

export async function signUpAction(
  data: SignUpFormData
): Promise<ActionResult<{ success: true }>> {
  const traceId = logger.startTrace("signUpAction_v13.0");
  logger.info("[AuthAction] Iniciando flujo de registro de nuevo usuario...", {
    traceId,
  });

  try {
    const validation = SignUpSchema.safeParse(data);
    if (!validation.success) {
      const firstError = validation.error.errors[0].message;
      return { success: false, error: firstError };
    }

    const { email, password, fullName } = validation.data;
    const supabase = createServerClient();
    const origin = headers().get("origin");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) throw error;

    revalidatePath("/", "layout");
    return { success: true, data: { success: true } };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[AuthAction] Fallo en el flujo de registro.", {
      error: errorMessage,
      traceId,
    });
    return { success: false, error: "No se pudo registrar el usuario." };
  } finally {
    logger.endTrace(traceId);
  }
}

export async function sendPasswordResetAction(
  data: ForgotPasswordFormData
): Promise<ActionResult<null>> {
  const traceId = logger.startTrace("sendPasswordResetAction_v13.0");
  logger.info("[AuthAction] Iniciando flujo de reseteo de contraseña...", {
    traceId,
  });

  try {
    const validation = ForgotPasswordSchema.safeParse(data);
    if (!validation.success) {
      const firstError = validation.error.errors[0].message;
      return { success: false, error: firstError };
    }

    const { email } = validation.data;
    const supabase = createServerClient();
    const origin = headers().get("origin");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/account/update-password`,
    });

    if (error) throw error;

    return { success: true, data: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[AuthAction] Fallo en el flujo de reseteo de contraseña.", {
      error: errorMessage,
      traceId,
    });
    return {
      success: false,
      error:
        "No se pudo enviar el email de recuperación. Por favor, verifica el email e inténtalo de nuevo.",
    };
  } finally {
    logger.endTrace(traceId);
  }
}
