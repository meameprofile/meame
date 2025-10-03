// RUTA: src/app/[locale]/(dev)/test-page/page.tsx
/\*\*

- @file page.tsx
- @description Página de servidor para la Vitrina de Resiliencia.
-              v11.1.0 (Prettier Compliance): Refactorizado para cumplir
-              con los estándares de formato de código del proyecto.
- @version 11.1.0
- @author RaZ Podestá - MetaShark Tech
  _/
  import React from "react";
  import { getDictionary } from "@/shared/lib/i18n/i18n";
  import { type Locale } from "@/shared/lib/i18n/i18n.config";
  import { logger } from "@/shared/lib/logging";
  import { DeveloperErrorDisplay } from "@/components/features/dev-tools/";
  import TestPageClient from "./\_components/TestPageClient";
  import _ as Sections from "@/components/sections";
  import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

// Mapeo de componentes y sus claves de diccionario.
const sectionsToRender = [
{
name: "BenefitsSection",
Comp: Sections.BenefitsSection,
contentKey: "benefitsSection",
},
{
name: "CommunitySection",
Comp: Sections.CommunitySection,
contentKey: "communitySection",
},
{ name: "Hero", Comp: Sections.Hero, contentKey: "hero" },
{
name: "FaqAccordion",
Comp: Sections.FaqAccordion,
contentKey: "faqAccordion",
},
// ... Añadir aquí el resto de los componentes de sección ...
];

interface DevTestPageProps {
params: { locale: Locale };
}

export default async function DevTestPage({
params: { locale },
}: DevTestPageProps) {
logger.info("[TestPage Shell] Renderizando v11.1 (Prettier Compliance).");

try {
const { dictionary, error } = await getDictionary(locale);
if (error) throw error;

    const pageContent = dictionary.devTestPage;
    if (!pageContent) throw new Error("Contenido 'devTestPage' no encontrado.");

    // Renderizamos todos los componentes de sección aquí, en el servidor.
    const renderedSections = await Promise.all(
      sectionsToRender.map(async ({ name, Comp, contentKey }) => {
        const content = dictionary[contentKey as keyof Dictionary];
        return {
          name,
          // @ts-expect-error Las props de 'content' son dinámicas, lo manejamos.
          jsx: <Comp content={content} locale={locale} />,
        };
      })
    );

    return (
      <TestPageClient
        content={pageContent}
        renderedSections={renderedSections}
      />
    );

} catch (error) {
const errorMessage =
"Fallo crítico al cargar datos para la Vitrina de Componentes.";
logger.error(`[TestPage Shell] ${errorMessage}`, { error });
return (
<DeveloperErrorDisplay
context="DevTestPage Shell"
errorMessage={errorMessage}
errorDetails={error instanceof Error ? error : String(error)}
/>
);
}
}
