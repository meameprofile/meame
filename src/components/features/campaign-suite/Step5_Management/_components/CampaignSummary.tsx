// RUTA: src/components/features/campaign-suite/Step5_Management/_components/CampaignSummary.tsx
/**
 * @file CampaignSummary.tsx
 * @description Aparato atómico para la vista de resumen, alineado con el contrato de CampaignDraft v7.0+.
 * @version 2.1.0 (CampaignDraft v7.0 Contract Alignment)
 * @author L.I.A. Legacy
 */
"use client";

import React from "react";
import { motion } from "framer-motion";
import { logger } from "@/shared/lib/logging";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { DynamicIcon } from "@/components/ui";

interface CampaignSummaryProps {
  draft: CampaignDraft;
  title: string;
  placeholder: string;
}

const SummaryItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) => (
  <p>
    {label}:{" "}
    <span className="font-mono text-sm text-foreground">{value || "N/A"}</span>
  </p>
);

export function CampaignSummary({
  draft,
  title,
  placeholder,
}: CampaignSummaryProps): React.ReactElement {
  logger.trace("[CampaignSummary] Renderizando resumen de campaña v2.1.");

  const hasHeader = draft.headerConfig?.useHeader;
  const headerName = draft.headerConfig?.componentName;
  const hasFooter = draft.footerConfig?.useFooter;
  const footerName = draft.footerConfig?.componentName;
  const numSections = draft.layoutConfig?.length || 0;
  const themeConfigured =
    draft.themeConfig?.colorPreset &&
    draft.themeConfig.fontPreset &&
    draft.themeConfig.radiusPreset;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{placeholder}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-semibold text-foreground flex items-center mb-2">
              <DynamicIcon name="Fingerprint" className="h-4 w-4 mr-2" />
              Identificación
            </h4>
            <div className="pl-6 border-l space-y-1">
              <SummaryItem label="ID Base" value={draft.baseCampaignId} />
              <SummaryItem label="Nombre Campaña" value={draft.campaignName} />
              <SummaryItem
                label="Keywords"
                value={draft.seoKeywords.join(", ")}
              />
              {/* --- FIN --- */}
              <SummaryItem label="Productor" value={draft.producer} />
              <SummaryItem label="Tipo" value={draft.campaignType} />
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground flex items-center mb-2">
              <DynamicIcon name="Layers3" className="h-4 w-4 mr-2" />
              Estructura
            </h4>
            <div className="pl-6 border-l space-y-1">
              <SummaryItem
                label="Header"
                value={hasHeader ? headerName : "No Incluido"}
              />
              <SummaryItem
                label="Footer"
                value={hasFooter ? footerName : "No Incluido"}
              />
              <SummaryItem label="Secciones" value={numSections} />
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground flex items-center mb-2">
              <DynamicIcon name="Palette" className="h-4 w-4 mr-2" />
              Tema Visual
            </h4>
            <div className="pl-6 border-l space-y-1">
              {themeConfigured ? (
                <>
                  <SummaryItem
                    label="Colores"
                    value={draft.themeConfig?.colorPreset}
                  />
                  <SummaryItem
                    label="Fuentes"
                    value={draft.themeConfig?.fontPreset}
                  />
                  <SummaryItem
                    label="Geometría"
                    value={draft.themeConfig?.radiusPreset}
                  />
                </>
              ) : (
                <p>No configurado</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
