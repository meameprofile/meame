// RUTA: src/app/[locale]/(dev)/_components/DevDashboardClient.tsx
/**
 * @file DevDashboardClient.tsx
 * @description Orquestador de cliente para el dashboard del DCC, ahora purificado
 *              y con observabilidad de ciclo de vida completo.
 * @version 3.0.0 (Purified & Elite Observability)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useMemo, useEffect } from "react";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionAnimator } from "@/components/layout/SectionAnimator";
import { MagicBento } from "@/components/razBits/MagicBento/MagicBento";
import { logger } from "@/shared/lib/logging";

interface DevDashboardClientProps {
  content: NonNullable<Dictionary["devDashboardPage"]>;
}

export function DevDashboardClient({ content }: DevDashboardClientProps) {
  const traceId = useMemo(
    () => logger.startTrace("DevDashboardClient_Lifecycle_v3.0"),
    []
  );
  useEffect(() => {
    logger.info("[DevDashboardClient] Componente de presentación montado.", {
      traceId,
    });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  return (
    <SectionAnimator>
      <PageHeader content={content.pageHeader} />
      <MagicBento content={content.magicBento} />
    </SectionAnimator>
  );
}
