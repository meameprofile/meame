// components/features/analytics/DashboardHeader.tsx
/**
 * @file DashboardHeader.tsx
 * @description Encabezado principal para el Dashboard de Analíticas.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

export function DashboardHeader(): React.ReactElement {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard de Analíticas
        </h1>
        <p className="text-muted-foreground">
          Una visión general del rendimiento de tus campañas.
        </p>
      </div>
      <div className="flex items-center space-x-2">
        {/* Placeholder para futura funcionalidad de selección de fecha */}
        <Button variant="outline" className="hidden sm:flex">
          <DynamicIcon name="Calendar" className="mr-2 h-4 w-4" />
          <span>Últimos 30 días</span>
        </Button>
        <Button>
          <DynamicIcon name="Download" className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>
    </div>
  );
}
// components/features/analytics/DashboardHeader.tsx
