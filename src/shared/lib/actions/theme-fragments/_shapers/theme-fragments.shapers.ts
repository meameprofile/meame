// RUTA: src/shared/lib/actions/theme-fragments/_shapers/theme-fragments.shapers.ts
/**
 * @file theme-fragments.shapers.ts
 * @description SSoT para la transformación de datos del dominio Theme Fragments.
 * @version 2.0.0 (Elite Observability)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import {
  ThemeFragmentSchema,
  type ThemeFragment,
} from "@/shared/lib/actions/theme-fragments/getThemeFragments.action";
import type { ThemeFragmentRow } from "@/shared/lib/schemas/theme-fragments/theme-fragments.contracts";
import { logger } from "@/shared/lib/logging";

export function mapSupabaseToThemeFragment(
  row: ThemeFragmentRow,
  traceId?: string
): ThemeFragment {
  logger.trace(`[Shaper] Transformando ThemeFragmentRow: ${row.id}`, {
    traceId,
  });
  const transformed = {
    id: row.id,
    workspace_id: row.workspace_id,
    user_id: row.user_id,
    name: row.name,
    type: row.type,
    data: row.data as Record<string, unknown>,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
  return ThemeFragmentSchema.parse(transformed);
}
