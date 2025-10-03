// RUTA: src/shared/lib/schemas/campaigns/steps/index.ts
/**
 * @file index.ts (Barrel File)
 * @description Fachada pública que ensambla y re-exporta todos los schemas de paso.
 *              v3.0.0 (Holistic Export Restoration): Se restaura la exportación
 *              de los schemas atómicos individuales para satisfacer todos los
 *              contratos de los módulos consumidores, resolviendo el error TS2459.
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */

// --- [INICIO DE REFACTORIZACIÓN DE ÉLITE: EXPORTACIÓN HOLÍSTICA] ---
// Se re-exportan todos los miembros de los módulos de schema atómicos.
// Esto hace que Step0ContentSchema, Step1ContentSchema, etc., estén disponibles
// para cualquier módulo que los importe desde esta fachada.
export * from "./step0.schema";
export * from "./step1.schema";
export * from "./step2.schema";
export * from "./step3.schema";
export * from "./step4.schema";
export * from "./step5.schema";
// --- [FIN DE REFACTORIZACIÓN DE ÉLITE] ---

// Se importan los schemas individuales para crear el objeto ensamblado
// que necesita el wizard.config.ts.
import { Step0ContentSchema } from "./step0.schema";
import { Step1ContentSchema } from "./step1.schema";
import { Step2ContentSchema } from "./step2.schema";
import { Step3ContentSchema } from "./step3.schema";
import { Step4ContentSchema } from "./step4.schema";
import { Step5ContentSchema } from "./step5.schema";

// Se exporta el objeto ensamblado para mantener la compatibilidad con wizard.config.ts
export const stepSchemas = {
  step0: Step0ContentSchema,
  step1: Step1ContentSchema,
  step2: Step2ContentSchema,
  step3: Step3ContentSchema,
  step4: Step4ContentSchema,
  step5: Step5ContentSchema,
};

// Se exporta el tipo para una inferencia correcta en el config
export type StepSchemas = typeof stepSchemas;
