// RUTA: src/shared/lib/middleware/handlers/auth.handler.ts
/**
 * @file auth.handler.ts
 * @description Guardián de Seguridad para el middleware, con lógica soberana de detección de rutas.
 * @version 11.0.0 (Holistic Hygiene & Elite Observability)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";

import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type MiddlewareHandler } from "../engine";
import { logger } from "../../logging";
import { routes, RouteType } from "../../navigation";
import { getCurrentLocaleFromPathname } from "../../utils/i18n/i18n.utils";

function isProtectedRoute(pathname: string, locale: string): boolean {
  for (const routeKey in routes) {
    const route = routes[routeKey as keyof typeof routes];
    // Se utiliza la propiedad 'template' para una coincidencia de ruta resiliente
    const regexPath = route.template
      .replace(/\[\[\.\.\..*?\]\]/g, "(?:/.*)?")
      .replace(/\[\.\.\..*?\]/g, "/.*")
      .replace(/\[.*?\]/g, "[^/]+");
    const routeRegex = new RegExp(`^/${locale}${regexPath}/?$`);
    if (routeRegex.test(pathname)) {
      return route.type === RouteType.DevOnly;
    }
  }
  return false;
}

export const authHandler: MiddlewareHandler = async (req, res) => {
  const traceId = logger.startTrace("authHandler_v11.0");
  const { pathname } = req.nextUrl;
  const ip = req.headers.get("x-visitor-ip") || "IP desconocida";
  const locale = getCurrentLocaleFromPathname(pathname);

  try {
    if (!isProtectedRoute(pathname, locale)) {
      logger.trace(
        `[AuthHandler] Decisión: Omitir. Razón: La ruta '${pathname}' no es protegida.`,
        { traceId }
      );
      return res;
    }

    logger.info(
      `[AuthHandler] Ruta protegida detectada: '${pathname}'. Verificando sesión...`,
      { traceId }
    );

    // --- Instanciación de Supabase Client con manejo de cookies completo ---
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            req.cookies.set({ name, value, ...options });
            res.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            req.cookies.set({ name, value: "", ...options });
            res.cookies.set({ name, value: "", ...options });
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const loginUrl = new URL(routes.login.path({ locale }), req.url);
      loginUrl.searchParams.set("redirectedFrom", pathname);
      loginUrl.searchParams.set("reason", "protected_route_access");
      logger.warn(
        `[AuthHandler] Decisión: Redirigir. Razón: ACCESO NO AUTORIZADO.`,
        { path: pathname, ip, redirectTo: loginUrl.pathname, traceId }
      );
      return NextResponse.redirect(loginUrl);
    }

    logger.success(
      `[AuthHandler] Acceso autorizado para ${user.email} a ${pathname}.`,
      { traceId }
    );
    return res;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[AuthHandler] Error inesperado.", {
      error: errorMessage,
      pathname,
      traceId,
    });
    return res; // No interrumpir la petición en caso de error interno
  } finally {
    logger.endTrace(traceId);
  }
};
