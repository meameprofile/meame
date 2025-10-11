// RUTA: src/components/features/campaign-suite/Step4_Content/_components/EditorOrchestrator.tsx
/**
 * @file EditorOrchestrator.tsx
 * @description Aparato atómico que orquesta el renderizado del ContentEditor.
 * @version 4.0.0 (ACS Path & Build Integrity Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";
import { AnimatePresence } from "framer-motion";
import React from "react";

import { sectionsConfig } from "@/shared/lib/config/sections.config";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";

import { ContentEditor } from "../ContentEditor";

interface EditorOrchestratorProps {
  draft: CampaignDraft;
  editingSection: string | null;
  onCloseEditor: () => void;
  onUpdateContent: (
    sectionName: string,
    locale: Locale,
    field: string,
    value: unknown
  ) => void;
}

export function EditorOrchestrator({
  draft,
  editingSection,
  onCloseEditor,
  onUpdateContent,
}: EditorOrchestratorProps) {
  const editingSectionSchema = editingSection
    ? sectionsConfig[editingSection as keyof typeof sectionsConfig]?.schema
    : null;

  return (
    <AnimatePresence>
      {editingSection && editingSectionSchema && (
        <ContentEditor
          sectionName={editingSection}
          sectionSchema={editingSectionSchema}
          draft={draft}
          onClose={onCloseEditor}
          onUpdateContent={onUpdateContent}
        />
      )}
    </AnimatePresence>
  );
}
