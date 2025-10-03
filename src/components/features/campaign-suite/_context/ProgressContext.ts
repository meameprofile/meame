// app/[locale]/(dev)/dev/campaign-suite/_context/ProgressContext.ts
/**
 * @file ProgressContext.ts
 * @description SSoT para el estado y las acciones de la barra de progreso.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { createContext } from "react";

export type StepStatus = "completed" | "active" | "pending" | "skipped";

export interface ProgressStep {
  id: number;
  title: string;
  status: StepStatus;
}

interface ProgressContextType {
  steps: ProgressStep[];
  onStepClick: (stepId: number) => void;
}

export const ProgressContext = createContext<ProgressContextType | null>(null);
