// RUTA: src/components/features/campaign-suite/Step0_Identity/Step0Client.tsx
/**
 * @file Step0Client.tsx
 * @description Orquestador de cliente para el Paso 0, nivelado con
 *              observabilidad Heimdall y Guardianes de Resiliencia y Validación.
 * @version 14.1.0 (Hook Declaration Order Fix)
 * @author RaZ Podestá - MetaShark Tech
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
import { Card, CardContent } from "@/components/ui/Card";
import { useCampaignDraft } from "@/shared/hooks/campaign-suite/use-campaign-draft.hook";
import { DeveloperErrorDisplay } from "../../dev-tools";
import { validateStep0 } from "./step0.validator";

type Step0Content = z.infer<typeof Step0ContentSchema>;

interface Step0ClientProps {
  content: Step0Content;
  baseCampaigns: string[];
}

export function Step0Client({
  content,
  baseCampaigns,
}: Step0ClientProps): React.ReactElement {
  // --- [INICIO] REFACTORIZACIÓN ARQUITECTÓNICA: ORDEN DE HOOKS ---
  // Se declara el hook 'useCampaignDraft' ANTES de cualquier hook que lo utilice.
  const { draft, updateDraft } = useCampaignDraft();
  // --- [FIN] REFACTORIZACIÓN ARQUITECTÓNICA ---

  // --- [INICIO] PILAR III: OBSERVABILIDAD DE CICLO DE VIDA COMPLETO ---
  const traceId = useMemo(
    () => logger.startTrace("Step0Client_Lifecycle_v14.1"),
    []
  );
  useEffect(() => {
    const groupId = logger.startGroup(
      `[Step0Client] Orquestador de cliente montado.`
    );
    logger.info("Estado inicial del borrador consumido.", {
      traceId,
      draftId: draft.draftId,
    });
    return () => {
      logger.endGroup(groupId);
      logger.endTrace(traceId);
    };
  }, [traceId, draft.draftId]);
  // --- [FIN] PILAR III ---

  const wizardContext = useWizard();
  const [submissionState, setSubmissionState] = useState<
    "form" | "stamping" | "complete"
  >("form");

  const form = useForm<Step0Data>({
    resolver: zodResolver(step0Schema),
    defaultValues: {
      baseCampaignId: draft.baseCampaignId ?? baseCampaigns[0] ?? "",
      variantName: draft.variantName ?? "",
      seoKeywords: draft.seoKeywords ?? "",
      producer: draft.producer ?? "",
      campaignType: draft.campaignType ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      baseCampaignId: draft.baseCampaignId ?? baseCampaigns[0] ?? "",
      variantName: draft.variantName ?? "",
      seoKeywords: draft.seoKeywords ?? "",
      producer: draft.producer ?? "",
      campaignType: draft.campaignType ?? "",
    });
  }, [draft, baseCampaigns, form]);

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

  const onSubmit = (data: Step0Data) => {
    const submitTraceId = logger.startTrace("Step0Client.onSubmit_v14.1");
    const groupId = logger.startGroup(
      "[Step0Client] Procesando envío...",
      submitTraceId
    );

    try {
      const { isValid, message } = validateStep0(data);
      if (!isValid) {
        toast.error("Formulario Incompleto", { description: message });
        logger.warn(`[Guardián Step0] Envío bloqueado. Causa: ${message}`, {
          traceId: submitTraceId,
        });
        return;
      }
      logger.traceEvent(
        submitTraceId,
        "Validación de datos de formulario exitosa."
      );

      const newCompletedSteps = Array.from(
        new Set([...draft.completedSteps, 0])
      );
      updateDraft({ ...data, completedSteps: newCompletedSteps });
      logger.success(
        "[Step0Client] Store centralizado actualizado. Cambiando a 'stamping'.",
        { traceId: submitTraceId }
      );

      setSubmissionState("stamping");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido.";
      logger.error(
        "[Guardián] Fallo inesperado durante la actualización de estado.",
        { error: errorMessage, traceId: submitTraceId }
      );
      toast.error("Error Interno", {
        description: "No se pudieron guardar los datos.",
      });
    } finally {
      logger.endGroup(groupId);
      logger.endTrace(submitTraceId);
    }
  };

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
          <Step0Form
            form={form}
            content={content}
            baseCampaigns={baseCampaigns}
            onSubmit={onSubmit}
          />
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
            <CardContent className="pt-6 min-h-[500px] flex items-center justify-center relative overflow-hidden">
              <PassportStamp label={content.passportStampLabel} />
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
