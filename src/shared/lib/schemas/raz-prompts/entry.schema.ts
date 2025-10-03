// RUTA: src/shared/lib/schemas/raz-prompts/entry.schema.ts
/**
 * @file entry.schema.ts
 * @description Schema ensamblador y SSoT para una entrada completa en RaZPrompts.
 * @version 6.0.0 (Definitive & Holistically Aligned)
 *@author RaZ Podestá - MetaShark Tech - Asistente de Refactorización
 */
import { z } from "zod";
import { PromptVersionSchema, RaZPromptsSesaTagsSchema } from "./atomic.schema";

export const RaZPromptsEntrySchema = z.object({
  // --- Metadatos de Identificación Soberana ---
  promptId: z
    .string()
    .cuid2()
    .describe(
      "El ID único y canónico de la entrada (CUID2). Mapea a la columna 'id' en la base de datos."
    ),
  userId: z
    .string()
    .uuid()
    .describe("El ID del usuario propietario (de Supabase Auth)."),
  workspaceId: z
    .string()
    .uuid()
    .describe("El ID del workspace al que pertenece la entrada."),

  // --- Datos Descriptivos y de Estado ---
  title: z
    .string()
    .min(3)
    .max(100)
    .describe("Un título legible y descriptivo para la entrada."),
  status: z
    .enum(["pending_generation", "generated", "archived"])
    .describe("El estado del ciclo de vida del prompt."),

  // --- El Genoma Creativo (Historial de Versiones) ---
  versions: z
    .array(PromptVersionSchema)
    .min(1)
    .describe("Un array con el historial de todas las versiones del prompt."),

  // --- Vínculos del Ecosistema ---
  baviAssetIds: z
    .array(z.string())
    .optional()
    .describe(
      "Array de Asset IDs de BAVI que fueron generados a partir de este prompt."
    ),

  // --- Sistema de Descubrimiento (Filtrado y Búsqueda) ---
  aiService: z
    .string()
    .describe(
      "El servicio de IA principal utilizado (ej. 'ideogram', 'midjourney')."
    ),

  /**
   * @property tags - Taxonomía SESA (Sistema de Etiquetado Semántico Atómico).
   * Este objeto estructurado se mapea a una columna JSONB en la base de datos
   * y está optimizado para un FILTRADO POR FACETAS de alto rendimiento.
   * NO se usa para búsqueda de texto libre.
   */
  tags: RaZPromptsSesaTagsSchema,

  /**
   * @property keywords - Etiquetado Semántico de Formato Libre.
   * Este array de strings se mapea a una columna TEXT[] en la base de datos
   * y está optimizado para la BÚSQUEDA por palabras clave y descubrimiento.
   */
  keywords: z.array(z.string()),

  // --- Metadatos de Organización (Roadmap v2.0) ---
  collections: z
    .array(z.string().cuid2())
    .optional()
    .describe("IDs de colecciones a las que pertenece este prompt."),

  // --- Timestamps ---
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type RaZPromptsEntry = z.infer<typeof RaZPromptsEntrySchema>;
