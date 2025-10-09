// RUTA: src/shared/lib/config/campaign-suite/producers.config.ts
/**
 * @file producers.config.ts
 * @description SSoT para la configuración de productores y la nueva nomenclatura soberana de tipos de campaña.
 * @version 2.0.0 (Sovereign Campaign Type Nomenclature)
 * @author RaZ Podestá - MetaShark Tech
 */
import { logger } from "@/shared/lib/logging";

logger.trace(
  "[Producers Config] Módulo de configuración de productores v2.0 cargado."
);

/**
 * @interface CampaignType
 * @description Contrato para un tipo de campaña soportado.
 * @property {string} id - Identificador técnico único.
 * @property {string} nameKey - Clave i18n para el nombre descriptivo en la UI.
 *
 * @nomenclature
 * La nomenclatura de 'id' está inspirada en los objetivos de campaña de plataformas
 * líderes (Google, Meta) pero adaptada a nuestro ecosistema:
 * - `direct-conversion`: Campañas enfocadas en una acción inmediata (venta, CPL). Similar a "Sales" o "Conversions".
 * - `lead-generation`: Campañas cuyo objetivo principal es la captura de datos (ej. quizzes). Similar a "Leads".
 * - `content-engagement`: Campañas de pre-venta que educan o entretienen antes de la conversión (artículos, VSLs). Similar a "Consideration" o "Engagement".
 */
export interface CampaignType {
  id: string;
  nameKey: string;
}

export interface ProducerConfig {
  id: string;
  nameKey: string;
  supportedCampaignTypes: readonly CampaignType[];
}

export const producersConfig: readonly ProducerConfig[] = [
  {
    id: "webvork",
    nameKey: "producer_webvork",
    supportedCampaignTypes: [
      { id: "direct-conversion", nameKey: "campaignType_direct_conversion" },
      {
        id: "lead-generation-quiz",
        nameKey: "campaignType_lead_generation_quiz",
      },
    ],
  },
  {
    id: "clickdealer",
    nameKey: "producer_clickdealer",
    supportedCampaignTypes: [
      { id: "direct-conversion", nameKey: "campaignType_direct_conversion" },
      {
        id: "content-engagement-vsl",
        nameKey: "campaignType_content_engagement_vsl",
      },
    ],
  },
  {
    id: "maxbounty",
    nameKey: "producer_maxbounty",
    supportedCampaignTypes: [
      {
        id: "lead-generation-form",
        nameKey: "campaignType_lead_generation_form",
      },
      {
        id: "direct-conversion-cpa",
        nameKey: "campaignType_direct_conversion_cpa",
      },
    ],
  },
  {
    id: "clickbank",
    nameKey: "producer_clickbank",
    supportedCampaignTypes: [
      {
        id: "content-engagement-article",
        nameKey: "campaignType_content_engagement_article",
      },
      {
        id: "content-engagement-vsl",
        nameKey: "campaignType_content_engagement_vsl",
      },
    ],
  },
  {
    id: "moreniche",
    nameKey: "producer_moreniche",
    supportedCampaignTypes: [
      {
        id: "direct-conversion-cps",
        nameKey: "campaignType_direct_conversion_cps",
      },
    ],
  },
  {
    id: "shopify",
    nameKey: "producer_shopify",
    supportedCampaignTypes: [
      { id: "product-launch", nameKey: "campaignType_product_launch" },
    ],
  },
] as const;
