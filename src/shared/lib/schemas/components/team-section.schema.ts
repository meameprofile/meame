// RUTA: src/shared/lib/schemas/components/team-section.schema.ts
/**
 * @file team-section.schema.ts
 * @description Esquema de Zod para el contenido i18n del componente TeamSection.
 *              - v2.1.0 (Build Fix): Se elimina la llamada al logger para resolver
 *                la violación de la frontera servidor-cliente.
 * @version 2.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import { LucideIconNameSchema } from "@/shared/lib/config/lucide-icon-names";

const SocialNetworkSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  icon: LucideIconNameSchema,
});

const TeamMemberSchema = z.object({
  imageUrl: z.string().startsWith("/"),
  firstName: z.string(),
  lastName: z.string(),
  positions: z.array(z.string()),
  socialNetworks: z.array(SocialNetworkSchema),
});

export type TeamMember = z.infer<typeof TeamMemberSchema>;

/**
 * @const TeamSectionContentSchema
 * @description La SSoT para la ESTRUCTURA del contenido de la sección.
 */
export const TeamSectionContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  members: z.array(TeamMemberSchema),
});

/**
 * @const TeamSectionLocaleSchema
 * @description Valida la clave de nivel superior para un locale específico.
 */
export const TeamSectionLocaleSchema = z.object({
  teamSection: TeamSectionContentSchema.optional(),
});
