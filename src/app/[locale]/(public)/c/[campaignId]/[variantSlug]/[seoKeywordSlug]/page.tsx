// RUTA: src/app/[locale]/(public)/c/[campaignId]/[variantSlug]/[seoKeywordSlug]/page.tsx
/**
 * @file page.tsx
 * @description SSoT para el renderizado de campañas. Forjado con seguridad de
 *              tipos absoluta, erradicando el error de indexación por 'symbol'.
 * @version 12.1.0 (Logger v20+ Contract Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { logger } from "@/shared/lib/logging";
import { getCampaignData } from "@/shared/lib/i18n/campaign.i18n";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { CampaignThemeProvider } from "@/components/layout/CampaignThemeProvider";
import { SectionAnimator } from "@/components/layout/SectionAnimator";
import { AuraTrackerInitializer } from "@/components/features/analytics/AuraTrackerInitializer";
import {
  sectionsConfig,
  type SectionName,
} from "@/shared/lib/config/sections.config";
import { ValidationError } from "@/components/ui/ValidationError";
import type { SectionProps } from "@/shared/lib/types/sections.types";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

type AnySectionComponent = React.ComponentType<SectionProps<keyof Dictionary>>;

interface CampaignPageProps {
  params: {
    locale: Locale;
    campaignId: string;
    variantSlug: string;
    seoKeywordSlug: string;
  };
}

export async function generateMetadata({
  params,
}: CampaignPageProps): Promise<Metadata> {
  const { locale, campaignId, variantSlug } = params;
  const traceId = logger.startTrace(
    `generateMetadata:${campaignId}-${variantSlug}`
  );
  logger.traceEvent(traceId, `[Metadata] Generando metadatos para campaña...`);

  try {
    const { dictionary } = await getCampaignData(
      campaignId,
      locale,
      variantSlug
    );
    const heroContent = dictionary.hero;
    return {
      title: heroContent?.title || "Campaña Especial",
      description:
        heroContent?.subtitle || "Descubre nuestra oferta exclusiva.",
    };
  } catch (error) {
    logger.error(`[Metadata] Fallo al generar metadatos.`, {
      params,
      error,
      traceId,
    });
    return {
      title: "Error",
      description: "No se pudo cargar la información de la campaña.",
    };
  } finally {
    logger.endTrace(traceId);
  }
}

export default async function CampaignPage({ params }: CampaignPageProps) {
  const { locale, campaignId, variantSlug } = params;
  const traceId = logger.startTrace(
    `CampaignPage_v12.1:${campaignId}-${variantSlug}`
  );
  const groupId = logger.startGroup(
    `[CampaignPage Shell] Ensamblando v12.1 para: ${variantSlug}`
  );

  try {
    const { dictionary, theme } = await getCampaignData(
      campaignId,
      locale,
      variantSlug
    );
    logger.traceEvent(traceId, "Datos de campaña y tema obtenidos con éxito.");

    if (!theme.layout?.sections || theme.layout.sections.length === 0) {
      logger.warn(
        `[Guardián] No se encontraron secciones de layout para la variante.`,
        { traceId }
      );
      return notFound();
    }

    const renderedSections = theme.layout.sections
      .map((section, index) => {
        const sectionName = section.name as SectionName;
        const config = sectionsConfig[sectionName];

        if (!config) {
          logger.warn(
            `[Guardián] Configuración no encontrada para la sección: ${sectionName}`,
            { traceId }
          );
          return null;
        }

        const Component = config.component as AnySectionComponent;

        const contentData = (dictionary as Record<string, unknown>)[
          config.dictionaryKey
        ];

        const validation = config.schema.safeParse(contentData);

        if (!validation.success) {
          logger.error(
            `[Guardián de Contrato] Fallo de validación para la sección "${sectionName}".`,
            { error: validation.error.flatten(), traceId }
          );
          if (process.env.NODE_ENV === "development") {
            return (
              <ValidationError
                key={`${sectionName}-${index}-error`}
                sectionName={sectionName}
                error={validation.error}
                content={dictionary.validationError!}
              />
            );
          }
          return null;
        }

        const componentProps = {
          content: validation.data,
          locale: locale,
        };

        return (
          <Component key={`${sectionName}-${index}`} {...componentProps} />
        );
      })
      .filter(Boolean);

    logger.success(
      `[CampaignPage Shell] ${renderedSections.length} secciones ensambladas con éxito.`,
      { traceId }
    );

    return (
      <CampaignThemeProvider theme={theme}>
        <AuraTrackerInitializer
          scope="visitor"
          campaignId={campaignId}
          variantId={variantSlug}
        />
        <SectionAnimator>{renderedSections}</SectionAnimator>
      </CampaignThemeProvider>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(`[CampaignPage] Error crítico al renderizar.`, {
      params,
      error: errorMessage,
      traceId,
    });
    return notFound();
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
