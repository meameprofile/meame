// src/components/ui/FormInput.tsx
/**
 * @file FormInput.tsx
 * @description Componente de UI atómico para campos de texto de formulario.
 *              - v2.0.0 (Theming Sovereignty): Refactorizado para usar tokens
 *                semánticos (ring-input) y mejorar el logging.
 * @version 2.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DynamicIcon } from "@/components/ui";
import { type LucideIconName } from "@/shared/lib/config/lucide-icon-names";
import { logger } from "@/shared/lib/logging";

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIconName;
  label: string;
  error?: string;
  containerClassName?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    { id, name, icon, label, error, className, containerClassName, ...props },
    ref
  ) => {
    logger.info(`[Observabilidad] Renderizando FormInput (ID: ${id})`);

    return (
      <div className={twMerge("relative", containerClassName)}>
        <label
          htmlFor={id || name}
          className="absolute left-3 -top-2.5 bg-background px-1 text-xs text-muted-foreground"
        >
          {label}
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <DynamicIcon
              name={icon}
              className={clsx(
                "h-5 w-5",
                error ? "text-destructive" : "text-muted-foreground"
              )}
              aria-hidden="true"
            />
          </div>
          <input
            id={id || name}
            name={name}
            ref={ref}
            className={twMerge(
              clsx(
                "block w-full rounded-md border-0 bg-background/50 py-3 pl-10 pr-3 text-foreground ring-1 ring-inset transition-all duration-150 placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                error
                  ? "ring-destructive focus:ring-destructive"
                  : "ring-input focus:ring-primary"
              ),
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 pl-3 text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
// src/components/ui/FormInput.tsx
