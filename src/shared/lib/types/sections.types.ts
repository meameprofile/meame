// RUTA: src/shared/lib/types/sections.types.ts
/**
 * @file sections.types.ts
 * @description SSoT para los contratos de tipos compartidos de los componentes de sección.
 * @version 2.0.0 (Elite & Generic Contract)
 * @author L.I.A. Legacy
 */
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import type { Locale } from "@/shared/lib/i18n/i18n.config";

/**
 * @interface SectionProps
 * @description Contrato base genérico que TODOS los componentes de sección deben cumplir.
 *              Asegura que cada sección reciba su contenido validado y el locale actual.
 * @template T - El tipo de la clave del diccionario para el contenido de esta sección.
 */
export interface SectionProps<T extends keyof Dictionary> {
  content: NonNullable<Dictionary[T]>;
  locale: Locale;
}
