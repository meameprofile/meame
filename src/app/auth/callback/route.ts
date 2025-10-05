// RUTA: src/app/auth/callback/route.ts
/**
 * @file route.ts
 * @description Manejador de ruta soberano para el callback de OAuth, forjado con
 *              observabilidad de élite y un guardián de resiliencia.
 * @version 2.0.0 (Elite Observability & Resilience)
 * @author RaZ Podestá - MetaShark Tech
 */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { logger } from "@/shared/lib/logging";
import { routes } from "@/shared/lib/navigation";
import { defaultLocale } from "@/shared/lib/i18n/i18n.config";

export async function GET(request: Request) {
  const traceId = logger.startTrace("authCallbackRoute_v2.0");
  logger.startGroup("[Auth Callback] Procesando callback de OAuth...");

  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? `/${defaultLocale}/dev`;

    if (!code) {
      const errorMessage =
        "No se recibió el código de autorización del proveedor.";
      logger.warn(`[Auth Callback] ${errorMessage}`, { traceId });
      const errorUrl = new URL(
        routes.login.path({ locale: defaultLocale }),
        origin
      );
      errorUrl.searchParams.set("error", "auth_code_missing");
      errorUrl.searchParams.set("error_description", errorMessage);
      return NextResponse.redirect(errorUrl);
    }

    logger.traceEvent(
      traceId,
      "Código de autorización recibido. Procediendo al intercambio de sesión."
    );
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      logger.error("[Auth Callback] Fallo al intercambiar código por sesión.", {
        error: error.message,
        traceId,
      });
      const errorUrl = new URL(
        routes.login.path({ locale: defaultLocale }),
        origin
      );
      errorUrl.searchParams.set("error", "session_exchange_failed");
      errorUrl.searchParams.set(
        "error_description",
        "No se pudo validar la sesión. Por favor, inténtalo de nuevo."
      );
      return NextResponse.redirect(errorUrl);
    }

    logger.success(
      `[Auth Callback] Sesión creada con éxito. Redirigiendo a la ruta de destino: ${next}`,
      { traceId }
    );
    return NextResponse.redirect(`${origin}${next}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(
      "[Auth Callback] Fallo crítico no controlado en el manejador de callback.",
      { error: errorMessage, traceId }
    );
    const errorUrl = new URL(
      routes.login.path({ locale: defaultLocale }),
      request.url
    );
    errorUrl.searchParams.set("error", "internal_server_error");
    errorUrl.searchParams.set(
      "error_description",
      "Ocurrió un error inesperado en el servidor."
    );
    return NextResponse.redirect(errorUrl);
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
