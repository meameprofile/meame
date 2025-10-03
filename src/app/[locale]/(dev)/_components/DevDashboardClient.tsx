// RUTA: src/app/[locale]/(dev)/_components/DevDashboardClient.tsx
/**
 * @file DevDashboardClient.tsx
 * @description Orquestador de cliente para el dashboard del DCC, renderizando
 *              el MagicBento para una MEA/UX de élite.
 * @version 2.0.0 (Bento Grid Orchestrator)
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionAnimator } from "@/components/layout/SectionAnimator";
import { MagicBento } from "@/components/razBits/MagicBento/MagicBento";

interface DevDashboardClientProps {
  content: NonNullable<Dictionary["devDashboardPage"]>;
}

export function DevDashboardClient({ content }: DevDashboardClientProps) {
  return (
    <SectionAnimator>
      <PageHeader content={content.pageHeader} />
      <MagicBento content={content.magicBento} />
    </SectionAnimator>
  );
}
