// RUTA: src/shared/lib/schemas/campaigns/steps/step5.schema.ts
/**
 * @file step5.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n del Paso 5.
 * @version 2.2.0 (Artifact History Content Object)
 *@author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const Step5ContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  summaryTitle: z.string(),
  summaryPlaceholder: z.string(),
  checklistTitle: z.string(),
  // --- [INICIO DE REFACTORIZACIÓN DE CONTRATO] ---
  // La clave ahora es un objeto que contiene todo el contenido necesario.
  artifactHistory: z.object({
    title: z.string(),
    loadingHistoryText: z.string(),
    emptyStateText: z.string(),
    downloadButtonText: z.string(),
    downloadingButtonText: z.string(),
    errorLoadingHistory: z.string(),
    errorDownloading: z.string(),
  }),
  // --- [FIN DE REFACTORIZACIÓN DE CONTRATO] ---
  publishButtonText: z.string(),
  packageButtonText: z.string(),
  deleteButtonText: z.string(),
  templateButtonText: z.string(),
  deleteDialog: z.object({
    title: z.string(),
    description: z.string(),
    cancelButton: z.string(),
    confirmButton: z.string(),
    draftNameLabel: z.string(),
    confirmationTextLabel: z.string(),
    confirmationTextPlaceholder: z.string(),
  }),
  templateDialog: z.object({
    title: z.string(),
    description: z.string(),
    nameLabel: z.string(),
    namePlaceholder: z.string(),
    descriptionLabel: z.string(),
    descriptionPlaceholder: z.string(),
    saveButton: z.string(),
    cancelButton: z.string(),
  }),
});
