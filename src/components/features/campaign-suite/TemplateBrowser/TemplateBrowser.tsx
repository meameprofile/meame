// RUTA: src/components/features/campaign-suite/TemplateBrowser/TemplateBrowser.tsx
/**
 * @file TemplateBrowser.tsx
 * @description Interfaz para seleccionar una plantilla o empezar de cero.
 * @version 7.2.0 (Routing Contract Restoration): Se corrige la clave de ruta
 *              utilizada al iniciar desde cero, alineándola con la SSoT de 'navigation.ts'.
 * @author L.I.A. Legacy
 */
"use client";

import { motion, type Variants } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { Button, Separator, Skeleton } from "@/components/ui";
import { useTemplateLoader } from "@/shared/hooks/campaign-suite/use-template-loader";
import { getCampaignTemplatesAction } from "@/shared/lib/actions/campaign-suite/getCampaignTemplates.action";
import { logger } from "@/shared/lib/logging";
import { routes } from "@/shared/lib/navigation";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import { useCampaignDraftStore } from "@/shared/lib/stores/campaign-draft.store";
import { useWorkspaceStore } from "@/shared/lib/stores/use-workspace.store";
import { getCurrentLocaleFromPathname } from "@/shared/lib/utils/i18n/i18n.utils";

import { TemplateCard } from "./_components/TemplateCard";

type TemplateBrowserContent = NonNullable<Dictionary["campaignSuitePage"]>;

interface TemplateBrowserProps {
  content: TemplateBrowserContent;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function TemplateBrowser({ content }: TemplateBrowserProps) {
  const traceId = useMemo(
    () => logger.startTrace("TemplateBrowser_Lifecycle_v7.2"),
    []
  );
  useEffect(() => {
    logger.info("[TemplateBrowser] Componente montado (v7.2).", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const router = useRouter();
  const pathname = usePathname();
  const locale = getCurrentLocaleFromPathname(pathname);
  const resetDraft = useCampaignDraftStore((s) => s.resetDraft);

  const {
    activeWorkspaceId,
    templates,
    isLoadingTemplates,
    setTemplates,
    setLoadingTemplates,
  } = useWorkspaceStore();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!activeWorkspaceId) {
      logger.warn(
        "[TemplateBrowser] Fetch de plantillas omitido: no hay workspace activo.",
        { traceId }
      );
      setLoadingTemplates(false);
      setTemplates([]);
      return;
    }

    if (templates.length === 0) {
      logger.traceEvent(
        traceId,
        `Iniciando fetch de plantillas para workspace: ${activeWorkspaceId}`
      );
      setLoadingTemplates(true);
      getCampaignTemplatesAction(activeWorkspaceId).then((result) => {
        if (result.success) {
          setTemplates(result.data);
          logger.success(
            `[TemplateBrowser] Se cargaron ${result.data.length} plantillas.`,
            { traceId }
          );
        } else {
          logger.error("[TemplateBrowser] Fallo al cargar las plantillas.", {
            error: result.error,
            traceId,
          });
          toast.error("Error al cargar plantillas", {
            description: result.error,
          });
        }
      });
    }
  }, [
    activeWorkspaceId,
    templates.length,
    setTemplates,
    setLoadingTemplates,
    traceId,
  ]);

  const { loadTemplate, isPending: isTemplateLoading } = useTemplateLoader(() =>
    setSelectedTemplateId(null)
  );

  const handleStartFromScratch = () => {
    logger.traceEvent(traceId, "Acción: Iniciar desde cero.");
    resetDraft();
    // --- [INICIO DE REFACTORIZACIÓN DE CONTRATO DE RUTA v23.1.0] ---
    // Se utiliza la clave correcta 'creatorCampaignSuiteWithStepId' desde la SSoT.
    router.push(
      routes.creatorCampaignSuiteWithStepId.path({ locale, stepId: ["0"] })
    );
    // --- [FIN DE REFACTORIZACIÓN DE CONTRATO DE RUTA v23.1.0] ---
  };

  const handleTemplateSelect = (templateId: string) => {
    logger.traceEvent(traceId, `Acción: Seleccionando plantilla ${templateId}`);
    setSelectedTemplateId(templateId);
    loadTemplate(templateId, content.templateCopySuffix);
  };

  if (!content) {
    const errorMsg = "Contrato de UI violado: La prop 'content' es requerida.";
    logger.error(`[Guardián] ${errorMsg}`, { traceId });
    return (
      <DeveloperErrorDisplay
        context="TemplateBrowser"
        errorMessage={errorMsg}
      />
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto py-12"
    >
      <motion.div
        variants={itemVariants}
        className="max-w-3xl mx-auto text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight">
          Inicia tu Próxima Obra Maestra
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Acelera tu creación adaptando una plantilla probada en batalla, o
          forja una nueva leyenda desde cero.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="my-12">
        <h2 className="text-2xl font-semibold mb-6">
          Desde tu Arsenal de Plantillas
        </h2>
        {isLoadingTemplates ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        ) : templates.length > 0 ? (
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={() => handleTemplateSelect(template.id)}
                isPending={
                  isTemplateLoading && selectedTemplateId === template.id
                }
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            variants={itemVariants}
            className="py-16 border border-dashed rounded-lg text-center text-muted-foreground"
          >
            <p className="font-semibold">Tu arsenal está vacío.</p>
            <p className="text-sm">
              Guarda una campaña como plantilla para verla aquí.
            </p>
          </motion.div>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="relative my-12">
        <Separator />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-background px-4 text-muted-foreground">O</span>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="text-center">
        <Button
          onClick={handleStartFromScratch}
          size="lg"
          variant="outline"
          disabled={isTemplateLoading}
        >
          Forjar desde Cero
        </Button>
      </motion.div>
    </motion.div>
  );
}
