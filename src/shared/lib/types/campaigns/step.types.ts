// RUTA: src/shared/lib/types/campaigns/step.types.ts
/**
 * @file step.types.ts
 * @description SSoT para los contratos de props compartidos entre los pasos del asistente.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */

// El tipo genérico 'TContent' ahora representa la forma completa del objeto
// de contenido esperado, incluyendo la clave raíz (ej. { step0: { ... } }).
export interface StepProps<TContent> {
  content: TContent;
}
