// RUTA: shared/lib/types/react-tilt.d.ts
/**
 * @file react-tilt.d.ts
 * @description Archivo de declaración de tipos para react-tilt.
 *              v1.1.0 (Module Load Observability): Se añade un log de traza
 *              al inicio del módulo para confirmar su carga, cumpliendo con el
 *              Pilar III de Observabilidad.
 * @version 1.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { logger } from "@/shared/lib/logging"; // Importa el logger
import { Component, HTMLProps } from "react";

// --- INICIO DE MEJORA: OBSERVABILIDAD DE CARGA DE MÓDULO ---
logger.trace(
  "[react-tilt.d.ts] Módulo de declaración de tipos 'react-tilt' cargado y listo para usar."
);
// --- FIN DE MEJORA: OBSERVABILIDAD DE CARGA DE MÓDULO ---

declare module "react-tilt" {
  interface TiltProps extends HTMLProps<HTMLDivElement> {
    options?: {
      max?: number;
      scale?: number;
      speed?: number;
      glare?: boolean;
      "max-glare"?: number;
      perspective?: number;
      easing?: string;
      reset?: boolean;
    };
  }

  export class Tilt extends Component<TiltProps> {}
}
