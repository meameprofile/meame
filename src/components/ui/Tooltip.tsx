// RUTA: components/ui/Tooltip.tsx
/**
 * @file Tooltip.tsx
 * @description Sistema de componentes de Tooltip de élite, accesible y animado.
 *              Basado en Radix UI para una accesibilidad robusta (WAI-ARIA) y
 *              en Framer Motion para una experiencia de usuario (UX) pulida.
 * @version 2.0.0 (MEA Injected)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/lib/utils/cn";
import { logger } from "@/shared/lib/logging";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, children, ...props }, ref) => {
  logger.trace("[TooltipContent] Renderizando contenido de tooltip v2.0.");

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn("z-50", className)}
        {...props}
      >
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <div className="overflow-hidden rounded-md border border-border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md">
              {children}
            </div>
          </motion.div>
        </AnimatePresence>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
});
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
