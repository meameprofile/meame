// RUTA: src/components/features/campaign-suite/Step1_Structure/Step1Form.tsx
/**
 * @file Step1Form.tsx
 * @description Componente de Presentación para la UI del Paso 1 (Estructura),
 *              inyectado con una animación de entrada en cascada para una MEA/UX de élite.
 * @version 10.0.0 (MEA/UX Injection & Elite Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { motion, type Variants } from "framer-motion";
import React from "react";
import type { z } from "zod";

import { WizardNavigation } from "@/components/features/campaign-suite/_components/WizardNavigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/Card";
import { galleryConfig } from "@/shared/lib/config/campaign-suite/gallery.config";
import { logger } from "@/shared/lib/logging";
import type { Step1ContentSchema } from "@/shared/lib/schemas/campaigns/steps/step1.schema";
import type {
  HeaderConfig,
  FooterConfig,
} from "@/shared/lib/types/campaigns/draft.types";

import { StructuralSectionConfig } from "./_components";

type Step1Content = z.infer<typeof Step1ContentSchema>;

interface Step1FormProps {
  content: Step1Content;
  headerConfig: HeaderConfig;
  footerConfig: FooterConfig;
  onHeaderConfigChange: (newConfig: Partial<HeaderConfig>) => void;
  onFooterConfigChange: (newConfig: Partial<FooterConfig>) => void;
  onBack: () => void;
  onNext: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function Step1Form({
  content,
  headerConfig,
  footerConfig,
  onHeaderConfigChange,
  onFooterConfigChange,
  onBack,
  onNext,
}: Step1FormProps): React.ReactElement {
  logger.trace(
    "[Step1Form] Renderizando formulario de presentación v10.0 (MEA/UX)."
  );

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>{content.title}</CardTitle>
        <CardDescription>{content.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <StructuralSectionConfig
              switchId="use-header"
              switchLabel={content.headerSwitchLabel}
              galleryTitle={content.headerGalleryTitle}
              isEnabled={headerConfig.useHeader}
              onToggle={(checked) =>
                onHeaderConfigChange({ useHeader: checked })
              }
              galleryItems={galleryConfig.headers}
              selectedValue={headerConfig.componentName}
              onSelectionChange={(value) =>
                onHeaderConfigChange({ componentName: value })
              }
              descriptions={content.galleryDescriptions}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StructuralSectionConfig
              switchId="use-footer"
              switchLabel={content.footerSwitchLabel}
              galleryTitle={content.footerGalleryTitle}
              isEnabled={footerConfig.useFooter}
              onToggle={(checked) =>
                onFooterConfigChange({ useFooter: checked })
              }
              galleryItems={galleryConfig.footers}
              selectedValue={footerConfig.componentName}
              onSelectionChange={(value) =>
                onFooterConfigChange({ componentName: value })
              }
              descriptions={content.galleryDescriptions}
            />
          </motion.div>
        </motion.div>
      </CardContent>
      <CardFooter className="sticky bottom-0 bg-background/95 backdrop-blur-sm py-4 border-t z-10">
        <WizardNavigation onBack={onBack} onNext={onNext} />
      </CardFooter>
    </Card>
  );
}
