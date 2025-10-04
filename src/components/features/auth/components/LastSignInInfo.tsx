// RUTA: src/components/features/auth/components/LastSignInInfo.tsx
/**
 * @file LastSignInInfo.tsx
 * @description Componente de presentación puro y de élite para mostrar la
 *              información del último inicio de sesión, forjado con
 *              resiliencia, compatibilidad hacia adelante y seguridad de tipos absoluta.
 * @version 7.0.0 (Great Refactoring Aligned & Type-Safe Property Guards)
 * @author L.I.A. Legacy
 */
"use client";

import React, { useMemo, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { logger } from "@/shared/lib/logging";
import type { ProfilesRow } from "@/shared/lib/schemas/account/account.contracts";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import { DeveloperErrorDisplay } from "../../dev-tools";

type LastSignInContent = NonNullable<
  NonNullable<Dictionary["devLoginPage"]>["lastSignIn"]
>;

interface LastSignInInfoProps {
  profile: ProfilesRow | null;
  content: LastSignInContent;
  locale: string;
}

const animationVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.4, ease: "easeInOut", delay: 0.2 },
  },
};

export function LastSignInInfo({
  profile,
  content,
  locale,
}: LastSignInInfoProps) {
  const traceId = useMemo(
    () => logger.startTrace("LastSignInInfo_Lifecycle_v7.0"),
    []
  );
  useEffect(() => {
    logger.info("[LastSignInInfo] Componente montado.", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  // --- [INICIO DE REFACTORIZACIÓN DE RESILIENCIA Y SEGURIDAD DE TIPOS] ---
  // Se utiliza el operador 'in' para una comprobación de propiedad segura en tiempo de ejecución.
  // Esto elimina la necesidad de 'as any' y satisface tanto a TypeScript como a ESLint.
  const lastSignInAt =
    profile && "last_sign_in_at" in profile && profile.last_sign_in_at
      ? (profile.last_sign_in_at as string)
      : null;

  if (!lastSignInAt) {
    logger.trace(
      "[Guardián] No hay datos de último inicio de sesión en el perfil. No se renderizará nada.",
      { traceId }
    );
    return null;
  }
  // --- [FIN DE REFACTORIZACIÓN] ---

  if (!content) {
    logger.error("[Guardián] Prop 'content' no proporcionada.", { traceId });
    return (
      <DeveloperErrorDisplay
        context="LastSignInInfo"
        errorMessage="Falta el contenido i18n."
      />
    );
  }

  const lastSignInDate = new Date(lastSignInAt).toLocaleString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Se aplica el mismo patrón de guardián de propiedad para location e ip.
  const location =
    profile &&
    "last_sign_in_location" in profile &&
    profile.last_sign_in_location
      ? (profile.last_sign_in_location as string)
      : content.unknownLocation;
  const ip =
    profile && "last_sign_in_ip" in profile && profile.last_sign_in_ip
      ? (profile.last_sign_in_ip as string)
      : content.unknownIp;

  logger.traceEvent(traceId, "Datos de sesión formateados para la UI.", {
    date: lastSignInDate,
    location,
    ip,
  });

  return (
    <motion.div
      variants={animationVariants}
      initial="hidden"
      animate="visible"
      className="px-4 py-2 text-xs text-muted-foreground"
    >
      <p className="font-semibold">{content.title}</p>
      <div className="flex items-center gap-1.5 mt-1">
        <DynamicIcon name="Calendar" className="h-3 w-3" />
        <span>{lastSignInDate}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <DynamicIcon name="MapPin" className="h-3 w-3" />
        <span>{content.location.replace("{{location}}", location)}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <DynamicIcon name="Network" className="h-3 w-3" />
        <span>{content.ip.replace("{{ip}}", ip)}</span>
      </div>
    </motion.div>
  );
}
