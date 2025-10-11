// components/ui/Popover.tsx
/**
 * @file Popover.tsx
 * @description Componente de UI para mostrar contenido flotante, naturalizado
 *              a partir de las primitivas de Radix UI y estilizado con shadcn/ui.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as React from "react";

import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => {
  logger.trace("[PopoverContent] Renderizando.");
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
});
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
// components/ui/Popover.tsx
