// RUTA: src/components/ui/Alert.tsx
/**
 * @file Alert.tsx
 * @description Componente de alerta de élite, inyectado con MEA/UX.
 * @version 2.1.0 (A11y & Elite Leveling)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils/cn";
import { logger } from "@/shared/lib/logging";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 pl-14 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const AlertComponent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => {
  logger.trace("[AlertComponent] Renderizando componente base de alerta.");
  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
});
AlertComponent.displayName = "AlertComponent";

// --- [INICIO DE REFACTORIZACIÓN DE ACCESIBILIDAD] ---
const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  >
    {children}
  </h5>
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  >
    {children}
  </p>
));
AlertDescription.displayName = "AlertDescription";
// --- [FIN DE REFACTORIZACIÓN DE ACCESIBILIDAD] ---

const AnimatedAlert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => {
  logger.trace("[AnimatedAlert] Renderizando alerta con animación MEA/UX.");
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <AlertComponent
        ref={ref}
        className={className}
        variant={variant}
        {...props}
      />
    </motion.div>
  );
});
AnimatedAlert.displayName = "Alert";

export { AnimatedAlert as Alert, AlertTitle, AlertDescription };
