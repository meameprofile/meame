// RUTA: src/components/layout/DevHeader.tsx
/**
 * @file DevHeader.tsx
 * @description Cabecera estática y básica para el layout del Developer Command Center.
 * @version 1.0.0
 *@author RaZ Podestá - MetaShark Tech
 */
import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { logger } from "@/shared/lib/logging";

export function DevHeader(): React.ReactElement {
  logger.info("[DevHeader] Renderizando cabecera de desarrollo básica.");

  return (
    <header className="py-3 sticky top-0 z-50 bg-background/90 backdrop-blur-lg border-b">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/dev"
            className="flex items-center gap-2 text-foreground font-bold"
          >
            <DynamicIcon name="Wrench" className="h-6 w-6 text-primary" />
            <span>Developer Command Center</span>
          </Link>
        </div>
      </Container>
    </header>
  );
}
