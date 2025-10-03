// app/[locale]/(dev)/dev/campaign-suite/_actions/getTemplates.action.ts
/**
 * @file getTemplates.action.ts
 * @description Server Action para obtener la lista de plantillas disponibles.
 * @version 2.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { promises as fs } from "fs";
import path from "path";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import type { TemplateMetadata } from "@/shared/lib/schemas/templates/template.schema";
import { TemplatesManifestSchema } from "@/shared/lib/schemas/templates/template.schema";
import { logger } from "@/shared/lib/logging";

export async function getTemplatesAction(): Promise<
  ActionResult<TemplateMetadata[]>
> {
  try {
    const manifestPath = path.join(
      process.cwd(),
      "content/templates/templates.manifest.json"
    );
    const file = await fs.readFile(manifestPath, "utf-8");
    const manifest = TemplatesManifestSchema.parse(JSON.parse(file));
    return { success: true, data: manifest };
  } catch (error) {
    logger.error("No se pudieron cargar las plantillas.", { error });
    return {
      success: false,
      error: "No se pudieron cargar las plantillas desde el servidor.",
    };
  }
}
