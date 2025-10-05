// RUTA: src/shared/lib/schemas/pages/dev-user-intelligence.schema.ts
/**
 * @file dev-user-intelligence.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n del dominio de
 *              Inteligencia de Usuarios en el DCC.
 * @version 1.0.0
 * @author L.I.A. Legacy
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

export const UserIntelligenceLocaleSchema = z.object({
  userIntelligencePage: UserIntelligenceContentSchema.optional(),
});
