// RUTA: src/shared/lib/schemas/entities/workspace.schema.ts
/**
 * @file workspace.schema.ts
 * @description SSoT para el contrato de datos de la entidad Workspace.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const WorkspaceSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

export type Workspace = z.infer<typeof WorkspaceSchema>;
