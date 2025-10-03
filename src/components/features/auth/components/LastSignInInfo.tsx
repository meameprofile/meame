// RUTA: src/components/features/auth/_components/LastSignInInfo.tsx
/**
 * @file LastSignInInfo.tsx
 * @description Componente de presentación puro y de élite para mostrar la
 *              información del último inicio de sesión del usuario.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { motion } from "framer-motion";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { logger } from "@/shared/lib/logging";
import type { UserProfileData } from "@/shared/lib/actions/account/get-current-user-profile.action";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

type LastSignInContent = NonNullable<
  NonNullable<Dictionary["devLoginPage"]>["lastSignIn"]
>;

interface LastSignInInfoProps {
  profile: UserProfileData;
  content: LastSignInContent;
  locale: string;
}

export function LastSignInInfo({
  profile,
  content,
  locale,
}: LastSignInInfoProps) {
  logger.trace("[LastSignInInfo] Renderizando componente de UI v1.0.");

  if (!profile.last_sign_in_at) {
    return null; // No renderizar nada si no hay datos de inicio de sesión.
  }

  const lastSignInDate = new Date(profile.last_sign_in_at).toLocaleString(
    locale,
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const location = profile.last_sign_in_location || "Ubicación desconocida";
  const ip = profile.last_sign_in_ip || "No registrada";

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.4, ease: "easeInOut", delay: 0.2 }}
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
