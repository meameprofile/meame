// RUTA: src/components/ui/Collapsible.tsx
/**
 * @file Collapsible.tsx
 * @description Sistema de componentes de élite para contenido expandible/colapsable.
 *              Basado en las primitivas de Radix UI para una accesibilidad robusta
 *              e inyectado con MEA/UX a través de animaciones de `framer-motion`.
 * @version 3.0.0 (Elite Leveling & MEA/UX Injection)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { motion, AnimatePresence } from "framer-motion";
import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";

const Collapsible = CollapsiblePrimitive.Root;
const CollapsibleTrigger = CollapsiblePrimitive.Trigger;

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(({ className, children, ...props }, ref) => {
  logger.trace("[CollapsibleContent] Renderizando contenido animado v3.0.");
  return (
    <AnimatePresence initial={false}>
      <CollapsiblePrimitive.Content
        ref={ref}
        className="overflow-hidden"
        {...props}
        asChild
      >
        <motion.div
          initial="collapsed"
          animate="open"
          exit="collapsed"
          variants={{
            open: { opacity: 1, height: "auto" },
            collapsed: { opacity: 0, height: 0 },
          }}
          transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
        >
          <div className={cn("pt-4", className)}>{children}</div>
        </motion.div>
      </CollapsiblePrimitive.Content>
    </AnimatePresence>
  );
});
CollapsibleContent.displayName = CollapsiblePrimitive.Content.displayName;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
