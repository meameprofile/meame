// src/components/dev/ComponentRegistry.ts
/**
 * @file ComponentRegistry.ts
 * @description SSoT para el entorno de desarrollo de componentes.
 *              ACTUALIZACIÓN: Añadida la propiedad booleana `isCampaignComponent`
 *              para permitir que el `ComponentLoader` distinga entre componentes
 *              globales y componentes que dependen de datos de campaña.
 * @version 1.5.0
 * @author RaZ Podestá - MetaShark Tech
 */
export interface ComponentRegistryEntry {
  name: string;
  componentPath: string;
  dictionaryKey: string;
  isCampaignComponent: boolean; // <<-- NUEVA PROPIEDAD
}

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

export function getComponentByName(
  name: string
): ComponentRegistryEntry | undefined {
  return componentRegistry[name];
}

export function getComponentList(): Array<{ key: string; name: string }> {
  return Object.entries(componentRegistry).map(([key, value]) => ({
    key,
    name: value.name,
  }));
}
// src/components/dev/ComponentRegistry.ts
