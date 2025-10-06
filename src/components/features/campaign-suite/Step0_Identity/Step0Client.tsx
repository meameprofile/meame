// RUTA: src/components/features/campaign-suite/Step0_Identity/Step0Client.tsx
/**
 * @file Step0Client.tsx
 * @description Componente Contenedor de Cliente para el Paso 0, nivelado con
 *              observabilidad de élite y cumplimiento estricto de contratos.
 * @version 12.0.0 (Holistic Observability & Contract Integrity)
 * @author L.I.A. Legacy
 */
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AnimatePresence,
  motion,
  type Variants,
  type Transition,
} from "framer-motion";
import { z } from "zod";
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
import { useDraftMetadataStore } from "@/shared/hooks/campaign-suite/use-draft-metadata.store";
import { useStep0IdentityStore } from "@/shared/hooks/campaign-suite/use-step0-identity.store";
import { DeveloperErrorDisplay } from "../../dev-tools";

type Step0Content = z.infer<typeof Step0ContentSchema>;

interface Step0ClientProps {
  content: Step0Content;
  baseCampaigns: string[];
}

export function Step0Client({
  content,
  baseCampaigns,
}: Step0ClientProps): React.ReactElement {
  const traceId = useMemo(
    () => logger.startTrace("Step0Client_Lifecycle_v12.0"),
    []
  );
  useEffect(() => {
    logger.info("[Step0Client] Orquestador de cliente montado.", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const {
    baseCampaignId,
    variantName,
    seoKeywords,
    setMetadata,
    completeStep,
  } = useDraftMetadataStore();
  const { producer, campaignType, setStep0Data } = useStep0IdentityStore();
  const wizardContext = useWizard();
  const [submissionState, setSubmissionState] = useState<
    "form" | "stamping" | "complete"
  >("form");

  const form = useForm<Step0Data>({
    resolver: zodResolver(step0Schema),
    defaultValues: {
      baseCampaignId: baseCampaignId ?? baseCampaigns[0] ?? "",
      variantName: variantName ?? "",
      seoKeywords: seoKeywords ?? "",
      producer: producer ?? "",
      campaignType: campaignType ?? "",
    },
  });

  useEffect(() => {
    if (submissionState === "stamping") {
      logger.traceEvent(
        traceId,
        "Estado de UI cambiado a 'stamping'. Iniciando animación MEA/UX de 2 segundos."
      );
      const timer = setTimeout(() => setSubmissionState("complete"), 2000);
      return () => clearTimeout(timer);
    }
    if (submissionState === "complete") {
      logger.traceEvent(
        traceId,
        "Estado de UI cambiado a 'complete'. Navegando al siguiente paso..."
      );
      if (wizardContext) {
        wizardContext.goToNextStep();
      } else {
        logger.error(
          "[Guardián] WizardContext no está disponible para la navegación.",
          { traceId }
        );
      }
    }
  }, [submissionState, wizardContext, traceId]);

  const onSubmit = (data: Step0Data) => {
    const submitTraceId = logger.startTrace("Step0Client.onSubmit");
    // --- [INICIO DE CORRECCIÓN DE CONTRATO v12.0.0] ---
    const groupId = logger.startGroup(
      "[Step0Client] Procesando envío de formulario...",
      submitTraceId
    );
    // --- [FIN DE CORRECCIÓN DE CONTRATO v12.0.0] ---

    try {
      logger.traceEvent(
        submitTraceId,
        "Datos del formulario validados con éxito.",
        data
      );

      setMetadata({
        baseCampaignId: data.baseCampaignId,
        variantName: data.variantName,
        seoKeywords: data.seoKeywords,
      });
      logger.traceEvent(
        submitTraceId,
        "Store 'useDraftMetadataStore' actualizado y persistido en localStorage."
      );

      setStep0Data({
        producer: data.producer,
        campaignType: data.campaignType,
      });
      logger.traceEvent(
        submitTraceId,
        "Store 'useStep0IdentityStore' actualizado y persistido en localStorage."
      );

      completeStep(0);
      logger.traceEvent(
        submitTraceId,
        "Paso 0 marcado como completado en 'useDraftMetadataStore'."
      );

      logger.success(
        "[Step0Client] Todos los stores atómicos actualizados. Cambiando estado a 'stamping'.",
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
        description: "No se pudieron guardar los datos. Revisa la consola.",
      });
    } finally {
      // --- [INICIO DE CORRECCIÓN DE CONTRATO v12.0.0] ---
      logger.endGroup(groupId);
      logger.endTrace(submitTraceId);
      // --- [FIN DE CORRECCIÓN DE CONTRATO v12.0.0] ---
    }
  };

  if (!wizardContext) {
    const errorMsg =
      "Guardián de Contexto: Renderizado fuera de WizardProvider.";
    logger.error(`[Step0Client] ${errorMsg}`, { traceId });
    return (
      <DeveloperErrorDisplay context="Step0Client" errorMessage={errorMsg} />
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
