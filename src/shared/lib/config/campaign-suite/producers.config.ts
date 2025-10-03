// RUTA: src/shared/lib/config/campaign-suite/producers.config.ts
/**
 * @file producers.config.ts
 * @description SSoT para la configuración de proveedores y tipos de campaña. Define
 *              la lógica de negocio para la modularización de la SDC.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { logger } from "@/shared/lib/logging";

// Pilar III (Observabilidad): Se traza la carga de este módulo de configuración crítico.
logger.trace(
  "[Producers Config] Módulo de configuración de proveedores cargado."
);

/**
 * @interface ProducerConfig
 * @description Contrato de tipo para la configuración de un único proveedor.
 */
export interface ProducerConfig {
  id: string;
  name: string;
  supportedCampaignTypes: {
    id: string;
    name: string;
  }[];
}

/**
 * @const producersConfig
 * @description El manifiesto inmutable de todos los proveedores soportados por la SDC.
 */
export const producersConfig: readonly ProducerConfig[] = [
  {
    id: "webvork",
    name: "Webvork",
    supportedCampaignTypes: [
      { id: "direct-sale", name: "Venta Directa (Formulario)" },
      { id: "presell-quiz", name: "Página de Quiz (Presell)" },
    ],
  },
  {
    id: "clickbank",
    name: "ClickBank",
    supportedCampaignTypes: [
      { id: "presell-article", name: "Artículo (Presell)" },
      { id: "vsl", name: "Página de VSL" },
    ],
  },
  {
    id: "shopify",
    name: "Shopify",
    supportedCampaignTypes: [
      { id: "product-launch", name: "Lanzamiento de Producto" },
    ],
  },
] as const;
