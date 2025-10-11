// RUTA: src/components/ui/EmptyState.tsx
/**
 * @file EmptyState.tsx
 * @description Componente de presentación puro para estados vacíos informativos.
 * @version 2.0.0 (Architectural Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
// --- [INICIO DE REFACTORIZACIÓN SOBERANA] ---
// Se importa el tipo desde su SSoT canónica, resolviendo el error TS2459.
import type { LucideIconName } from "@/shared/lib/config/lucide-icon-names";
// --- [FIN DE REFACTORIZACIÓN SOBERANA] ---

interface EmptyStateProps {
  icon: LucideIconName;
  title: string;
  description: React.ReactNode;
  actions?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  actions,
}: EmptyStateProps) {
  return (
    <Card className="w-full max-w-lg mx-auto border-dashed">
      <CardHeader className="text-center">
        <div className="mx-auto bg-muted/50 p-4 rounded-full w-fit mb-4">
          <DynamicIcon
            name={icon}
            className="h-10 w-10 text-muted-foreground"
          />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {actions && <CardContent className="text-center">{actions}</CardContent>}
    </Card>
  );
}
