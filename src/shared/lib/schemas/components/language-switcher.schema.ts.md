// Ruta correcta: src/shared/lib/schemas/components/language-switcher.schema.ts
/\*\*

- @file language-switcher.schema.ts
- @description SSoT para el contrato de datos del contenido i18n del componente LanguageSwitcher.
-              Este aparato fue creado para resolver un error crítico de 'Module not found'.
- @version 1.0.0
- @author L.I.A Legacy - Asistente de Refactorización
  \*/
  import { z } from "zod";
  import { supportedLocales } from "@/shared/lib/i18n/i18n.config";

export const LanguageSwitcherContentSchema = z.object({
ariaLabel: z
.string()
.min(1, "La etiqueta ARIA es requerida para la accesibilidad."),
languages: z.record(z.enum(supportedLocales), z.string()),
});

export const LanguageSwitcherLocaleSchema = z.object({
languageSwitcher: LanguageSwitcherContentSchema.optional(),
});
// Ruta correcta: src/shared/lib/schemas/components/language-switcher.schema.ts
