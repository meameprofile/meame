// RUTA: src/components/features/campaign-suite/Step0_Identity/Step0Form.tsx
/**
 * @file Step0Form.tsx
 * @description Componente de Presentación para el formulario del Paso 0, ahora
 *              inyectado con una animación de entrada en cascada para una MEA/UX de élite.
 * @version 8.0.0 (MEA/UX Injection & Elite Compliance)
 * @author L.I.A. Legacy
 */
"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { motion, type Variants } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/Card";
import { Form } from "@/components/ui/Form";
import { logger } from "@/shared/lib/logging";
import {
  type Step0Data,
  type Step0ContentSchema,
} from "@/shared/lib/schemas/campaigns/steps/step0.schema";
import { CampaignSelectField, VariantInputField } from "../_components/shared";
import { WizardNavigation } from "@/components/features/campaign-suite/_components/WizardNavigation";
import { producersConfig } from "@/shared/lib/config/campaign-suite/producers.config";

type Step0Content = z.infer<typeof Step0ContentSchema>;

interface Step0FormProps {
  form: UseFormReturn<Step0Data>;
  content: Step0Content;
  baseCampaigns: string[];
  onSubmit: (data: Step0Data) => void;
}

const formVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

export function Step0Form({
  form,
  content,
  baseCampaigns,
  onSubmit,
}: Step0FormProps): React.ReactElement {
  logger.trace(
    "[Step0Form] Renderizando formulario de presentación v8.0 (MEA/UX)."
  );

  const selectedProducer = form.watch("producer");
  const campaignTypeOptions =
    producersConfig.find((p) => p.id === selectedProducer)
      ?.supportedCampaignTypes || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{content.title}</CardTitle>
        <CardDescription>{content.description}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <motion.div
              className="space-y-8"
              variants={formVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fieldVariants}>
                <CampaignSelectField
                  control={form.control}
                  name="producer"
                  label={content.producerLabel}
                  placeholder={content.producerPlaceholder}
                  options={producersConfig.map((p) => ({
                    value: p.id,
                    label: p.name,
                  }))}
                />
              </motion.div>
              <motion.div variants={fieldVariants}>
                <CampaignSelectField
                  control={form.control}
                  name="campaignType"
                  label={content.campaignTypeLabel}
                  placeholder={content.campaignTypePlaceholder}
                  options={campaignTypeOptions.map((t) => ({
                    value: t.id,
                    label: t.name,
                  }))}
                />
              </motion.div>
              <motion.div variants={fieldVariants}>
                <CampaignSelectField
                  control={form.control}
                  name="baseCampaignId"
                  label={content.baseCampaignLabel}
                  placeholder={content.baseCampaignPlaceholder}
                  description={content.baseCampaignDescription}
                  options={baseCampaigns.map((id) => ({
                    value: id,
                    label: `Campaña ${id}`,
                  }))}
                />
              </motion.div>
              <motion.div variants={fieldVariants}>
                <VariantInputField
                  control={form.control}
                  name="variantName"
                  label={content.variantNameLabel}
                  placeholder={content.variantNamePlaceholder}
                />
              </motion.div>
              <motion.div variants={fieldVariants}>
                <VariantInputField
                  control={form.control}
                  name="seoKeywords"
                  label={content.seoKeywordsLabel}
                  placeholder={content.seoKeywordsPlaceholder}
                  description={content.seoKeywordsDescription}
                />
              </motion.div>
            </motion.div>
          </CardContent>
          <CardFooter>
            <WizardNavigation
              onNext={form.handleSubmit(onSubmit)}
              onBack={() => {}}
            />
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
