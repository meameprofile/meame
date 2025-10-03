// RUTA: src/shared/lib/config/campaign-suite/wizard.data.config.ts
/**
 * @file wizard.data.config.ts
 * @description SSoT de DATOS para la configuración del asistente SDC. Es seguro
 *              para ser importado en cualquier entorno (Node.js, Next.js).
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import {
  stepSchemas,
  type StepSchemas,
} from "@/shared/lib/schemas/campaigns/steps";
import { StepperTitlesSchema } from "@/shared/lib/schemas/pages/dev-campaign-suite.schema";

export interface StepDataConfig {
  readonly id: number;
  readonly titleKey: keyof z.infer<typeof StepperTitlesSchema>;
  readonly i18nKey: keyof StepSchemas;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly schema: z.ZodObject<any>;
}

export const stepsDataConfig: readonly StepDataConfig[] = [
  {
    id: 0,
    titleKey: "identificationTitle",
    i18nKey: "step0",
    schema: stepSchemas.step0,
  },
  {
    id: 1,
    titleKey: "structureTitle",
    i18nKey: "step1",
    schema: stepSchemas.step1,
  },
  {
    id: 2,
    titleKey: "layoutTitle",
    i18nKey: "step2",
    schema: stepSchemas.step2,
  },
  {
    id: 3,
    titleKey: "themeTitle",
    i18nKey: "step3",
    schema: stepSchemas.step3,
  },
  {
    id: 4,
    titleKey: "contentTitle",
    i18nKey: "step4",
    schema: stepSchemas.step4,
  },
  {
    id: 5,
    titleKey: "managementTitle",
    i18nKey: "step5",
    schema: stepSchemas.step5,
  },
];
