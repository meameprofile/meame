// RUTA: src/components/layout/LanguageSwitcher.tsx
/**
 * @file LanguageSwitcher.tsx
 * @description Activador del modal de selección de idioma, con UX de élite.
 * @version 8.0.0 (Holistic Contract Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useState, useMemo, useEffect } from "react";

import { Button, FlagIcon } from "@/components/ui";
import { LANGUAGE_MANIFEST } from "@/shared/lib/i18n/global.i18n.manifest";
import { type Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

import { LanguageSelectorModal } from "./LanguageSelectorModal";

// --- [INICIO DE REFACTORIZACIÓN DE API v8.0.0] ---
// La prop `supportedLocales` se elimina, ya que este componente
// no necesita conocer la lista completa; es una responsabilidad del modal.
interface LanguageSwitcherProps {
  currentLocale: Locale;
  content: NonNullable<Dictionary["languageSwitcher"]>;
}
// --- [FIN DE REFACTORIZACIÓN DE API v8.0.0] ---

export function LanguageSwitcher({
  currentLocale,
  content,
}: LanguageSwitcherProps) {
  const traceId = useMemo(() => logger.startTrace("LanguageSwitcher_v8.0"), []);

  useEffect(() => {
    logger.info("[LanguageSwitcher] Componente montado (v8.0).", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentLanguage = useMemo(() => {
    return LANGUAGE_MANIFEST.find((lang) => lang.code === currentLocale);
  }, [currentLocale]);

  if (!currentLanguage) {
    logger.error(
      `[Guardián] No se encontró la configuración del manifiesto para el locale: ${currentLocale}`,
      { traceId }
    );
    return null;
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label={content.ariaLabel}
        className="relative group"
        onClick={() => setIsModalOpen(true)}
      >
        {/* --- [INICIO DE CORRECCIÓN DE CONTRATO DE API v8.0.0] --- */}
        {/* Se pasa la prop `locale` en lugar de `countryCode` para cumplir con la API de FlagIcon. */}
        <FlagIcon
          locale={currentLanguage.code as Locale}
          className="w-6 h-6 rounded-sm transition-transform duration-300 group-hover:scale-110"
        />
        {/* --- [FIN DE CORRECCIÓN DE CONTRATO DE API v8.0.0] --- */}
      </Button>
      <LanguageSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentLocale={currentLocale}
        content={content}
      />
    </>
  );
}
