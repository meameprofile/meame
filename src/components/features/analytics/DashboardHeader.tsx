// RUTA: src/components/features/analytics/DashboardHeader.tsx
/**
 * @file DashboardHeader.tsx
 * @description Componente de presentación puro para el encabezado del Dashboard de Analíticas.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { logger } from "@/shared/lib/logging";
import type { z } from "zod";
import type { DashboardHeaderContentSchema } from "@/shared/lib/schemas/components/analytics/dashboard-header.schema";

type Content = z.infer<typeof DashboardHeaderContentSchema>;

interface DashboardHeaderProps {
  content: Content;
}

export function DashboardHeader({
  content,
}: DashboardHeaderProps): React.ReactElement {
  logger.info("[DashboardHeader] Renderizando componente de presentación.");

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{content.title}</h1>
        <p className="text-muted-foreground">{content.subtitle}</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" className="hidden sm:flex">
          <DynamicIcon name="Calendar" className="mr-2 h-4 w-4" />
          <span>{content.dateRangeButton}</span>
        </Button>
        <Button>
          <DynamicIcon name="Download" className="mr-2 h-4 w-4" />
          {content.exportButton}
        </Button>
      </div>
    </div>
  );
}
