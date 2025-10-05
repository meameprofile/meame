// RUTA: src/shared/lib/schemas/cogniread/article.schema.ts
/**
 * @file article.schema.ts
 * @description SSoT para el contrato de datos de la entidad Artículo de CogniRead.
 * @version 5.2.1 (i18n & Zod Contract Alignment)
 * @author L.I.A. Legacy
 */
import { z } from "zod";
// --- [INICIO DE CORRECCIÓN ARQUITECTÓNICA v5.2.1] ---
import { supportedLocales } from "@/shared/lib/i18n/i18n.config";
// --- [FIN DE CORRECCIÓN ARQUITECTÓNICA v5.2.1] ---

export const ArticleTranslationSchema = z.object({
  title: z.string().min(1, "El título no puede estar vacío."),
  slug: z
    .string()
    .min(1, "El slug es requerido.")
    .regex(
      /^[a-z0-9-]+$/,
      "El slug solo puede contener letras minúsculas, números y guiones."
    ),
  summary: z.string().min(1, "El resumen no puede estar vacío."),
  body: z.string().min(1, "El cuerpo del artículo no puede estar vacío."),
});

export const StudyDnaSchema = z.object({
  originalTitle: z
    .string()
    .min(1)
    .describe("ui:label:Título Original del Estudio"),
  authors: z.array(z.string().min(1)).min(1).describe("ui:label:Autores"),
  institution: z.string().min(1).describe("ui:label:Institución Principal"),
  publication: z.string().min(1).describe("ui:label:Revista o Publicación"),
  publicationDate: z
    .string()
    .datetime()
    .describe("ui:label:Fecha de Publicación"),
  doi: z.string().url().describe("ui:label:Enlace DOI"),
  fundingSource: z.string().min(1).describe("ui:label:Fuente de Financiación"),
  objective: z
    .string()
    .min(1)
    .describe("ui:label:Objetivo Principal|ui:control:textarea"),
  studyType: z.string().min(1).describe("ui:label:Tipo de Estudio"),
  methodologySummary: z
    .string()
    .min(1)
    .describe("ui:label:Resumen de Metodología|ui:control:textarea"),
  mainResults: z
    .string()
    .min(1)
    .describe("ui:label:Resultados Principales|ui:control:textarea"),
  authorsConclusion: z
    .string()
    .min(1)
    .describe("ui:label:Conclusión de los Autores|ui:control:textarea"),
  limitations: z
    .array(z.string().min(1))
    .min(1)
    .describe("ui:label:Limitaciones del Estudio"),
});

export const CogniReadArticleSchema = z.object({
  articleId: z.string().cuid2("El ID del artículo debe ser un CUID2 válido."),
  status: z.enum(["draft", "published", "archived"], {
    invalid_type_error: "El estado del artículo es inválido.",
  }),
  createdAt: z
    .string()
    .datetime(
      "La fecha de creación debe ser un formato de fecha y hora ISO válido."
    ),
  updatedAt: z
    .string()
    .datetime(
      "La fecha de actualización debe ser un formato de fecha y hora ISO válido."
    ),
  studyDna: StudyDnaSchema,
  // --- [INICIO DE CORRECCIÓN DE CONTRATO ZOD v5.2.1] ---
  content: z.record(
    z.enum(supportedLocales),
    ArticleTranslationSchema.partial()
  ),
  // --- [FIN DE CORRECCIÓN DE CONTRATO ZOD v5.2.1] ---
  tags: z
    .array(z.string())
    .optional()
    .describe("Etiquetas temáticas para búsqueda y filtrado."),
  baviHeroImageId: z
    .string()
    .refine((s) => s.includes("/"), {
      message:
        "El ID de la imagen debe ser un 'public_id' de Cloudinary (ej. 'folder/asset'), no un 'assetId' de BAVI.",
    })
    .optional()
    .describe("ID público del activo visual de BAVI para la imagen destacada."),
  relatedPromptIds: z
    .array(
      z
        .string()
        .cuid2("Los IDs de prompt relacionados deben ser CUID2 válidos.")
    )
    .optional()
    .describe("IDs de prompts de RaZPrompts relacionados con este artículo."),
});

export type CogniReadArticle = z.infer<typeof CogniReadArticleSchema>;
export type ArticleTranslation = z.infer<typeof ArticleTranslationSchema>;
export type StudyDna = z.infer<typeof StudyDnaSchema>;
