// shared/lib/schemas/achievement.schema.ts

import { z } from "zod";

export const AchievementIdSchema = z.enum([
  "FIRST_CAMPAIGN_LAUNCH",
  "CAMPAIGN_POLYGLOT",
  "TEMPLATE_MASTER",
  "SPEED_DEMON",
]);

export type AchievementId = z.infer<typeof AchievementIdSchema>;

export const AchievementSchema = z.object({
  id: AchievementIdSchema,
  title: z.string(),
  description: z.string(),
  icon: z.string(), // Usaremos un string para el nombre del ícono de Lucide Icons
  rarity: z.enum(["common", "rare", "epic"]),
});

export type Achievement = z.infer<typeof AchievementSchema>;
