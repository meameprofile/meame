// RUTA: src/shared/lib/config/strategic-combos.config.ts
/**
 * @file strategic-combos.config.ts
 * @description SSoT para la definición de los Combos Estratégicos.
 * @version 2.1.0 (Type-Safe Icon Contract)
 * @author RaZ Podestá - MetaShark Tech
 */
import type { LucideIconName } from "./lucide-icon-names"; // <-- IMPORTACIÓN SOBERANA
import type { SectionName } from "./sections.config";

export interface StrategicCombo {
  id: string;
  name: string;
  description: string;
  icon: LucideIconName; // <-- CONTRATO DE TIPO REFORZADO
  sections: readonly SectionName[];
}

export const strategicCombos: readonly StrategicCombo[] = [
  {
    id: "lead-magnet-basic",
    name: "Combo: Imán de Leads",
    description: "¡Perfecto para capturar el interés y convertir!",
    icon: "Magnet",
    sections: ["Hero", "FeaturesSection", "OrderSection"],
  },
  {
    id: "social-proof-power",
    name: "Combo: Prueba Social",
    description: "¡Genera confianza mostrando testimonios!",
    icon: "Users",
    sections: ["Hero", "TestimonialGrid", "OrderSection"],
  },
  {
    id: "knowledge-authority",
    name: "Combo: Autoridad",
    description: "¡Establece tu experticia y luego convierte!",
    icon: "BookMarked",
    sections: ["Hero", "FaqAccordion", "OrderSection"],
  },
] as const;
