// RUTA: src/shared/lib/schemas/components/contact-section.schema.ts
/**
 * @file contact-section.schema.ts
 * @description Esquema de Zod para el contenido i18n de la ContactSection.
 *              - v3.1.0 (Build Fix): Se elimina la llamada al logger a nivel de
 *                módulo para resolver la violación de la frontera servidor-cliente.
 * @version 3.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

import { LucideIconNameSchema } from "@/shared/lib/config/lucide-icon-names";

const ContactInfoItemSchema = z.object({
  iconName: LucideIconNameSchema,
  label: z.string(),
  value: z.string(),
});

export type ContactInfoItem = z.infer<typeof ContactInfoItemSchema>;

export const ContactSectionContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  description: z.string(),
  contactInfo: z.array(ContactInfoItemSchema),
  form: z.object({
    firstNameLabel: z.string(),
    firstNamePlaceholder: z.string(),
    lastNameLabel: z.string(),
    lastNamePlaceholder: z.string(),
    emailLabel: z.string(),
    emailPlaceholder: z.string(),
    subjectLabel: z.string(),
    subjectPlaceholder: z.string(),
    subjectOptions: z.array(z.string()),
    messageLabel: z.string(),
    messagePlaceholder: z.string(),
    submitButtonText: z.string(),
  }),
});

export const ContactSectionLocaleSchema = z.object({
  contactSection: ContactSectionContentSchema.optional(),
});
