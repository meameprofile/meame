// RUTA: src/components/features/form-builder/FormFieldGroup.tsx
/**
 * @file FormFieldGroup.tsx
 * @description Componente de layout atómico para agrupar elementos de un campo de formulario.
 *              v4.0.0 (Elite Compliance & Resilience): Inyectado con observabilidad de
 *              ciclo de vida completo y un guardián de resiliencia para el contenido.
 * @version 4.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useMemo } from "react";
import {
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/Form";
import { cn } from "@/shared/lib/utils/cn";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";

interface FormFieldGroupProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormFieldGroup({
  label,
  description,
  children,
  className,
}: FormFieldGroupProps): React.ReactElement {
  const traceId = useMemo(
    () => logger.startTrace(`FormFieldGroup:${label}`),
    [label]
  );
  logger.trace("[FormFieldGroup] Renderizando v4.0.", { traceId });

  // --- Guardián de Resiliencia ---
  if (!children) {
    const errorMsg = "Contrato de UI violado: La prop 'children' es requerida.";
    logger.error(`[Guardián] ${errorMsg}`, { traceId });
    return (
      <DeveloperErrorDisplay
        context={`FormFieldGroup (label: ${label})`}
        errorMessage={errorMsg}
      />
    );
  }

  return (
    <FormItem className={cn("space-y-3", className)}>
      <FormLabel>{label}</FormLabel>
      {children}
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}
