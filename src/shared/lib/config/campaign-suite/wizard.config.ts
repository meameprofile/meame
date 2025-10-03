// RUTA: src/shared/lib/config/campaign-suite/wizard.config.ts
/**
 * @file wizard.config.ts
 * @description Ensamblador de configuración de la SDC.
 * @version 21.0.0 (Data Corruption Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
import type { ComponentType } from "react";
import { stepsDataConfig, type StepDataConfig } from "./wizard.data.config";
import {
  Step0,
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
} from "@/components/features/campaign-suite/steps";

export interface StepConfig extends StepDataConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly component: ComponentType<any>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const componentMap: Record<number, ComponentType<any>> = {
  0: Step0,
  1: Step1,
  2: Step2,
  3: Step3,
  4: Step4,
  5: Step5,
};

export const stepsConfig: readonly StepConfig[] = stepsDataConfig.map(
  (stepData) => ({
    ...stepData,
    component: componentMap[stepData.id],
  })
);
// RUTA: src/shared/lib/config/campaign-suite/wizard.config.ts
