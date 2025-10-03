// shared/manifests/achievements.manifest.ts

import { Achievement } from "@/shared/lib/schemas/achievement.schema";

export const ACHIEVEMENTS_MANIFEST: Achievement[] = [
  {
    id: "FIRST_CAMPAIGN_LAUNCH",
    title: "¡Lanzamiento Inaugural!",
    description: "Has publicado tu primera campaña con éxito.",
    icon: "Rocket", // Nombre del ícono de lucide-react
    rarity: "common",
  },
  {
    id: "CAMPAIGN_POLYGLOT",
    title: "Creador Políglota",
    description: "Has creado una campaña con 3 o más idiomas.",
    icon: "Languages",
    rarity: "rare",
  },
  {
    id: "TEMPLATE_MASTER",
    title: "Maestro de Plantillas",
    description: "Has guardado 5 campañas como plantillas.",
    icon: "Gem",
    rarity: "rare",
  },
  {
    id: "SPEED_DEMON",
    title: "Demonio de la Velocidad",
    description: "Has creado y lanzado una campaña en menos de 15 minutos.",
    icon: "Zap",
    rarity: "epic",
  },
];

export const getAchievementById = (id: Achievement["id"]) => {
  return ACHIEVEMENTS_MANIFEST.find((ach) => ach.id === id) || null;
};
