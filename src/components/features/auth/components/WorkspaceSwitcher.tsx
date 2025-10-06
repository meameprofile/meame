// RUTA: src/components/features/auth/components/WorkspaceSwitcher.tsx
/**
 * @file WorkspaceSwitcher.tsx
 * @description Componente de cliente "Guardián de Contexto" para el workspace.
 *              Maneja de forma resiliente la carga, el estado vacío y los errores,
 *              garantizando que el usuario siempre tenga un contexto de trabajo claro.
 * @version 2.0.0 (Elite Resilience & Full Observability)
 * @author L.I.A. Legacy
 */
"use client";

import React, { useEffect, useState, useTransition, useMemo } from "react";
import { toast } from "sonner";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/DropdownMenu";
import {
  DynamicIcon,
  Skeleton,
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui";
import { useWorkspaceStore } from "@/shared/lib/stores/use-workspace.store";
import { getWorkspacesForUserAction } from "@/shared/lib/actions/workspaces/getWorkspacesForUser.action";
import { logger } from "@/shared/lib/logging";
import type { WorkspaceSwitcherContent } from "@/shared/lib/schemas/components/auth/workspace-switcher.schema";

interface WorkspaceSwitcherProps {
  content: WorkspaceSwitcherContent;
}

export function WorkspaceSwitcher({
  content,
}: WorkspaceSwitcherProps): React.ReactElement {
  const traceId = useMemo(
    () => logger.startTrace("WorkspaceSwitcher_v2.0"),
    []
  );
  const {
    activeWorkspaceId,
    availableWorkspaces,
    setActiveWorkspace,
    setAvailableWorkspaces,
  } = useWorkspaceStore();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    logger.info(
      "[WorkspaceSwitcher] Componente montado. Iniciando obtención de workspaces.",
      { traceId }
    );
    startTransition(async () => {
      const result = await getWorkspacesForUserAction();
      if (result.success) {
        setAvailableWorkspaces(result.data);
        setError(null);
        logger.success(
          `[WorkspaceSwitcher] Se cargaron ${result.data.length} workspaces.`,
          { traceId }
        );
      } else {
        setError(result.error);
        toast.error(content.errorTitle, {
          description: content.errorDescription,
        });
        logger.error("[WorkspaceSwitcher] Fallo al cargar workspaces.", {
          error: result.error,
          traceId,
        });
      }
    });

    return () => {
      logger.endTrace(traceId);
    };
  }, [
    setAvailableWorkspaces,
    traceId,
    content.errorTitle,
    content.errorDescription,
  ]);

  const activeWorkspace = availableWorkspaces.find(
    (ws) => ws.id === activeWorkspaceId
  );

  // --- ESTADO DE CARGA ---
  if (isPending) {
    return (
      <div className="px-2 py-1.5 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  // --- ESTADO DE ERROR ---
  if (error) {
    return (
      <div className="p-2">
        <Alert variant="destructive">
          <DynamicIcon name="TriangleAlert" className="h-4 w-4" />
          <AlertTitle>{content.errorTitle}</AlertTitle>
          <AlertDescription>{content.errorDescription}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // --- ESTADO VACÍO ---
  if (availableWorkspaces.length === 0) {
    return (
      <div className="p-2">
        <Alert variant="destructive">
          <DynamicIcon name="ShieldAlert" className="h-4 w-4" />
          <AlertTitle>{content.noWorkspacesTitle}</AlertTitle>
          <AlertDescription>{content.noWorkspacesDescription}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // --- ESTADO DE ÉXITO ---
  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel>{content.activeWorkspaceLabel}</DropdownMenuLabel>
      <div className="px-2 font-semibold text-foreground truncate">
        {activeWorkspace?.name || content.loadingText}
      </div>
      <DropdownMenuSeparator />
      {availableWorkspaces.map((workspace) => (
        <DropdownMenuItem
          key={workspace.id}
          onClick={() => {
            logger.traceEvent(
              traceId,
              `Acción: Usuario cambió a workspace ${workspace.id}`
            );
            setActiveWorkspace(workspace.id);
          }}
          className="cursor-pointer"
        >
          {workspace.id === activeWorkspaceId && (
            <DynamicIcon name="Check" className="mr-2 h-4 w-4" />
          )}
          <span className={workspace.id !== activeWorkspaceId ? "ml-6" : ""}>
            {workspace.name}
          </span>
        </DropdownMenuItem>
      ))}
    </DropdownMenuGroup>
  );
}
