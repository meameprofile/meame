// RUTA: src/shared/lib/schemas/pages/dev-user-intelligence.i18n.schema.ts
/**
 * @file dev-user-intelligence.i18n.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n del dominio de
 *              Inteligencia de Usuarios en el DCC.
 * @version 1.1.0 (Sovereign Type Export)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import { PageHeaderContentSchema } from "@/shared/lib/schemas/components/page-header.schema";

export const UserIntelligenceContentSchema = z.object({
  pageHeader: PageHeaderContentSchema,
  tableHeaders: z.object({
    user: z.string(),
    userType: z.string(),
    firstSeen: z.string(),
    lastSeen: z.string(),
    totalEvents: z.string(),
    actions: z.string(),
  }),
  userTypes: z.object({
    Registered: z.string(),
    Anonymous: z.string(),
  }),
  viewProfileButton: z.string(),
  emptyStateTitle: z.string(),
  emptyStateDescription: z.string(),
  pagination: z.object({
    previous: z.string(),
    next: z.string(),
    pageInfo: z.string().includes("{{currentPage}}").includes("{{totalPages}}"),
  }),
});

// --- [INICIO DE REFACTORIZACIÓN DE CONTRATO SOBERANO v1.1.0] ---
// Se exporta el tipo inferido para que los consumidores puedan importarlo
// de forma segura, sin mezclar valores de runtime con tipos de compile-time.
export type UserIntelligenceContent = z.infer<
  typeof UserIntelligenceContentSchema
>;
// --- [FIN DE REFACTORIZACIÓN DE CONTRATO SOBERANO v1.1.0] ---

export const UserIntelligenceLocaleSchema = z.object({
  userIntelligencePage: UserIntelligenceContentSchema.optional(),
});
