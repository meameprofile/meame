// RUTA: src/components/layout/CookieConsentBanner.tsx
/**
 * @file CookieConsentBanner.tsx
 * @description Banner de consentimiento de cookies de élite, con animación y
 *              adherencia a los 7 Pilares de Calidad.
 * @version 3.2.0 (Sovereign Path Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCookieConsent } from "@/shared/hooks/use-cookie-consent"; // <-- ¡RUTA CORREGIDA!
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { logger } from "@/shared/lib/logging";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

// Pilar I: i18n por Contrato
type CookieConsentContent = NonNullable<Dictionary["cookieConsentBanner"]>;

interface CookieConsentBannerProps {
  content: CookieConsentContent;
}

export function CookieConsentBanner({
  content,
}: CookieConsentBannerProps): React.ReactElement {
  // Pilar III: Observabilidad
  logger.info("[CookieConsentBanner] Renderizando componente (v3.2).");
  const { hasBeenSet, accept, reject } = useCookieConsent();

  const bannerVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: "0%", opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  };

  return (
    <AnimatePresence>
      {!hasBeenSet && (
        <motion.div
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          // Pilar II: Theming Semántico
          className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t border-border shadow-lg"
          role="dialog"
          aria-live="polite"
          aria-label="Banner de consentimiento de cookies"
        >
          <Container className="py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-foreground/80 text-center sm:text-left">
                {content.message}{" "}
                <Link
                  href={content.policyLinkHref}
                  className="underline hover:text-primary"
                >
                  {content.policyLinkText}
                </Link>
                .
              </p>
              <div className="flex-shrink-0 flex items-center gap-3">
                <Button onClick={reject} variant="secondary" size="sm">
                  {content.rejectButtonText}
                </Button>
                <Button onClick={accept} variant="default" size="sm">
                  {content.acceptButtonText}
                </Button>
              </div>
            </div>
          </Container>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
