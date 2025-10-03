// RUTA: src/components/razBits/MagicBento/MagicBento.tsx
/**
 * @file MagicBento.tsx
 * @description Orquestador de élite para la sección MagicBento.
 *              v5.0.0 (Atomic Refactor): Refactorizado a un orquestador puro que
 *              valida el contenido y delega el renderizado al componente de trabajo
 *              `MagicBentoGrid`, resolviendo una violación crítica de las Reglas de los Hooks.
 * @version 5.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import { MagicBentoConfigSchema } from "./magic-bento.schema";
import { logger } from "@/shared/lib/logging";
import { MagicBentoGrid } from "./MagicBentoGrid"; // <-- Importa el nuevo componente de trabajo

interface MagicBentoProps {
  content?: Dictionary["magicBento"];
  className?: string;
}

export function MagicBento({
  content,
  className,
}: MagicBentoProps): React.ReactElement | null {
  logger.info("[MagicBento] Renderizando orquestador v5.0.");

  // La guardia de resiliencia y el retorno temprano permanecen aquí, en el orquestador.
  if (!content) {
    logger.warn("[MagicBento] No se proporcionó contenido. No se renderizará.");
    return null;
  }

  const { config, cards } = content;
  const validatedConfig = MagicBentoConfigSchema.parse(config || {});

  // El orquestador ahora delega el renderizado y la lógica de interacción.
  return (
    <MagicBentoGrid
      cards={cards}
      config={validatedConfig}
      className={className}
    />
  );
}
// RUTA: src/components/razBits/MagicBento/MagicBento.tsx
