// APARATO REVISADO Y NIVELADO POR L.I.A. LEGACY - VERSIÓN 3.1.0
// ADVERTENCIA: No modificar sin consultar para evaluar el impacto holístico.

// RUTA: src/app/select-language/_components/LanguageSelectorClient.tsx
/**
 * @file LanguageSelectorClient.tsx
 * @description Componente de cliente para la selección de idioma, con persistencia
 *              de preferencia y navegación contextual.
 * @version 3.1.0 (Build Integrity Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { motion } from "framer-motion"; // <-- IMPORTACIÓN RESTAURADA
import { defaultLocale, type Locale } from "@/shared/lib/i18n/i18n.config";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { logger } from "@/shared/lib/logging";
import type { SelectLanguagePageContent } from "@/shared/lib/schemas/pages/select-language.schema";

interface LanguageSelectorClientProps {
  content: SelectLanguagePageContent;
}

export function LanguageSelectorClient({
  content,
}: LanguageSelectorClientProps) {
  const traceId = useMemo(
    () => logger.startTrace("LanguageSelectorClient_Lifecycle_v3.1"),
    []
  );
  useEffect(() => {
    logger.info("[LanguageSelectorClient] Componente montado.", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    if (countdown <= 0) {
      clearInterval(timer);
      logger.warn(
        `[LanguageSelector] Tiempo agotado. Redirigiendo al locale por defecto: ${defaultLocale}`,
        { traceId }
      );
      const returnUrl = searchParams.get("returnUrl") || "/";
      router.replace(`/${defaultLocale}${returnUrl}`);
    }

    return () => clearInterval(timer);
  }, [countdown, router, searchParams, traceId]);

  const handleLanguageSelect = (locale: Locale) => {
    const actionTraceId = logger.startTrace("handleLanguageSelect");
    logger.startGroup(`[LanguageSelector] Idioma '${locale}' seleccionado.`);

    // 1. Persistir la preferencia explícita del usuario
    Cookies.set("NEXT_LOCALE", locale, { expires: 365, path: "/" });
    logger.traceEvent(
      actionTraceId,
      `Cookie 'NEXT_LOCALE' establecida con valor: ${locale}`
    );

    // 2. Redirigir al usuario a su destino original con el nuevo locale
    const returnUrl = searchParams.get("returnUrl") || "/";
    const finalPath = `/${locale}${returnUrl}`;
    logger.traceEvent(
      actionTraceId,
      `Redirigiendo a la ruta final: ${finalPath}`
    );
    router.replace(finalPath);

    logger.endGroup();
    logger.endTrace(actionTraceId);
  };

  const progress = (countdown / 5) * 100;

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader>
        <CardTitle>{content.title}</CardTitle>
        <CardDescription>{content.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {Object.entries(content.languages).map(([code, name]) => (
            <Button
              key={code}
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleLanguageSelect(code as Locale)}
            >
              {name}
            </Button>
          ))}
        </div>
        <div className="pt-4 text-center text-sm text-muted-foreground">
          <p>{`Redireccionando en ${countdown} segundos...`}</p>
          <div className="w-full bg-muted rounded-full h-2.5 mt-2 overflow-hidden">
            <motion.div
              className="bg-primary h-2.5 rounded-full"
              initial={{ width: "100%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
