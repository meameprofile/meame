// app/[locale]/(dev)/dev/campaign-suite/_components/ProgressStepper.tsx
/**
 * @file ProgressStepper.tsx
 * @description Componente de UI "Línea de Progreso" para el header de la SDC.
 * @version 3.0.0 (Elite UX): Rediseño completo a un stepper horizontal,
 *              interactivo y animado con tooltips.
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";
import { DynamicIcon } from "@/components/ui";
import type { ProgressStep } from "../_context/ProgressContext";

const stepVariants = cva(
  "relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300",
  {
    variants: {
      status: {
        completed: "bg-primary border-primary text-primary-foreground",
        active: "bg-background border-primary scale-125 shadow-lg",
        pending: "bg-muted border-border text-muted-foreground",
        skipped: "bg-yellow-400/20 border-yellow-500 text-yellow-600",
      },
      isClickable: {
        true: "cursor-pointer hover:scale-110",
        false: "cursor-not-allowed",
      },
    },
  }
);

interface StepProps extends VariantProps<typeof stepVariants> {
  step: ProgressStep;
  onClick: () => void;
}

const Step = ({ step, status, isClickable, onClick }: StepProps) => (
  <li className="relative group">
    <button
      onClick={onClick}
      disabled={!isClickable}
      className={cn(stepVariants({ status, isClickable }))}
      aria-label={`Ir al paso ${step.id}: ${step.title}`}
    >
      {status === "completed" ? (
        <DynamicIcon name="Check" className="h-4 w-4" />
      ) : (
        <span className="font-bold">{step.id}</span>
      )}
    </button>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-foreground text-background text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
      {step.title}
    </div>
  </li>
);

interface ProgressStepperProps {
  steps: ProgressStep[];
  onStepClick: (stepId: number) => void;
}

export function ProgressStepper({
  steps,
  onStepClick,
}: ProgressStepperProps): React.ReactElement {
  logger.info(
    "[ProgressStepper] Renderizando barra de progreso de élite (v3.0)"
  );
  const activeStepIndex = steps.findIndex((s) => s.status === "active");
  const progressPercentage =
    activeStepIndex > 0 ? (activeStepIndex / (steps.length - 1)) * 100 : 0;

  return (
    <nav aria-label="Progreso del asistente">
      <ol className="relative flex items-center justify-between w-full max-w-md">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-full bg-border -z-10" />
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10"
          initial={{ width: "0%" }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        {steps.map((step) => {
          const isClickable =
            step.status === "completed" || step.status === "active";
          return (
            <Step
              key={step.id}
              step={step}
              status={step.status}
              isClickable={isClickable}
              onClick={() => onStepClick(step.id)}
            />
          );
        })}
      </ol>
    </nav>
  );
}
