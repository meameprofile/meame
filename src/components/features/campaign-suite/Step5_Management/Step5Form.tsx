// RUTA: src/components/features/campaign-suite/Step5_Management/Step5Form.tsx
/**
 * @file Step5Form.tsx
 * @description Aparato de presentación puro para la maquetación del Paso 5,
 *              inyectado con MEA/UX y observabilidad de élite.
 * @version 17.0.0 (Elite MEA/UX & Observability)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  AlertDialog,
  Separator,
} from "@/components/ui";
import { logger } from "@/shared/lib/logging";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";
import type { ChecklistItem } from "@/shared/lib/utils/campaign-suite/draft.validator";
import {
  CampaignSummary,
  ManagementActions,
  DeleteDraftDialog,
  LaunchChecklist,
} from "./_components";
import type { z } from "zod";
import type { Step5ContentSchema } from "@/shared/lib/schemas/campaigns/steps/step5.schema";

type Content = z.infer<typeof Step5ContentSchema>;

interface Step5FormProps {
  draft: CampaignDraft;
  checklistItems: ChecklistItem[];
  content: Content;
  onBack: () => void;
  onPublish: () => void;
  onPackage: () => void;
  onConfirmDelete: () => void;
  onSaveAsTemplate: (name: string, description: string) => void;
  isPublishing: boolean;
  isPackaging: boolean;
  isDeleting: boolean;
  isSavingTemplate: boolean;
  isLaunchReady: boolean;
  artifactHistorySlot: React.ReactNode;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

export function Step5Form({
  draft,
  checklistItems,
  content,
  onBack,
  onPublish,
  onPackage,
  onConfirmDelete,
  onSaveAsTemplate,
  isPublishing,
  isPackaging,
  isDeleting,
  isSavingTemplate,
  isLaunchReady,
  artifactHistorySlot,
}: Step5FormProps): React.ReactElement {
  logger.trace(
    "[Step5Form] Renderizando orquestador de presentación v17.0 (MEA/UX)."
  );

  return (
    <AlertDialog>
      <Card>
        <CardHeader>
          <CardTitle>{content.title}</CardTitle>
          <CardDescription>{content.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <CampaignSummary
                draft={draft}
                title={content.summaryTitle}
                placeholder={content.summaryPlaceholder}
              />
              <LaunchChecklist
                items={checklistItems}
                title={content.checklistTitle}
              />
            </div>

            {artifactHistorySlot && (
              <motion.div
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              >
                <Separator />
                {artifactHistorySlot}
              </motion.div>
            )}

            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            >
              <ManagementActions
                onBack={onBack}
                onPublish={onPublish}
                onPackage={onPackage}
                onSaveAsTemplate={onSaveAsTemplate}
                isPublishing={isPublishing}
                isPackaging={isPackaging}
                isDeleting={isDeleting}
                isSavingTemplate={isSavingTemplate}
                isLaunchReady={isLaunchReady}
                publishButtonText={content.publishButtonText}
                packageButtonText={content.packageButtonText}
                deleteButtonText={content.deleteButtonText}
                templateButtonText={content.templateButtonText}
                templateDialogContent={content.templateDialog}
              />
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
      <DeleteDraftDialog
        content={content.deleteDialog}
        draftName={draft.campaignName || ""}
        onConfirmDelete={onConfirmDelete}
        isDeleting={isDeleting}
      />
    </AlertDialog>
  );
}
