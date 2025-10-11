// RUTA: src/app/not-found.tsx
/**
 * @file not-found.tsx
 * @description Enrutador 404 de Nivel Raíz, ahora consciente del entorno.
 * @version 4.0.0 (Environment-Aware & Resilient)
 * @author RaZ Podestá - MetaShark Tech
 */
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { defaultLocale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import { getCurrentLocaleFromPathname } from "@/shared/lib/utils/i18n/i18n.utils";

export default function NotFound() {
  // --- [INICIO DE REFACTORIZACIÓN DE RESILIENCIA] ---
  if (process.env.NODE_ENV === "development") {
    logger.warn(
      "[Root NotFound] Error de renderizado interceptado en MODO DESARROLLO. No se redirigirá para permitir la depuración."
    );
    return null;
  }
  // --- [FIN DE REFACTORIZACIÓN DE RESILIENCIA] ---

  const headersList = headers();
  const pathname = headersList.get("x-next-pathname") || "";
  let targetLocale = defaultLocale;

  if (pathname) {
    logger.warn(
      `[Root NotFound] Ruta de PÁGINA no encontrada: "${pathname}". Redirigiendo...`
    );
    targetLocale = getCurrentLocaleFromPathname(pathname);
  } else {
    logger.error(`[Root NotFound] Solicitud de ACTIVO no encontrada.`);
  }
  redirect(`/${targetLocale}/not-found`);
}
