// RUTA: src/components/ui/FlagIcon.tsx
/**
 * @file FlagIcon.tsx
 * @description Componente despachador inteligente para iconos de banderas, ahora resiliente.
 * @version 2.0.0 (Resilient Fallback)
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { type SVGProps } from "react";
import { type Locale, defaultLocale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import IT from "@/components/icons/flags/IT";
import ES from "@/components/icons/flags/ES";
import US from "@/components/icons/flags/US";
import BR from "@/components/icons/flags/BR";

interface FlagIconProps extends SVGProps<SVGSVGElement> {
  locale: Locale;
}

const localeToFlagMap: Record<
  Locale,
  React.ComponentType<SVGProps<SVGSVGElement>>
> = {
  "it-IT": IT,
  "es-ES": ES,
  "en-US": US,
  "pt-BR": BR,
};

export function FlagIcon({
  locale,
  ...props
}: FlagIconProps): React.ReactElement {
  // --- INICIO: GUARDIÁN DE RESILIENCIA ---
  const validLocale = locale in localeToFlagMap ? locale : defaultLocale;
  if (!(locale in localeToFlagMap)) {
    logger.warn(
      `[Guardián de Resiliencia][FlagIcon] Locale inválido o no soportado: "${locale}". Usando fallback a "${defaultLocale}".`
    );
  }
  // --- FIN: GUARDIÁN DE RESILIENCIA ---

  logger.info(
    `[Observabilidad][CLIENTE] Renderizando FlagIcon para el locale: ${validLocale}`
  );
  const FlagComponent = localeToFlagMap[validLocale];

  // Guardia final para el caso improbable de que el mapeo falle
  if (!FlagComponent) {
    logger.error(
      `[Guardián de Resiliencia][FlagIcon] No se encontró componente de bandera para el locale de fallback: ${validLocale}.`
    );
    return <div className="w-5 h-5 bg-red-500" />;
  }

  return <FlagComponent {...props} />;
}
