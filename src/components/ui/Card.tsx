// components/ui/Card.tsx
/**
 * @file Card.tsx
 * @description Conjunto de componentes atómicos para la construcción de tarjetas de UI.
 *              Diseñado siguiendo un patrón de composición para máxima flexibilidad.
 * @version 1.2.0 (A11y & Explicit Children Fix)
 * @author RaZ Podestá - MetaShark Tech
 */
import * as React from "react";
import { twMerge } from "tailwind-merge";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge(
      "rounded-xl border border-white/10 bg-background/50 shadow-md text-foreground",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

// --- [INICIO DE REFACTORIZACIÓN DE ÉLITE: A11y & Type Fix] ---
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={twMerge(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={twMerge("text-sm text-muted-foreground", className)}
    {...props}
  >
    {children}
  </p>
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={twMerge("p-6 pt-0", className)} {...props}>
    {children}
  </div>
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge("flex items-center p-6 pt-0", className)}
    {...props}
  >
    {children}
  </div>
));
CardFooter.displayName = "CardFooter";
// --- [FIN DE REFACTORIZACIÓN DE ÉLITE] ---

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
