// app/[locale]/(dev)/dev/campaign-suite/_config/combos.config.ts
/**
 * @file combos.config.ts
 * @description SSoT para la definición de "Combos Estratégicos".
 *              Este manifiesto contiene secuencias de secciones de página que
 *              han demostrado ser de alta conversión. El sistema lo utiliza para
 *              proporcionar feedback de gamificación al estratega de marketing.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */

/**
 * @const STRATEGIC_COMBOS
 * @description Una lista de secuencias de nombres de sección. Cada secuencia
 *              es un "combo" que el LayoutBuilder intentará detectar.
 *              La SSoT de los nombres de sección es `sections.config.ts`.
 *              Se utiliza `as const` para garantizar la inmutabilidad y una
 *              inferencia de tipos precisa.
 */
export const STRATEGIC_COMBOS = [
  // Combo Clásico de Venta Directa
  ["BenefitsSection", "TestimonialGrid", "OrderSection"],

  // Combo de Generación de Confianza
  ["Hero", "SocialProofLogos", "GuaranteeSection"],

  // Combo de Contenido a Conversión (Enfoque Científico)
  ["IngredientAnalysis", "FaqAccordion", "OrderSection"],
] as const;
// app/[locale]/(dev)/dev/campaign-suite/_config/combos.config.ts
