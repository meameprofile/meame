// RUTA: src/shared/lib/schemas/components/ingredient-analysis.schema.ts
/**
 * @file ingredient-analysis.schema.ts
 * @description Esquema de Zod para el contenido i18n del componente IngredientAnalysis.
 *              - v4.1.0 (Build Fix): Se elimina la llamada al logger para resolver
 *                la violación de la frontera servidor-cliente.
 * @version 4.1.0
 * @author L.I.A. Legacy
 */
import { z } from "zod";

/**
 * @const IngredientSchema
 * @description Valida un único ingrediente con su nombre y descripción.
 */
const IngredientSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export type Ingredient = z.infer<typeof IngredientSchema>;

/**
 * @const IngredientAnalysisContentSchema
 * @description La SSoT para la ESTRUCTURA del contenido de la sección.
 */
export const IngredientAnalysisContentSchema = z.object({
  title: z.string(),
  ingredients: z.array(IngredientSchema),
});

/**
 * @const IngredientAnalysisLocaleSchema
 * @description Valida la clave de nivel superior para un locale específico.
 */
export const IngredientAnalysisLocaleSchema = z.object({
  ingredientAnalysis: IngredientAnalysisContentSchema.optional(),
});

export const IngredientAnalysisI18nSchema = z.object({
  "es-ES": IngredientAnalysisLocaleSchema,
  "pt-BR": IngredientAnalysisLocaleSchema,
  "en-US": IngredientAnalysisLocaleSchema,
  "it-IT": IngredientAnalysisLocaleSchema,
});
