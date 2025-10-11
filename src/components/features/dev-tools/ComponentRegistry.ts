// RUTA: src/components/features/dev-tools/ComponentRegistry.ts
/**
 * @file ComponentRegistry.ts
 * @description SSoT para el registro de componentes del Developer Command Center.
 *              Este manifiesto es la única fuente de verdad que mapea un nombre
 *              de componente a su ruta de archivo y su clave de contenido i18n.
 * @version 2.0.0 (Architectural Realignment)
 * @author RaZ Podestá - MetaShark Tech
 */
import { logger } from "@/shared/lib/logging";

logger.trace(
  "[ComponentRegistry] Módulo de registro de componentes cargado (v2.0)."
);

/**
 * @interface ComponentRegistryEntry
 * @description Define el contrato de datos para una entrada en el registro.
 */
export interface ComponentRegistryEntry {
  name: string;
  componentPath: string;
  dictionaryKey: string;
  isCampaignComponent: boolean;
}

/**
 * @const componentRegistry
 * @description El registro soberano de todos los componentes disponibles en el Dev Canvas.
 */
export const componentRegistry: Record<string, ComponentRegistryEntry> = {
  Header: {
    name: "Header (Global)",
    componentPath: "@/components/layout/Header",
    dictionaryKey: "header",
    isCampaignComponent: false,
  },
  Footer: {
    name: "Footer (Global)",
    componentPath: "@/components/layout/Footer",
    dictionaryKey: "footer",
    isCampaignComponent: false,
  },
  ScrollingBanner: {
    name: "ScrollingBanner (Global)",
    componentPath: "@/components/layout/ScrollingBanner",
    dictionaryKey: "scrollingBanner",
    isCampaignComponent: false,
  },
  Hero: {
    name: "Hero Section (Campaña)",
    componentPath: "@/components/sections/Hero",
    dictionaryKey: "hero",
    isCampaignComponent: true,
  },
  BenefitsSection: {
    name: "Benefits Section (Campaña)",
    componentPath: "@/components/sections/BenefitsSection",
    dictionaryKey: "benefitsSection",
    isCampaignComponent: true,
  },
  Dock: {
    name: "Dock (razBit - Global)",
    componentPath: "@/components/razBits/Dock/Dock",
    dictionaryKey: "dock",
    isCampaignComponent: false,
  },
  LightRays: {
    name: "LightRays (razBit - Global)",
    componentPath: "@/components/razBits/LightRays/LightRays",
    dictionaryKey: "lightRays",
    isCampaignComponent: false,
  },
};

/**
 * @function getComponentByName
 * @description Obtiene una entrada del registro por su nombre clave (key).
 * @param {string} name - El nombre clave del componente (ej. "Header").
 * @returns {ComponentRegistryEntry | undefined} La entrada del registro o undefined si no se encuentra.
 */
export function getComponentByName(
  name: string
): ComponentRegistryEntry | undefined {
  return componentRegistry[name];
}

/**
 * @function getComponentList
 * @description Devuelve una lista simplificada de todos los componentes registrados,
 *              ideal para poblar menús de selección en la UI.
 * @returns {Array<{ key: string; name: string }>}
 */
export function getComponentList(): { key: string; name: string }[] {
  return Object.entries(componentRegistry).map(([key, value]) => ({
    key,
    name: value.name,
  }));
}
