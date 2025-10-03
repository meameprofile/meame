// RUTA: src/components/ui/Label.tsx
/**
 * @file Label.tsx
 * @description Componente de etiqueta de élite, basado en Radix UI para máxima
 *              accesibilidad. Cumple con los 7 Pilares de Calidad.
 * @version 2.0.0 (Elite Leveling)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils/cn";
import { logger } from "@/shared/lib/logging";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => {
  logger.trace("[Label] Renderizando componente de etiqueta.");
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants(), className)}
      {...props}
    />
  );
});
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
// RUTA: src/components/ui/Label.tsx
