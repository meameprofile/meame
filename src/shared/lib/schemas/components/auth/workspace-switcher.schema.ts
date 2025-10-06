// RUTA: src/shared/lib/schemas/components/auth/workspace-switcher.schema.ts
/**
 * @file workspace-switcher.schema.ts
 * @description SSoT para el contrato de datos i18n del componente WorkspaceSwitcher.
 * @version 1.0.0
 * @author L.I.A. Legacy
 */
import { z } from "zod";

export const WorkspaceSwitcherContentSchema = z.object({
  activeWorkspaceLabel: z.string(),
  loadingText: z.string(),
  noWorkspacesTitle: z.string(),
  noWorkspacesDescription: z.string(),
  errorTitle: z.string(),
  errorDescription: z.string(),
});

export type WorkspaceSwitcherContent = z.infer<
  typeof WorkspaceSwitcherContentSchema
>;

export const WorkspaceSwitcherLocaleSchema = z.object({
  workspaceSwitcher: WorkspaceSwitcherContentSchema.optional(),
});
