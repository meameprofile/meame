// RUTA: src/components/features/campaign-suite/Step5_Management/_components/ArtifactHistory.tsx
/**
 * @file ArtifactHistory.tsx
 * @description Componente de UI para mostrar y descargar el historial de artefactos.
 *              Forjado con observabilidad de élite, resiliencia y un contrato de datos i18n.
 * @version 2.1.0 (Barrel File Eradication)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useTransition } from "react";
import { toast } from "sonner";

// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA v2.1.0] ---
// Se eliminó la dependencia del archivo barril. Cada acción y tipo ahora se importa
// directamente desde su archivo soberano para garantizar la integridad del build.
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { Button, DynamicIcon, Skeleton } from "@/components/ui";
import { getArtifactDownloadUrlAction } from "@/shared/lib/actions/campaign-suite/getArtifactDownloadUrl.action";
import {
  getArtifactsForDraftAction,
  type ArtifactMetadata,
} from "@/shared/lib/actions/campaign-suite/getArtifactsForDraft.action";
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA v2.1.0] ---
import { logger } from "@/shared/lib/logging";

interface ArtifactHistoryContent {
  title: string;
  loadingHistoryText: string;
  emptyStateText: string;
  downloadButtonText: string;
  downloadingButtonText: string;
  errorLoadingHistory: string;
  errorDownloading: string;
}

interface ArtifactHistoryProps {
  draftId: string;
  content: ArtifactHistoryContent;
}

const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export function ArtifactHistory({
  draftId,
  content,
}: ArtifactHistoryProps): React.ReactElement {
  logger.info(
    `[ArtifactHistory] Renderizando historial v2.1 para draft: ${draftId}`
  );

  const [artifacts, setArtifacts] = useState<ArtifactMetadata[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, startLoadingTransition] = useTransition();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    startLoadingTransition(async () => {
      logger.trace("[ArtifactHistory] Iniciando fetch de artefactos...");
      const result = await getArtifactsForDraftAction(draftId);
      if (result.success) {
        setArtifacts(result.data);
        logger.success(
          `[ArtifactHistory] Se cargaron ${result.data.length} artefactos.`
        );
      } else {
        logger.error("[ArtifactHistory] Fallo al cargar el historial.", {
          error: result.error,
        });
        setFetchError(result.error);
        toast.error(content.errorLoadingHistory, {
          description: result.error,
        });
      }
    });
  }, [draftId, content.errorLoadingHistory]);

  const handleDownload = async (artifactId: string) => {
    logger.trace(`[ArtifactHistory] Iniciando descarga para: ${artifactId}`);
    setDownloadingId(artifactId);
    const result = await getArtifactDownloadUrlAction(artifactId);
    if (result.success) {
      window.open(result.data.downloadUrl, "_blank");
    } else {
      logger.error("[ArtifactHistory] Fallo al obtener URL de descarga.", {
        error: result.error,
      });
      toast.error(content.errorDownloading, { description: result.error });
    }
    setDownloadingId(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-4 space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-2/3" />
        </div>
      );
    }

    if (fetchError) {
      return (
        <DeveloperErrorDisplay
          context="ArtifactHistory"
          errorMessage={content.errorLoadingHistory}
          errorDetails={fetchError}
        />
      );
    }

    if (artifacts.length === 0) {
      return (
        <p className="p-8 text-center text-sm text-muted-foreground">
          {content.emptyStateText}
        </p>
      );
    }

    return (
      <ul className="divide-y">
        <AnimatePresence>
          {artifacts.map((artifact, index) => (
            <motion.li
              key={artifact.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3"
            >
              <div className="flex items-center gap-4">
                <DynamicIcon name="Package" className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Versión {artifact.version}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(artifact.created_at).toLocaleString()} -{" "}
                    {formatBytes(artifact.file_size)}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(artifact.id)}
                disabled={!!downloadingId}
              >
                {downloadingId === artifact.id ? (
                  <DynamicIcon
                    name="LoaderCircle"
                    className="mr-2 h-4 w-4 animate-spin"
                  />
                ) : (
                  <DynamicIcon name="Download" className="mr-2 h-4 w-4" />
                )}
                {downloadingId === artifact.id
                  ? content.downloadingButtonText
                  : content.downloadButtonText}
              </Button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{content.title}</h3>
      <div className="border rounded-lg overflow-hidden">{renderContent()}</div>
    </div>
  );
}
