// RUTA: src/components/features/campaign-suite/Step0_Identity/Step0Client.tsx
/**
 * @file Step0Client.tsx
 * @description Orquestador de cliente para el Paso 0.
 *              v19.0.0 (Architectural Integrity & Type Safety Restoration): Se
 *              corrige la ruta de importación de la Server Action, se erradica
 *              un tipo 'any' implícito y se purga una variable no utilizada.
 * @version 19.0.0
 * @author L.I.A. Legacy
 */
"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AnimatePresence,
  motion,
  type Variants,
  type Transition,
} from "framer-motion";
import { toast } from "sonner";
import { logger } from "@/shared/lib/logging";
import {
  step0Schema,
  type Step0Data,
  type Step0ContentSchema,
} from "@/shared/lib/schemas/campaigns/steps/step0.schema";
import { useWizard } from "@/components/features/campaign-suite/_context/WizardContext";
import { Step0Form } from "./Step0Form";
import { PassportStamp } from "@/components/ui/PassportStamp";
import { Card, CardFooter } from "@/components/ui/Card";
import { useCampaignDraft } from "@/shared/hooks/campaign-suite/use-campaign-draft.hook";
import { DeveloperErrorDisplay } from "../../dev-tools";
import { validateStep0 } from "./step0.validator";
import { WizardNavigation } from "../_components/WizardNavigation";
import { getCampaignTemplatesAction } from "@/shared/lib/actions/campaign-suite/getCampaignTemplates.action";
import { useWorkspaceStore } from "@/shared/lib/stores/use-workspace.store";
import type { CampaignTemplate } from "@/shared/lib/schemas/campaigns/template.schema";
import { normalizeStringForId } from "@/shared/lib/utils/text-processing/normalization";
import type { ActionResult } from "@/shared/lib/types/actions.types";

type Step0Content = z.infer<typeof Step0ContentSchema>;

interface Step0ClientProps {
  content: Step0Content;
  baseCampaigns: string[];
}

export function Step0Client({
  content,
  baseCampaigns,
}: Step0ClientProps): React.ReactElement {
  const { draft, updateDraft } = useCampaignDraft();
  const traceId = useMemo(
    () => logger.startTrace("Step0Client_Lifecycle_v19.0"),
    []
  );
  const [submissionState, setSubmissionState] = useState<
    "form" | "stamping" | "complete"
  >("form");
  const [templates, setTemplates] = useState<CampaignTemplate[]>([]);
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const wizardContext = useWizard();

  useEffect(() => {
    const groupId = logger.startGroup(
      `[Step0Client] Orquestador de cliente montado.`
    );
    if (activeWorkspaceId) {
      getCampaignTemplatesAction(activeWorkspaceId).then(
        (result: ActionResult<CampaignTemplate[]>) => {
          if (result.success) setTemplates(result.data);
        }
      );
    }
    return () => {
      logger.endGroup(groupId);
      logger.endTrace(traceId);
    };
  }, [traceId, activeWorkspaceId]);

  const form = useForm<Step0Data>({
    resolver: zodResolver(step0Schema),
    defaultValues: {
      campaignOrigin: draft.campaignOrigin ?? "scratch",
      templateId: draft.templateId ?? undefined,
      baseCampaignId: draft.baseCampaignId ?? baseCampaigns[0] ?? undefined,
      campaignName:
        draft.campaignName ??
        (process.env.NODE_ENV === "development"
          ? "Campaña de Prueba (Vitalidad)"
          : ""),
      seoKeywords:
        draft.seoKeywords ??
        (process.env.NODE_ENV === "development"
          ? ["bienestar", "energia", "natural"]
          : []),
      producer: draft.producer ?? "webvork",
      campaignType: draft.campaignType ?? "direct-conversion",
    },
  });

  const campaignOrigin = form.watch("campaignOrigin");
  const seoKeywordsInput = form.watch("seoKeywords");

  useEffect(() => {
    const normalizedKeywords = seoKeywordsInput.map((k) =>
      normalizeStringForId(k)
    );
    if (
      JSON.stringify(normalizedKeywords) !== JSON.stringify(seoKeywordsInput)
    ) {
      form.setValue("seoKeywords", normalizedKeywords, {
        shouldValidate: true,
      });
    }
  }, [seoKeywordsInput, form]);

  const onSubmit = (data: Step0Data) => {
    const { isValid, message } = validateStep0(data);
    if (!isValid) {
      toast.error("Formulario Incompleto", { description: message });
      return;
    }

    const finalData = {
      ...data,
      campaignName: normalizeStringForId(data.campaignName || ""),
      seoKeywords: data.seoKeywords.map(normalizeStringForId).filter(Boolean),
    };

    const newCompletedSteps = Array.from(new Set([...draft.completedSteps, 0]));
    updateDraft({ ...finalData, completedSteps: newCompletedSteps });
    setSubmissionState("stamping");
  };

  const handleNavigation = useCallback(() => {
    if (submissionState === "stamping") {
      const timer = setTimeout(() => setSubmissionState("complete"), 2000);
      return () => clearTimeout(timer);
    }
    if (submissionState === "complete") {
      if (wizardContext) wizardContext.goToNextStep();
    }
  }, [submissionState, wizardContext]);

  useEffect(() => {
    const cleanup = handleNavigation();
    return cleanup;
  }, [handleNavigation]);

  if (!wizardContext) {
    return (
      <DeveloperErrorDisplay
        context="Step0Client"
        errorMessage="Renderizado fuera de WizardProvider."
      />
    );
  }

  const transitionConfig: Transition = { duration: 0.3, ease: "easeInOut" };
  const animationVariants: Variants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
  };

  return (
    <AnimatePresence mode="wait">
      {submissionState === "form" && (
        <motion.div
          key="form"
          variants={animationVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transitionConfig}
        >
          <Card>
            <Step0Form
              form={form}
              content={content}
              baseCampaigns={baseCampaigns}
              templates={templates}
              campaignOrigin={campaignOrigin}
            />
            <CardFooter>
              <WizardNavigation
                onNext={form.handleSubmit(onSubmit)}
                onBack={() => {}}
                isFirstStep={true}
              />
            </CardFooter>
          </Card>
        </motion.div>
      )}
      {submissionState === "stamping" && (
        <motion.div
          key="stamping"
          variants={animationVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transitionConfig}
        >
          <Card>
            <div className="pt-6 min-h-[500px] flex items-center justify-center relative overflow-hidden">
              <PassportStamp label={content.passportStampLabel} />
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
