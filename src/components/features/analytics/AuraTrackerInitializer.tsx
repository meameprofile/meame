// RUTA: src/components/features/analytics/AuraTrackerInitializer.tsx
/**
 * @file AuraTrackerInitializer.tsx
 * @description Componente de cliente "headless" para inicializar el tracker de "Aura".
 * @version 2.1.0 (React Hooks Compliance)
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useAuraTracker } from "@/shared/hooks/analytics/use-aura-tracker";
import { logger } from "@/shared/lib/logging";

interface AuraTrackerInitializerProps {
  scope: "user" | "visitor";
  campaignId?: string;
  variantId?: string;
}

export function AuraTrackerInitializer({
  scope,
  campaignId,
  variantId,
}: AuraTrackerInitializerProps) {
  // --- [INICIO DE REFACTORIZACIÓN DE ÉLITE: CUMPLIMIENTO DE REGLAS DE HOOKS] ---
  // La lógica condicional ahora determina si el hook debe estar habilitado.
  const isTrackerEnabled =
    scope === "user" || (scope === "visitor" && !!campaignId && !!variantId);

  if (!isTrackerEnabled && scope === "visitor") {
    logger.warn(
      "[AuraTrackerInitializer] El scope 'visitor' requiere campaignId y variantId. El tracker no se activará."
    );
  }

  // La llamada al hook ahora es incondicional, y su lógica interna se controla
  // a través de la prop 'enabled'.
  useAuraTracker({ scope, campaignId, variantId, enabled: isTrackerEnabled });
  // --- [FIN DE REFACTORIZACIÓN DE ÉLITE] ---

  return null;
}
