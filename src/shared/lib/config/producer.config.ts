// RUTA: src/shared/lib/config/producer.config.ts
/**
 * @file producer.config.ts
 * @description SSoT para la configuración del productor (Webvork).
 *              v4.1.0 (Isomorphic Fix): Se elimina la directiva "server-only"
 *              para permitir el acceso seguro a variables NEXT_PUBLIC_ en el cliente.
 * @version 4.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { logger } from "@/shared/lib/logging";

// SSoT del Contrato de Datos para la Configuración
interface ProducerConfig {
  ACTION_URL: string;
  LANDING_ID: string;
  OFFER_ID: string;
  TRACKING_ENABLED: boolean;
  TRACKING: {
    YANDEX_METRIKA_ID: string | null;
    GOOGLE_ANALYTICS_ID: string | null;
    TRUFFLE_PIXEL_ID: string | null;
  };
}

let producerConfigCache: ProducerConfig | null = null;

/**
 * @function getProducerConfig
 * @description Lee las variables de entorno una sola vez (lazy initialization)
 *              y las devuelve como un objeto de configuración estructurado.
 * @returns {ProducerConfig} El objeto de configuración del productor.
 */
export function getProducerConfig(): ProducerConfig {
  if (producerConfigCache) {
    return producerConfigCache;
  }

  logger.trace("[ProducerConfig] Inicializando configuración del productor...");

  producerConfigCache = {
    ACTION_URL: process.env.NEXT_PUBLIC_PRODUCER_ACTION_URL || "",
    LANDING_ID: process.env.NEXT_PUBLIC_LANDING_ID || "",
    OFFER_ID: process.env.NEXT_PUBLIC_OFFER_ID || "",
    TRACKING_ENABLED:
      process.env.NEXT_PUBLIC_PRODUCER_TRACKING_ENABLED === "enabled",
    TRACKING: {
      YANDEX_METRIKA_ID: process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || null,
      GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || null,
      TRUFFLE_PIXEL_ID: process.env.NEXT_PUBLIC_TRUFFLE_PIXEL_ID || null,
    },
  };

  return producerConfigCache;
}
