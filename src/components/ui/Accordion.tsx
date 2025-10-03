// RUTA: src/components/ui/Accordion.tsx
/**
 * @file Accordion.tsx
 * @description Sistema de componentes de acordeón de élite, inyectado con MEA/UX.
 * @version 3.1.0 (Code Hygiene)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
// --- [INICIO DE CORRECCIÓN DE HIGIENE] ---
// Se elimina la importación no utilizada de 'AnimatePresence'.
import { motion } from "framer-motion";
// --- [FIN DE CORRECCIÓN DE HIGIENE] ---
import { DynamicIcon } from "@/components/ui";
import { cn } from "@/shared/lib/utils/cn";
import { logger } from "@/shared/lib/logging";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => {
  logger.trace("[AccordionItem] Renderizando.");
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn("border-b", className)}
      {...props}
    />
  );
});
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <DynamicIcon
        name="ChevronDown"
        className="h-4 w-4 shrink-0 transition-transform duration-200"
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  logger.trace("[AccordionContent] Renderizando contenido v3.1.");
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className="overflow-hidden text-sm transition-all"
      {...props}
      asChild
    >
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: 1,
          height: "auto",
          transition: { duration: 0.3, ease: "easeInOut" },
        }}
        exit={{
          opacity: 0,
          height: 0,
          transition: { duration: 0.3, ease: "easeInOut" },
        }}
      >
        <div className={cn("pb-4 pt-0", className)}>{children}</div>
      </motion.div>
    </AccordionPrimitive.Content>
  );
});
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
